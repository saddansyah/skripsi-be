-- DropForeignKey
ALTER TABLE "public"."assigned_achievements" DROP CONSTRAINT "assigned_achievements_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."evidence_ratings" DROP CONSTRAINT "evidence_ratings_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."assigned_achievements" ADD CONSTRAINT "assigned_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidence_ratings" ADD CONSTRAINT "evidence_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
