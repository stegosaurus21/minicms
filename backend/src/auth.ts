import createError from "http-errors";
import { AuthValidation, Session } from "./interface";
import { v4 } from "uuid";
import { prisma } from "./server";
import { Request } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "./helper";

export const tokens: Map<String, Session> = new Map<String, Session>();

export async function isAdmin(uId: number) {
  return (
    await prisma.user.findUniqueOrThrow({
      select: {
        admin: true,
      },
      where: {
        id: uId,
      },
    })
  ).admin;
}

export const protectedProcedure = publicProcedure.use(({ next, ctx }) => {
  const { token, uId } = ctx;

  if (token === undefined || uId === undefined) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Invalid or expired token.",
    });
  }

  return next({
    ctx: {
      token: token,
      uId: uId,
    },
  });
});

export const authRouter = router({
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const { uId } = ctx;
    return isAdmin(uId);
  }),

  usernameAvailable: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return (
        (await prisma.user.findUnique({
          where: { username: input.username },
        })) === null
      );
    }),

  register: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      try {
        await prisma.user.create({
          data: { username: input.username, password: hash(input.password) },
        });
      } catch (err) {
        console.log(err);
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P2002")
            throw new TRPCError({
              code: "CONFLICT",
              message: "Username in use.",
            });
        }
        throw err;
      }
    }),

  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await prisma.user.findUniqueOrThrow({
          where: {
            username: input.username,
          },
        });

        if (result.password === hash(input.password)) {
          let newToken = v4();
          let newSession: Session = {
            uId: result.id,
            timeout: Date.now() + 1000 * 60 * 60 * 12,
          };
          tokens.set(newToken, newSession);

          return {
            token: newToken,
            forceResetPassword: result.force_reset_password,
          };
        } else {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Incorrect username or password.",
          });
        }
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code == "P2025")
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Incorrect username or password.",
            });
        }
        if (e instanceof TRPCError) {
          throw e;
        }
        throw createError(
          500,
          `Unhandled login error: ${(e as Error).message}`
        );
      }
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    return tokens.delete(ctx.token || "");
  }),

  validate: publicProcedure.query(async ({ ctx }): Promise<AuthValidation> => {
    const token = ctx.token;
    if (!token) return { isLoggedIn: false, username: null };

    const session = tokens.get(token);
    if (session === undefined || session.timeout < Date.now()) {
      return { isLoggedIn: false, username: null };
    }

    return { isLoggedIn: true, username: await getUsername(session.uId) };
  }),

  changePassword: protectedProcedure
    .input(z.object({ password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const { uId } = ctx;
      const { password } = input;

      const result = await prisma.user.findUniqueOrThrow({
        where: {
          id: uId,
        },
      });

      if (hash(password) === result.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New password cannot be the same as the existing password.",
        });
      }

      await prisma.user.update({
        where: {
          id: uId,
        },
        data: {
          password: hash(password),
          force_reset_password: false,
        },
      });
    }),
});

export async function getUser(req: Request): Promise<number> {
  const token = req.header("token");
  const session = tokens.get(token || "");
  if (
    token === undefined ||
    session === undefined ||
    session.timeout < Date.now()
  ) {
    throw createError(403, "Invalid or expired token.");
  }

  return session.uId;
}

export async function getUsername(uId: number) {
  return (
    await prisma.user.findUniqueOrThrow({
      where: {
        id: uId,
      },
    })
  ).username;
}
