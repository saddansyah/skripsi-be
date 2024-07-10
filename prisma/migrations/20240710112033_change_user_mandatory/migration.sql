/*
  Warnings:

  - Made the column `user_id` on table `waste_collects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `waste_reports` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."waste_collects" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."waste_reports" ALTER COLUMN "user_id" SET NOT NULL;
