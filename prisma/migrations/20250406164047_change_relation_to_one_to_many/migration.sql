/*
  Warnings:

  - A unique constraint covering the columns `[universityId,gender]` on the table `UniversityRating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UniversityRating_universityId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UniversityRating_universityId_gender_key" ON "UniversityRating"("universityId", "gender");
