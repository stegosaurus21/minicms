import { PrismaClient } from "@prisma/client";
import { hash } from "../src/helper";
const prisma = new PrismaClient();

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
