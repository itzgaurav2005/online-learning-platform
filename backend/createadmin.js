const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Gaurav',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log('Admin created:', admin);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
