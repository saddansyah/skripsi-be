-- CreateTable
CREATE TABLE "public"."daily_sign_in_logs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "daily_sign_in_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ranks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."daily_sign_in_logs" ADD CONSTRAINT "daily_sign_in_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
