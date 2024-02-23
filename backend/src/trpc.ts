import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
import { getUser } from "./auth";
import z from "zod";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure
  .input(z.optional(z.object({ _wsAuthToken: z.optional(z.string()) })))
  .use(async ({ next, ctx, input }) => {
    let uId: number | undefined;
    const token = ctx.token || input?._wsAuthToken;
    try {
      if (token) {
        uId = await getUser(token);
      }
    } catch {
      uId = undefined;
    }
    return next({
      ctx: {
        ...ctx,
        token: token,
        uId: uId,
      },
    });
  });
