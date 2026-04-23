/*
  Warnings:

  - You are about to drop the `MessageEmbedding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageEmbedding" DROP CONSTRAINT "MessageEmbedding_messageId_fkey";

-- DropTable
DROP TABLE "MessageEmbedding";
