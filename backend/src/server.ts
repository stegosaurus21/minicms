import express, { json } from "express";
import config from "../config.json";
import cors from "cors";
import fileUpload from "express-fileupload";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./context";
import { submit } from "./submit";
import {
  checkSubmissionAuth,
  getLeaderboard,
  getResult,
  getSource,
  getTest,
  judgeCallback,
  processResult,
} from "./results";
import { clear, errorHandler } from "./other";
import morgan from "morgan";
import { getUser } from "./auth";
import { v4 } from "uuid";
import {
  checkChallengeAuth,
  getChallengeDescription,
  getChallengeExternal,
} from "./challenge";
import cookie_parser from "cookie-parser";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { appRouter } from "./app";
import { JudgeLanguage } from "./interface";
// import { appRouter } from "./trpc";

export const prisma = new PrismaClient();

// sqlite3.verbose();
// export const db = new sqlite3.Database("./db.sqlite3");

const app = express();
let judgeLanguages: JudgeLanguage[];
let lastClear = Date.now();

app.use(json());
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload({ createParentPath: true }));
app.use(cookie_parser());

app.get("/", (req, res) => {
  return res.json("Hackern't");
});

/*app.post("/auth/register", async (req, res, next) => {
  try {
    await register(req.body.username, req.body.password);
    return res.json({});
  } catch (err) {
    next(err);
  }
});

app.post("/auth/login", async (req, res, next) => {
  try {
    return res.json({
      token: await login(req.body.username, req.body.password),
    });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/logout", (req, res, next) => {
  try {
    const token = req.header("token");
    if (token) logout(token);
    return res.json({});
  } catch (err) {
    next(err);
  }
});*/

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.delete("/clear", async (req, res) => {
  lastClear = Date.now();
  await clear();
  return res.json();
});

/* app.get("/contest/list", async (req, res, next) => {
  try {
    return res.json({ contests: await getContests() });
  } catch (err) {
    next(err);
  }
}); */

app.get("/languages", async (req, res, next) => {
  try {
    return res.json(judgeLanguages);
  } catch (err) {
    next(err);
  }
});

app.get("/results/leaderboard", async (req, res, next) => {
  try {
    const contest = req.query.contest as string;
    return res.json(await getLeaderboard(contest));
  } catch (err) {
    next(err);
  }
});

export const judgeSecret = v4();
app.put(
  `/callback/${judgeSecret}/:submission/:testNum/:timeSent`,
  async (req, res) => {
    if (parseInt(req.params.timeSent) < lastClear) return res.json();
    await judgeCallback(
      req.body,
      req.params.submission,
      parseInt(req.params.testNum)
    );
    return res.json();
  }
);

/* app.get("/contest", async (req, res, next) => {
  try {
    const contest = req.query.contest as string;
    let uId: number | undefined = undefined;
    try {
      uId = await getUser(req);
    } catch {}
    return res.json(await getContestExternal(contest, uId));
  } catch (err) {
    next(err);
  }
}); */

app.use(errorHandler);
// app.use(auth);

/* app.get("/auth/validate", async (req, res, next) => {
  try {
    return res.json({ username: await getUsername(req) });
  } catch (err) {
    next(err);
  }
}); */

/* app.post("/submit", async (req, res, next) => {
  try {
    const { contest, challenge, language_id } = req.body;
    const user = await getUser(req);
    await checkChallengeAuth(user, contest, challenge);
    const result = await submit(
      req.files,
      user,
      contest,
      challenge,
      parseInt(language_id)
    );
    res.json({ token: result.submissionToken });
    await result.resultPromise;
    await processResult(result.submissionToken);
    return;
  } catch (err) {
    next(err);
  }
}); */

/* app.post("/contest/join", async (req, res, next) => {
  try {
    const uId = await getUser(req);
    const { contest } = req.body;
    await joinContest(uId, contest);
    return res.json({});
  } catch (err) {
    next(err);
  }
}); */

/* app.get("/contest/validate", async (req, res, next) => {
  try {
    const uId = await getUser(req);
    const contest = req.query.contest as string;
    return res.json({ time: await checkContestAuth(uId, contest) });
  } catch (err) {
    next(err);
  }
}); */

/* app.get("/contest/challenges", async (req, res, next) => {
  try {
    const contest = req.query.contest as string;
    const uId = await getUser(req);
    const official = (req.query.unofficial as string) === "true";
    await checkContestAuth(uId, contest);
    return res.json({
      challenges: (await getContestExternal(contest, uId)).challenges,
    });
  } catch (err) {
    next(err);
  }
}); */

/* app.get("/challenge/validate", async (req, res, next) => {
  try {
    const uId = await getUser(req);
    const contest = req.query.contest as string;
    const challenge = req.query.challenge as string;
    await checkChallengeAuth(uId, contest, challenge);
    return res.json({});
  } catch (err) {
    next(err);
  }
}); */

/* app.get("/challenge", async (req, res, next) => {
  try {
    const contest = req.query.contest as string;
    const challenge = req.query.challenge as string;
    const user = await getUser(req);
    await checkChallengeAuth(user, contest, challenge);
    return res.json(await getChallengeExternal(contest, challenge));
  } catch (err) {
    next(err);
  }
}); */

/* app.get("/results/validate", async (req, res, next) => {
  try {
    const contest = req.query.contest as string;
    const challenge = req.query.challenge as string;
    const submission = req.query.submission as string;
    const user = await getUser(req);
    await checkChallengeAuth(user, contest, challenge);
    await checkSubmissionAuth(user, submission);
    return res.json({});
  } catch (err) {
    next(err);
  }
});

app.get("/results", async (req, res, next) => {
  try {
    const submission = req.query.submission as string;
    const user = await getUser(req);
    await checkSubmissionAuth(user, submission);
    return res.json(await getResult(submission));
  } catch (err) {
    next(err);
  }
});

app.get("/results/source", async (req, res, next) => {
  try {
    const submission = req.query.submission as string;
    const user = await getUser(req);
    await checkSubmissionAuth(user, submission);
    return res.json(await getSource(submission));
  } catch (err) {
    next(err);
  }
});

app.get("/results/tests/:test", async (req, res, next) => {
  try {
    const submission = req.query.submission as string;
    const user = await getUser(req);
    const test = parseInt(req.params.test);
    await checkSubmissionAuth(user, submission);
    return res.json(await getTest(submission, test));
  } catch (err) {
    next(err);
  }
});

app.get("/results/challenge", async (req, res, next) => {
  try {
    const contest = req.query.contest as string;
    const challenge = req.query.challenge as string;
    const score = (req.query.score as string) === "true";
    return res.json(
      await getChallengeResults(await getUser(req), contest, challenge)
    );
  } catch (err) {
    next(err);
  }
}); */

app.use(errorHandler);

const server = app.listen(
  parseInt(config.BACKEND_PORT),
  config.BACKEND_URL,
  async () => {
    const languagesReq = await fetch(
      `http://${config.JUDGE_URL}:${config.JUDGE_PORT}/languages`,
      {
        method: "GET",
      }
    );
    judgeLanguages = ((await languagesReq.json()) as JudgeLanguage[]).filter(
      (x) => !config.disabled_languages.includes(x.id)
    );
    console.log(
      `server started on port ${parseInt(config.BACKEND_PORT)} at ${
        config.BACKEND_URL
      }`
    );
  }
);

process.on("SIGINT", () => {
  server.close(async () => {
    await prisma.$disconnect();
    console.log("server stopped");
  });
});
