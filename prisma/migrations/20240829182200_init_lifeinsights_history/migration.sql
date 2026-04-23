-- CreateTable
CREATE TABLE "LifeInsightsHistory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "areas" JSONB NOT NULL,

    CONSTRAINT "LifeInsightsHistory_pkey" PRIMARY KEY ("id")
);
