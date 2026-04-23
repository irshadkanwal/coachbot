/*
  Warnings:

  - You are about to drop the column `messageEmbeddingId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messageId]` on the table `MessageEmbedding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `MessageEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_messageEmbeddingId_fkey";

-- DropIndex
DROP INDEX "Message_messageEmbeddingId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "messageEmbeddingId";

-- AlterTable
ALTER TABLE "MessageEmbedding" ADD COLUMN "messageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MessageEmbedding_messageId_key" ON "MessageEmbedding"("messageId");

-- AddForeignKey
ALTER TABLE "MessageEmbedding" ADD CONSTRAINT "MessageEmbedding_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
