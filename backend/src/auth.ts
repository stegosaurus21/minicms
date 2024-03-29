import createError from "http-errors";
import { AuthValidation } from "./interface";
import { v4 } from "uuid";
import { prisma } from "./server";
import { Request } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "./helper";

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
          const newToken = v4();
          await prisma.token.create({
            data: {
              token: newToken,
              expiry: new Date(Date.now() + 1000 * 60 * 60 * 6),
              owner: {
                connect: {
                  id: result.id,
                },
              },
            },
          });

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
          if (e.code === "P2025")
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

  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.token) return;
    await prisma.token.delete({ where: { token: ctx.token } });
  }),

  validate: publicProcedure.query(async ({ ctx }): Promise<AuthValidation> => {
    const token = ctx.token;
    if (!token) return { isLoggedIn: false, username: null };

    let uId = -1;
    try {
      uId = await getUser(token);
    } catch (e) {
      return { isLoggedIn: false, username: null };
    }

    return { isLoggedIn: true, username: await getUsername(uId) };
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

export async function getUser(token: string | undefined): Promise<number> {
  const session = await prisma.token.findUnique({
    where: { token: token || "" },
  });
  if (token === undefined || session === null || session.expiry < new Date()) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Expired or invalid token.",
    });
  }
  // Refresh the token if there is less than 3 hours expiry
  if (session.expiry < new Date(Date.now() + 1000 * 60 * 60 * 3)) {
    await prisma.token.update({
      where: { token: token },
      data: { expiry: new Date(Date.now() + 1000 * 60 * 60 * 6) },
    });
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
