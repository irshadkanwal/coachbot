/*
  Warnings:

  - A unique constraint covering the columns `[whatsappId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT,
    "userId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 2,
    "period" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "activities" JSONB NOT NULL,
    "completed" BOOLEAN,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificationChannel" TEXT,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsappId_key" ON "User"("whatsappId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
