/*
  Warnings:

  - Added the required column `competitionType` to the `AthleteResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `UniversityRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AthleteResult" ADD COLUMN     "competitionType" TEXT NOT NULL,
ADD COLUMN     "weightCategory" TEXT;

-- AlterTable
ALTER TABLE "UniversityRating" ADD COLUMN     "gender" TEXT NOT NULL;
