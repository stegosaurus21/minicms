import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
const prisma = new PrismaClient();

const PASS_SALT = "__HACKERN'T__";

function hash(plain: string): string {
  return crypto
    .createHash("sha256")
    .update(plain + PASS_SALT)
    .digest("hex");
}

async function main() {
  await prisma.user.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      username: "admin",
      password: hash("minicms_default_admin"),
      admin: true,
      force_reset_password: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
