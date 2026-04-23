-- AlterTable
-- This migration adds the isDeleted column to the Assistant table
-- It is a safe migration that only ADDS a new column with a default value
-- NO DATA WILL BE DELETED OR MODIFIED

ALTER TABLE "Assistant" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;
