/*
  Warnings:

  - You are about to drop the `learn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."learn";

-- CreateTable
CREATE TABLE "public"."learns" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "excerpt" VARCHAR(256) NOT NULL,
    "content" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learns_pkey" PRIMARY KEY ("id")
);
