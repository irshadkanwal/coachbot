/*
  Warnings:

  - The `primaryProfession` column on the `StudioSignup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `areaOfFocus` column on the `StudioSignup` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StudioSignup" DROP COLUMN "primaryProfession",
ADD COLUMN     "primaryProfession" TEXT[],
DROP COLUMN "areaOfFocus",
ADD COLUMN     "areaOfFocus" TEXT[],
ALTER COLUMN "ageGroup" DROP NOT NULL,
ALTER COLUMN "activeClients" DROP NOT NULL;
