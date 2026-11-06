-- CreateTable
CREATE TABLE "Administrador" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_email_key" ON "Administrador"("email");
