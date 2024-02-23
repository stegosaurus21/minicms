import { publicProcedure, router } from "./trpc";
import { authRouter } from "./routers/authRouter";
import { contestRouter } from "./routers/contestRouter";
import { challengeRouter } from "./routers/challengeRouter";
import { resultsRouter } from "./routers/resultsRouter";
import { judgeLanguages } from "./server";
import { adminRouter } from "./routers/adminRouter";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  contest: contestRouter,
  challenge: challengeRouter,
  results: resultsRouter,
  languages: publicProcedure.query(() => {
    return judgeLanguages;
  }),
});

export type AppRouter = typeof appRouter;
