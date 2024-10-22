-- DropForeignKey
ALTER TABLE "public"."assigned_achievements" DROP CONSTRAINT "assigned_achievements_achievement_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."evidence_ratings" DROP CONSTRAINT "evidence_ratings_container_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."waste_collects" DROP CONSTRAINT "waste_collects_container_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."waste_containers" DROP CONSTRAINT "waste_containers_cluster_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."waste_containers" ADD CONSTRAINT "waste_containers_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "public"."waste_clusters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_collects" ADD CONSTRAINT "waste_collects_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "public"."waste_containers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assigned_achievements" ADD CONSTRAINT "assigned_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evidence_ratings" ADD CONSTRAINT "evidence_ratings_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "public"."waste_containers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
