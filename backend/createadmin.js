const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password_hash: hashed,
      role: "ADMIN"
    }
  });

  console.log("Admin created!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
