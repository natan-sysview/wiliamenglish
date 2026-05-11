import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Rol, Sucursal, Modalidad } from '@prisma/client';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const nombres = ["Alejandro", "Maria", "Daniel", "Sofia", "Carlos", "Ana", "Miguel", "Laura", "Jorge", "Carmen", "Luis", "Elena", "Fernando", "Lucia", "Jose", "Isabel", "David", "Paula", "Juan", "Marta", "Roberto", "Andrea", "Diego", "Patricia", "Ricardo", "Sara", "Hugo", "Natalia", "Javier", "Victoria"];
const apellidos = ["Garcia", "Martinez", "Rodriguez", "Lopez", "Perez", "Gonzalez", "Gomez", "Fernandez", "Ruiz", "Diaz", "Alvarez", "Romero", "Moreno", "Muñoz", "Alonso", "Gutierrez", "Navarro", "Torres", "Dominguez", "Vazquez", "Ramos", "Gil", "Ramirez", "Serrano", "Blanco", "Molina", "Morales", "Suarez", "Ortega", "Delgado"];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  let phone = "55";
  for (let i = 0; i < 8; i++) {
    phone += Math.floor(Math.random() * 10).toString();
  }
  return phone;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('Iniciando sembrado (seed) de 500 usuarios...');

  // Preservamos al ADMIN
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@williamenglish.com' },
    update: {},
    create: {
      email: 'admin@williamenglish.com',
      nombre: 'Director William',
      passwordHash: passwordHashAdmin,
      rol: 'ADMIN',
      sucursal: 'QUERETARO',
      modalidad: 'NINGUNO',
    },
  });

  const passwordHash = await bcrypt.hash('WilliamEnglish!', 10);
  const usuarios = [];

  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
  const hoy = new Date();

  for (let i = 0; i < 500; i++) {
    const nombre = `${randomChoice(nombres)} ${randomChoice(apellidos)} ${randomChoice(apellidos)}`;
    const email = `usuario_${i}_${Date.now()}@gmail.com`;
    const telefono = Math.random() > 0.2 ? randomPhone() : null;

    const rol: Rol = Math.random() > 0.95 ? "MAESTRO" : "ALUMNO";
    const sucursal: Sucursal = Math.random() > 0.4 ? "QUERETARO" : "METEPEC";

    let modalidad: Modalidad = "PRESENCIAL";
    const randMod = Math.random();
    if (randMod < 0.5) modalidad = "PRESENCIAL";
    else if (randMod < 0.8) modalidad = "ZOOM";
    else modalidad = "HIBRIDO";

    const activo = Math.random() > 0.08;
    const createdAt = randomDate(seisMesesAtras, hoy);

    usuarios.push({
      nombre,
      email,
      passwordHash,
      telefono,
      rol,
      sucursal,
      modalidad,
      activo,
      requiereCambioPassword: true,
      createdAt
    });
  }

  console.log(`Generados ${usuarios.length} perfiles.`);

  // Prisma con adaptadores Edge en algunos casos requiere crear de a uno o en mini-batches.
  // createMany funciona bien con PostgreSQL.
  for (let i = 0; i < usuarios.length; i += 100) {
    const batch = usuarios.slice(i, i + 100);
    await prisma.usuario.createMany({
      data: batch,
      skipDuplicates: true
    });
    console.log(`Lote ${i/100 + 1}/5 insertado.`);
  }

  console.log('✅ Base de datos inicializada y sembrada con 500 usuarios.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
