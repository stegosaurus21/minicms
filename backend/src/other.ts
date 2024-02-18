import { rm } from "fs/promises";
import { awaitResult, awaitScoring, awaitTest } from "./results";
import { prisma } from "./server";
import { HttpError } from "http-errors";
import { Request, Response } from "express";

export async function clear() {
  awaitTest.clear();
  awaitScoring.clear();
  awaitResult.clear();
  await prisma.$transaction([
    prisma.participant.deleteMany(),
    prisma.result.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.token.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  await rm("./upload", { recursive: true, force: true });
}

export const errorHandler = (err: HttpError, req: Request, res: Response) => {
  const statusCode = err.status || err.statusCode || 500;
  console.log(`${statusCode}: ${statusCode === 500 ? err : err.message}`);
  return res.status(statusCode).json({
    error: err.message,
  });
};
