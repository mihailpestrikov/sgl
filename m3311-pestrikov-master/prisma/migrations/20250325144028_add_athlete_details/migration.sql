/*
  Warnings:

  - Added the required column `birthYear` to the `Athlete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "birthYear" INTEGER NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "sportTitle" TEXT,
ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthleteResult" (
    "id" TEXT NOT NULL,
    "competitionName" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "place" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "teamName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "athleteId" TEXT NOT NULL,

    CONSTRAINT "AthleteResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthleteResult" ADD CONSTRAINT "AthleteResult_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
