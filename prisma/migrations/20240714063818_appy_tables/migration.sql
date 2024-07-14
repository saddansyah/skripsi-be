-- CreateEnum
CREATE TYPE "public"."WasteType" AS ENUM ('MIXED', 'B3', 'ORGANIK', 'GUNA_ULANG', 'DAUR_ULANG', 'RESIDU');

-- CreateEnum
CREATE TYPE "public"."QuestType" AS ENUM ('RECYCLE', 'REUSE', 'REDUCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ContainerType" AS ENUM ('DEPO', 'TONG', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

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
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',
    "point" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cluster_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,

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
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "container_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,

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
    "status" "public"."Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "waste_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "desc" TEXT NOT NULL,
    "img" TEXT NOT NULL DEFAULT '-',
    "type" "public"."QuestType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quests_logs" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "quest_id" INTEGER NOT NULL,

    CONSTRAINT "quests_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quizzes" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" VARCHAR(100) NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quiz_logs" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "quiz_id" INTEGER NOT NULL,

    CONSTRAINT "quiz_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profiles" (
    "user_id" UUID NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "additional_point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assigned_achievements" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "achievement_id" INTEGER NOT NULL,

    CONSTRAINT "assigned_achievements_pkey" PRIMARY KEY ("achievement_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."evidence_ratings" (
    "value" INTEGER NOT NULL,
    "is_anonim" BOOLEAN NOT NULL,
    "point" INTEGER NOT NULL,
    "info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "container_id" INTEGER NOT NULL,

    CONSTRAINT "evidence_ratings_pkey" PRIMARY KEY ("container_id","user_id")
);

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

-- AddForeignKey
ALTER TABLE "public"."waste_containers" ADD CONSTRAINT "waste_containers_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "public"."waste_clusters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_containers" ADD CONSTRAINT "waste_containers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_collects" ADD CONSTRAINT "waste_collects_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "public"."waste_containers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_collects" ADD CONSTRAINT "waste_collects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_reports" ADD CONSTRAINT "waste_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quests_logs" ADD CONSTRAINT "quests_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quests_logs" ADD CONSTRAINT "quests_logs_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quiz_logs" ADD CONSTRAINT "quiz_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quiz_logs" ADD CONSTRAINT "quiz_logs_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assigned_achievements" ADD CONSTRAINT "assigned_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assigned_achievements" ADD CONSTRAINT "assigned_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidence_ratings" ADD CONSTRAINT "evidence_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidence_ratings" ADD CONSTRAINT "evidence_ratings_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "public"."waste_containers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
