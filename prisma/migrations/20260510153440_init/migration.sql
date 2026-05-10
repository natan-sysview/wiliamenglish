-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'MAESTRO', 'ALUMNO');

-- CreateEnum
CREATE TYPE "Sucursal" AS ENUM ('QUERETARO', 'METEPEC');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "TipoClase" AS ENUM ('PERSONAL', 'GRUPAL_LISTENING', 'GRUPAL_PRACTICING');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'ZOOM');

-- CreateEnum
CREATE TYPE "EstadoReservacion" AS ENUM ('ACTIVA', 'REAGENDADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "sucursal" "Sucursal",
    "nivel" "Nivel",
    "paqueteId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paquetes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clasesPersonales" INTEGER NOT NULL,
    "clasesGrupalListening" INTEGER NOT NULL,
    "clasesGrupalPracticing" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "tipoClase" "TipoClase" NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "sucursal" "Sucursal" NOT NULL,
    "maestroId" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservaciones" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "horarioId" TEXT NOT NULL,
    "estado" "EstadoReservacion" NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "paquetes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_maestroId_fkey" FOREIGN KEY ("maestroId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservaciones" ADD CONSTRAINT "reservaciones_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservaciones" ADD CONSTRAINT "reservaciones_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
