import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Request } from "express";

export async function createContext(opts: CreateNextContextOptions) {
  let token: string | undefined;
  token = opts.req.headers?.token;
  return {
    token: token,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = {
  token?: string;
  uId?: number;
  req: Request;
  res: Response;
};
