import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { authRouter } from "./auth";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;