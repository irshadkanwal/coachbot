/*
  Warnings:

  - You are about to drop the column `dateAdded` on the `LifeInsightsHistory` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `LifeInsightsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LifeInsightsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LifeInsightsHistory" DROP COLUMN "dateAdded",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL;
