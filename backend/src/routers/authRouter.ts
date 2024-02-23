import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { getUser, getUsername, isAdmin } from "../auth";
import { prisma } from "../server";
import { hash } from "../helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { v4 } from "uuid";
import { AuthValidation } from "../interface";

export const protectedProcedure = publicProcedure.use(
  ({ next, input, ctx }) => {
    const { uId } = ctx;
    const token = ctx.token || input?._wsAuthToken;

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
  }
);

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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unhandled login error: ${(e as Error).message}`,
        });
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
