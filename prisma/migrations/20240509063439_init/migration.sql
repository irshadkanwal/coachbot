/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerID` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceID` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionID` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "customerID",
DROP COLUMN "invoiceID",
DROP COLUMN "subscriptionID",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "invoiceId" TEXT NOT NULL,
ADD COLUMN     "subscriptionId" TEXT NOT NULL,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionId");
