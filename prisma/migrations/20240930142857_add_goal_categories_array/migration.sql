-- CreateTable
CREATE TABLE "_GoalCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GoalCategories_AB_unique" ON "_GoalCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_GoalCategories_B_index" ON "_GoalCategories"("B");

-- AddForeignKey
ALTER TABLE "_GoalCategories" ADD CONSTRAINT "_GoalCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalCategories" ADD CONSTRAINT "_GoalCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 4: Migrate existing categoryId values into the join table
INSERT INTO "_GoalCategories" ("A", "B")
SELECT "categoryId", "id"
FROM "Goal"
WHERE "categoryId" IS NOT NULL;
