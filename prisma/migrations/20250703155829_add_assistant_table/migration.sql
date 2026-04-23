-- CreateEnum
CREATE TYPE "AssistantCommunicationMode" AS ENUM ('text_to_text', 'speech_to_text', 'voice_to_voice', 'video_avatar');

-- CreateEnum
CREATE TYPE "AssistantUsageType" AS ENUM ('general', 'unique');

-- CreateEnum
CREATE TYPE "TokenLimitPeriod" AS ENUM ('daily', 'monthly');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "subscriptionId" TEXT,
    "name" TEXT,
    "status" TEXT NOT NULL,
    "isFreePlan" BOOLEAN,
    "trialDays" TEXT,
    "canceledAt" TIMESTAMP(3),
    "assistantId" UUID NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantConfiguration" (
    "id" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "tokenLimitPeriod" "TokenLimitPeriod" NOT NULL DEFAULT 'monthly',
    "tokensLimit" INTEGER,
    "tokensCount" INTEGER NOT NULL DEFAULT 0,
    "firstStage" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "usageType" "AssistantUsageType",
    "communicationModes" "AssistantCommunicationMode"[],
    "assistantId" UUID NOT NULL,

    CONSTRAINT "AssistantConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assistant" (
    "id" UUID NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorData" JSONB NOT NULL,
    "meta" JSONB,
    "price" JSONB,
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_sync_at" TIMESTAMPTZ(6),

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserAssistants" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_assistantId_key" ON "Subscription"("assistantId");

-- CreateIndex
CREATE INDEX "idx_subscription_assistant_id" ON "Subscription"("assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistantConfiguration_assistantId_key" ON "AssistantConfiguration"("assistantId");

-- CreateIndex
CREATE INDEX "idx_assistant_configuration_id" ON "AssistantConfiguration"("assistantId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserAssistants_AB_unique" ON "_UserAssistants"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAssistants_B_index" ON "_UserAssistants"("B");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistantConfiguration" ADD CONSTRAINT "AssistantConfiguration_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAssistants" ADD CONSTRAINT "_UserAssistants_A_fkey" FOREIGN KEY ("A") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAssistants" ADD CONSTRAINT "_UserAssistants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
