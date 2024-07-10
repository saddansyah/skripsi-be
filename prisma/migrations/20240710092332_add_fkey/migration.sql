-- AlterTable
ALTER TABLE "public"."waste_collects" ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "public"."waste_reports" ADD COLUMN     "user_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."waste_collects" ADD CONSTRAINT "waste_collects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_reports" ADD CONSTRAINT "waste_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
