-- CreateEnum
CREATE TYPE "Thumb" AS ENUM ('LIKE', 'DISLIKE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumb" "Thumb" NOT NULL DEFAULT 'UNKNOWN',
    "star" BOOLEAN,
    "flagged" BOOLEAN,
    "messageEmbeddingId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageEmbedding" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "MessageEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_messageEmbeddingId_key" ON "Message"("messageEmbeddingId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_messageEmbeddingId_fkey" FOREIGN KEY ("messageEmbeddingId") REFERENCES "MessageEmbedding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
