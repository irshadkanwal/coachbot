-- CreateEnum
CREATE TYPE "SubscriptionInterval" AS ENUM ('month', 'year');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "interval" "SubscriptionInterval";
