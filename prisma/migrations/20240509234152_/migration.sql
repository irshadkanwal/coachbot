/*
  Warnings:

  - You are about to drop the column `customerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `sessions` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "customerId",
DROP COLUMN "invoiceId",
DROP COLUMN "sessions",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "metadata" JSONB;
