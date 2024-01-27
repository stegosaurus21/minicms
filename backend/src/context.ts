import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getUser } from "./auth";
import { Request } from "express";

export async function createContext(opts: CreateNextContextOptions) {
  let uId: number | undefined;
  let token: string | undefined;
  try {
    if (opts.req.headers?.token) {
      token = opts.req.headers.token;
      uId = await getUser(opts.req);
    }
  } catch {
    uId = undefined;
    token = undefined;
  }
  return {
    token: token,
    uId: uId,
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
