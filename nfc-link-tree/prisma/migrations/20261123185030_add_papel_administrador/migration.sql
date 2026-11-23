-- CreateEnum
CREATE TYPE "PapelAdministrador" AS ENUM ('ADMIN', 'CLIENTE');

-- AlterTable
ALTER TABLE "Administrador" ADD COLUMN     "empresaId" TEXT,
ADD COLUMN     "role" "PapelAdministrador" NOT NULL DEFAULT 'ADMIN';

-- CreateIndex
CREATE INDEX "Administrador_empresaId_idx" ON "Administrador"("empresaId");

-- AddForeignKey
ALTER TABLE "Administrador" ADD CONSTRAINT "Administrador_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

