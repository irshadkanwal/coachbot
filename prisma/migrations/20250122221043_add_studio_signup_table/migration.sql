-- CreateTable
CREATE TABLE "StudioSignup" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "primaryProfession" TEXT NOT NULL,
    "areaOfFocus" TEXT,
    "yearsOfExperience" TEXT NOT NULL,
    "mostInterestedIn" TEXT[],
    "challenge" TEXT,
    "currentOperate" TEXT[],
    "ageGroup" TEXT NOT NULL,
    "linkedin" TEXT,
    "otherProfiles" TEXT,
    "activeClients" TEXT NOT NULL,
    "monthlyRevenue" TEXT,
    "marketingAgreement" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudioSignup_pkey" PRIMARY KEY ("id")
);
