-- CreateTable
CREATE TABLE "public"."streaks" (
    "id" SERIAL NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."streaks" ADD CONSTRAINT "streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
