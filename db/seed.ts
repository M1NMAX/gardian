import { hash } from 'bcryptjs';
import { Prisma, PrismaClient } from '@prisma/client';
import { templatesData } from '../data/templates';


const prisma = new PrismaClient();
async function main() {
  const encryptedPassword = await hash('password1234', 12);

  await prisma.user.upsert({
    where: { email: 'a@a.com' },
    update: {},
    create: {
      email: 'a@a.com',
      name: 'Alice',
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: 'b@b.com' },
    update: {},
    create: {
      email: 'b@b.com',
      name: 'Bob',
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: 'c@c.com' },
    update: {},
    create: {
      email: 'c@c.com',
      name: 'Carla',
      password: encryptedPassword,
    },
  });

  //Template
  console.log(`Start seeding templates ...`);
  for (const t of templatesData) {
    const template = await prisma.template.create({
      data: t,
    });
    console.log(`Created template with id: ${template.id}`);
  }
  console.log(`Seeding finished template.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
