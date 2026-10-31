-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "corPrimaria" TEXT NOT NULL DEFAULT '#0EA5E9',
    "corFundo" TEXT NOT NULL DEFAULT '#07090E',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedeSocial" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "RedeSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_slug_key" ON "Empresa"("slug");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeSocial" ADD CONSTRAINT "RedeSocial_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
