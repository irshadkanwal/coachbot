-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "assistantId" TEXT NOT NULL DEFAULT 'openAIAssistant',
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'n/a';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "stage" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "assistantsIds" TEXT[];
