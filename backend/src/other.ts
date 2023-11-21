import { rm } from "fs/promises";
import { tokens } from "./auth";
import { awaitResult, awaitScoring, awaitTest } from "./results";
import { prisma } from "./server";
import { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";

export async function clear() {
  tokens.clear();
  awaitTest.clear();
  awaitScoring.clear();
  awaitResult.clear();
  await prisma.$transaction([
    prisma.participant.deleteMany(),
    prisma.result.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  await rm("./upload", { recursive: true, force: true });
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || err.statusCode || 500;
  console.log(`${statusCode}: ${statusCode === 500 ? err : err.message}`);
  return res.status(statusCode).json({
    error: err.message,
  });
};
