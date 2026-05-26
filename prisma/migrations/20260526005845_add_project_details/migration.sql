-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");
