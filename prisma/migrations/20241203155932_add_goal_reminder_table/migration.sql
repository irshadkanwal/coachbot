-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channels" JSONB NOT NULL,
    "period" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "weekDay" TEXT,
    "monthDay" TIMESTAMP(3),
    "sendDate" TIMESTAMP(3),
    "goalId" TEXT,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_goalId_key" ON "Reminder"("goalId");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
