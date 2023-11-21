import { type inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getUser } from "./auth";
import { Request } from "express";

export async function createContext(opts: CreateNextContextOptions) {
  let uId: number | undefined = undefined;
  let token: string | undefined = undefined;
  try {
    if (opts.req.headers?.token) {
      token = opts.req.headers.token;
      uId = await getUser(opts.req);
    }
  } catch {}
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
