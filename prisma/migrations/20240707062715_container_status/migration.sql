-- CreateEnum
CREATE TYPE "ContainerStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "waste_containers" ADD COLUMN     "status" "ContainerStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "type" SET DEFAULT 'TONG';
