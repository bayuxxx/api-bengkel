const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash('ubay12345#', 10);

    await prisma.user.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        name: 'ubay',
        role: 'SUPER_ADMIN',
        active: true,
        lastLogin: new Date(),
      },
    });

    console.log('Super admin user seeded successfully');
  } catch (error) {
    console.error('Error seeding super admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
