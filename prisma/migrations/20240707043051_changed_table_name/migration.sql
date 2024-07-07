/*
  Warnings:

  - You are about to drop the `Quest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteCollect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `waste_container` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WasteCollect" DROP CONSTRAINT "WasteCollect_container_id_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollect" DROP CONSTRAINT "WasteCollect_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WasteReport" DROP CONSTRAINT "WasteReport_user_id_fkey";

-- DropForeignKey
ALTER TABLE "waste_container" DROP CONSTRAINT "waste_container_cluster_id_fkey";

-- DropTable
DROP TABLE "Quest";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "WasteCollect";

-- DropTable
DROP TABLE "WasteReport";

-- DropTable
DROP TABLE "waste_container";

-- CreateTable
CREATE TABLE "waste_containers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "max_kg" DOUBLE PRECISION NOT NULL,
    "max_vol" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cluster_id" INTEGER NOT NULL,

    CONSTRAINT "waste_containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_collects" (
    "id" SERIAL NOT NULL,
    "kg" DOUBLE PRECISION NOT NULL,
    "vol" DOUBLE PRECISION NOT NULL,
    "type" "WasteType" NOT NULL DEFAULT 'MIXED',
    "img" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "info" TEXT,
    "is_anonim" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "container_id" INTEGER NOT NULL,

    CONSTRAINT "waste_collects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_reports" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "kg" DOUBLE PRECISION NOT NULL,
    "vol" DOUBLE PRECISION NOT NULL,
    "type" "WasteType" NOT NULL DEFAULT 'MIXED',
    "img" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "info" TEXT,
    "is_anonim" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "waste_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "desc" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "type" "QuestType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" VARCHAR(100) NOT NULL,
    "point" INTEGER NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "waste_containers" ADD CONSTRAINT "waste_containers_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "waste_clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_collects" ADD CONSTRAINT "waste_collects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_collects" ADD CONSTRAINT "waste_collects_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "waste_containers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_reports" ADD CONSTRAINT "waste_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
