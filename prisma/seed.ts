import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@williamenglish.com' },
    update: {},
    create: {
      email: 'admin@williamenglish.com',
      nombre: 'Director William',
      passwordHash: passwordHash,
      rol: 'ADMIN',
      sucursal: 'QUERETARO',
    },
  });

  console.log('✅ Base de datos inicializada');
  console.log('Usuario Admin: ', admin.email);
  console.log('Contraseña: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
