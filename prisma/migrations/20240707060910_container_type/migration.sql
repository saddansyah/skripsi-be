/*
  Warnings:

  - Added the required column `type` to the `waste_containers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContainerType" AS ENUM ('DEPO', 'TONG');

-- AlterTable
ALTER TABLE "waste_containers" ADD COLUMN     "type" "ContainerType" NOT NULL;
