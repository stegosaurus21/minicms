import { router } from "./trpc";
import { authRouter } from "./auth";
import { contestRouter } from "./contest";
import { challengeRouter } from "./challenge";

export const appRouter = router({
  auth: authRouter,
  contest: contestRouter,
  challenge: challengeRouter,
});

export type AppRouter = typeof appRouter;
