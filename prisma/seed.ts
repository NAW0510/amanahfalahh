import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcryptjs.hash("password123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@amanahfalah.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@amanahfalah.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  const pkm = await prisma.user.upsert({
    where: { email: "pkm@amanahfalah.com" },
    update: {},
    create: {
      name: "PKM User",
      email: "pkm@amanahfalah.com",
      password: hashedPassword,
      role: "PKM",
    },
  })

  const donatur = await prisma.user.upsert({
    where: { email: "donatur@amanahfalah.com" },
    update: {},
    create: {
      name: "Donatur User",
      email: "donatur@amanahfalah.com",
      password: hashedPassword,
      role: "DONATUR",
    },
  })

  console.log("Seeded users:", { admin, pkm, donatur })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
