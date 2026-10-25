import { PrismaClient, RoleName } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  for (const name of Object.values(RoleName)) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.ADMIN },
  });

  await prisma.user.upsert({
    where: { email: 'admin@cloudops.local' },
    update: {},
    create: {
      fullName: 'CloudOps Administrator',
      email: 'admin@cloudops.local',
      passwordHash: await hash('Admin123!', 12),
      roleId: adminRole.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
