-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "postingDate" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
