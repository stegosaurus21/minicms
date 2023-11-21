import express, { json } from "express";
import config from "../config.json";
import cors from "cors";
import fileUpload from "express-fileupload";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./context";
import { getLeaderboard, judgeCallback } from "./results";
import { clear, errorHandler } from "./other";
import morgan from "morgan";
import { v4 } from "uuid";
import cookie_parser from "cookie-parser";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { appRouter } from "./app";
import { JudgeLanguage } from "./interface";

export const prisma = new PrismaClient();

const app = express();
let judgeLanguages: JudgeLanguage[];
let lastClear = Date.now();

app.use(json());
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload({ createParentPath: true }));
app.use(cookie_parser());

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
