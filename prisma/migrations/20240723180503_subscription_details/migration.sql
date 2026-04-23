-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFreePlan" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subscriptionId" TEXT;
