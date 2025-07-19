const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@inventaris.com' },
    update: {},
    create: {
      email: 'admin@inventaris.com',
      nama: 'Administrator',
      nomorhp: '081234567890',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@inventaris.com' },
    update: {},
    create: {
      email: 'user@inventaris.com',
      nama: 'Regular User',
      nomorhp: '081234567891',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log('Seeding completed!');
  console.log('Admin user:', { email: admin.email, password: 'admin123' });
  console.log('Regular user:', { email: user.email, password: 'user123' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });