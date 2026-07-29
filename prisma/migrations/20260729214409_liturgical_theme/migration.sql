-- CreateEnum
CREATE TYPE "LiturgicalThemeMode" AS ENUM ('PADRAO', 'DISCRETO', 'FULLCOLOR');

-- AlterEnum
ALTER TYPE "StaffPermission" ADD VALUE 'MANAGE_LITURGICAL_THEME';

-- AlterTable
ALTER TABLE "ParishSettings" ADD COLUMN     "liturgicalThemeMode" "LiturgicalThemeMode" NOT NULL DEFAULT 'DISCRETO';

-- CreateTable
CREATE TABLE "LiturgicalOverride" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "colorHex" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiturgicalOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiturgicalOverride_startDate_endDate_idx" ON "LiturgicalOverride"("startDate", "endDate");
