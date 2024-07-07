-- CreateEnum
CREATE TYPE "WasteType" AS ENUM ('MIXED', 'B3', 'ORGANIK', 'GUNA_ULANG', 'DAUR_ULANG', 'RESIDU');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('RECYCLE', 'REUSE', 'REDUCE', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "img" TEXT NOT NULL,
    "point" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_clusters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_container" (
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

    CONSTRAINT "waste_container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCollect" (
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

    CONSTRAINT "WasteCollect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteReport" (
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

    CONSTRAINT "WasteReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "desc" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "type" "QuestType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" VARCHAR(100) NOT NULL,
    "point" INTEGER NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "waste_container" ADD CONSTRAINT "waste_container_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "waste_clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollect" ADD CONSTRAINT "WasteCollect_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollect" ADD CONSTRAINT "WasteCollect_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "waste_container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteReport" ADD CONSTRAINT "WasteReport_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
