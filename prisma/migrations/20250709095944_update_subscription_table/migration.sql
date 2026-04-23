/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `canceledAt` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,type,assistantId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `subscriptionId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('app', 'assistant');

-- DropIndex
DROP INDEX "Subscription_assistantId_key";

-- DropIndex
DROP INDEX "idx_subscription_assistant_id";

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "canceledAt",
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "type" "SubscriptionType" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subscriptionId" SET NOT NULL,
ALTER COLUMN "assistantId" DROP NOT NULL,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_type_assistantId_idx" ON "Subscription"("type", "assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_type_assistantId_key" ON "Subscription"("userId", "type", "assistantId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
