/*
  Warnings:

  - The values [USER,ASSISTANT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [LIKE,DISLIKE,UNKNOWN] on the enum `Thumb` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('user', 'assistant');
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Thumb_new" AS ENUM ('like', 'dislike', 'unknown');
ALTER TABLE "Message" ALTER COLUMN "thumb" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "thumb" TYPE "Thumb_new" USING ("thumb"::text::"Thumb_new");
ALTER TYPE "Thumb" RENAME TO "Thumb_old";
ALTER TYPE "Thumb_new" RENAME TO "Thumb";
DROP TYPE "Thumb_old";
ALTER TABLE "Message" ALTER COLUMN "thumb" SET DEFAULT 'unknown';
COMMIT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "thumb" SET DEFAULT 'unknown';
