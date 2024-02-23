import express, { json } from "express";
import config from "../config.json";
import cors from "cors";
import fileUpload from "express-fileupload";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./context";
import { judgeCallback } from "./results";
import { clear, errorHandler } from "./other";
import morgan from "morgan";
import { v4 } from "uuid";
import cookie_parser from "cookie-parser";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { appRouter } from "./app";
import { JudgeLanguage } from "./interface";
import env from "dotenv";
import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { parse } from "url";

env.config();
export const CALLBACK_URL = process.env.CALLBACK_URL || "localhost";
export const BACKEND_PORT = process.env.BACKEND_PORT || "8080";
export const JUDGE_URL = process.env.JUDGE_URL || "localhost";
export const JUDGE_PORT = process.env.JUDGE_PORT || "2358";

export const prisma = new PrismaClient();

const app = express();

export let judgeLanguages: JudgeLanguage[];
let lastClear = Date.now();

app.use(json({ limit: "10mb" }));
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

export const judgeSecret = v4();
app.put(
  `/callback/${judgeSecret}/:submission/:taskNum/:testNum/:timeSent`,
  async (req, res) => {
    if (parseInt(req.params.timeSent) < lastClear) return res.json();
    await judgeCallback(
      req.body,
      req.params.submission,
      parseInt(req.params.taskNum),
      parseInt(req.params.testNum)
    );
    return res.json();
  }
);

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "public" }, (err) => {
    res.end();

    if (err) throw err;
  });
});
app.use(errorHandler);

const server = app.listen(parseInt(BACKEND_PORT), "0.0.0.0", async () => {
  fetch(`http://${JUDGE_URL}:${JUDGE_PORT}/languages`, {
    method: "GET",
  })
    .then(async (res) => {
      judgeLanguages = ((await res.json()) as JudgeLanguage[]).filter(
        (x) => !config.disabled_languages.includes(x.id)
      );
    })
    .catch(() => {
      console.log(
        `Error: could not reach judging server at http://${JUDGE_URL}:${JUDGE_PORT}. Judging will not be available.`
      );
    })
    .finally(() => {
      console.log(
        `Server started on port ${parseInt(BACKEND_PORT)} on 0.0.0.0.`
      );
    });
});

process.on("SIGINT", () => {
  server.close(async () => {
    await prisma.$disconnect();
    console.log("server stopped");
  });
});

const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url || "");

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });
