import { publicProcedure, router } from "./trpc";
import { authRouter } from "./auth";
import { contestRouter } from "./contest";
import { challengeRouter } from "./challenge";
import { resultsRouter } from "./results";
import { judgeLanguages } from "./server";

export const appRouter = router({
  auth: authRouter,
  contest: contestRouter,
  challenge: challengeRouter,
  results: resultsRouter,
  languages: publicProcedure.query(() => {
    return judgeLanguages;
  }),
});

export type AppRouter = typeof appRouter;
