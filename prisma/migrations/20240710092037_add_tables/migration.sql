-- CreateEnum
CREATE TYPE "public"."WasteType" AS ENUM ('MIXED', 'B3', 'ORGANIK', 'GUNA_ULANG', 'DAUR_ULANG', 'RESIDU');

-- CreateEnum
CREATE TYPE "public"."QuestType" AS ENUM ('RECYCLE', 'REUSE', 'REDUCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ContainerType" AS ENUM ('DEPO', 'TONG', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ContainerStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."waste_clusters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waste_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."waste_containers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "public"."ContainerType" NOT NULL DEFAULT 'TONG',
    "rating" DOUBLE PRECISION NOT NULL,
    "max_kg" DOUBLE PRECISION NOT NULL,
    "max_vol" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "status" "public"."ContainerStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cluster_id" INTEGER NOT NULL,

    CONSTRAINT "waste_containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."waste_collects" (
    "id" SERIAL NOT NULL,
    "kg" DOUBLE PRECISION NOT NULL,
    "vol" DOUBLE PRECISION NOT NULL,
    "type" "public"."WasteType" NOT NULL DEFAULT 'MIXED',
    "img" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "info" TEXT,
    "is_anonim" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "container_id" INTEGER NOT NULL,

    CONSTRAINT "waste_collects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."waste_reports" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "kg" DOUBLE PRECISION NOT NULL,
    "vol" DOUBLE PRECISION NOT NULL,
    "type" "public"."WasteType" NOT NULL DEFAULT 'MIXED',
    "img" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "info" TEXT,
    "is_anonim" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waste_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "desc" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "type" "public"."QuestType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quizzes" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" VARCHAR(100) NOT NULL,
    "point" INTEGER NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."waste_containers" ADD CONSTRAINT "waste_containers_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "public"."waste_clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_collects" ADD CONSTRAINT "waste_collects_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "public"."waste_containers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
