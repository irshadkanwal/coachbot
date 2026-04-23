-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_messageEmbeddingId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_messageEmbeddingId_fkey" FOREIGN KEY ("messageEmbeddingId") REFERENCES "MessageEmbedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
