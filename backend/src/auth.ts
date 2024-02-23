import { prisma } from "./server";
import { TRPCError } from "@trpc/server";

export async function isAdmin(uId: number) {
  return (
    await prisma.user.findUniqueOrThrow({
      select: {
        admin: true,
      },
      where: {
        id: uId,
      },
    })
  ).admin;
}

export async function getUser(token: string | undefined): Promise<number> {
  const session = await prisma.token.findUnique({
    where: { token: token || "" },
  });
  if (token === undefined || session === null || session.expiry < new Date()) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Expired or invalid token.",
    });
  }
  // Refresh the token if there is less than 3 hours expiry
  if (session.expiry < new Date(Date.now() + 1000 * 60 * 60 * 3)) {
    await prisma.token.update({
      where: { token: token },
      data: { expiry: new Date(Date.now() + 1000 * 60 * 60 * 6) },
    });
  }

  return session.uId;
}

export async function getUsername(uId: number) {
  return (
    await prisma.user.findUniqueOrThrow({
      where: {
        id: uId,
      },
    })
  ).username;
}
