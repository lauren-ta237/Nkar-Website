import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@nkarwooland.org';
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12) throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters');
  await prisma.user.upsert({
    where: { email },
    update: { isActive: true, role: Role.SUPER_ADMIN },
    create: { email, name: 'Nkar Woo Land Administrator', role: Role.SUPER_ADMIN, passwordHash: await argon2.hash(password) },
  });
}
main().finally(() => prisma.$disconnect());
