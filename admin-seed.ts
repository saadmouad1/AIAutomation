import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'flowra.ai'; // The user specifically asked for this, though normally it's an email format. We will create it exactly as requested.
  const password = '123456789';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if it already exists
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    console.log(`User ${email} already exists. Updating password...`);
    user = await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword }
    });
  } else {
    console.log(`Creating user ${email}...`);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: 'Admin',
      }
    });
  }

  // Create an org for them if they don't have one
  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id }
  });

  if (!membership) {
    const org = await prisma.organization.create({
      data: {
        name: 'Admin Workspace',
        slug: 'admin-workspace-' + Date.now(),
        members: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        }
      }
    });
    console.log(`Created default organization: ${org.name}`);
  }

  console.log(`Admin account ready. Email: ${email}, Password: ${password}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
