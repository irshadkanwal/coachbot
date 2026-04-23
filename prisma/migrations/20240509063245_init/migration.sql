-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'STARTER', 'GROWTH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "subscriptionID" TEXT NOT NULL,
    "customerID" TEXT NOT NULL,
    "invoiceID" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sessions" INTEGER,
    "type" "PlanType",
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
