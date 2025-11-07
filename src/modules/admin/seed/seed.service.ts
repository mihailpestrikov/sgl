import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { universities } from '../../../../prisma/seed-data/universities';
import { athletes } from '../../../../prisma/seed-data/athletes';
import { teams } from '../../../../prisma/seed-data/teams';
import { coaches } from '../../../../prisma/seed-data/coaches';
import { athleteResults } from '../../../../prisma/seed-data/athlete-results';
import { universityRatings } from '../../../../prisma/seed-data/university-ratings';
import { personalRatings } from '../../../../prisma/seed-data/personal-ratings';
import { mediaItems } from '../../../../prisma/seed-data/media-items';

const logger = new Logger('SeedService');

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedUniversities() {
    logger.log('Adding universities...');

    for (const university of universities) {
      await this.prisma.university.upsert({
        where: { id: university.id },
        update: university,
        create: university,
      });
    }

    return { success: true, message: 'Universities successfully added' };
  }

  async seedTeams() {
    logger.log('Adding teams...');

    for (const team of teams) {
      await this.prisma.team.upsert({
        where: { id: team.id },
        update: team,
        create: team,
      });
    }

    return { success: true, message: 'Teams successfully added' };
  }

  async seedCoaches() {
    logger.log('Adding coaches...');

    for (const coach of coaches) {
      await this.prisma.coach.upsert({
        where: { id: coach.id },
        update: coach,
        create: coach,
      });
    }

    return { success: true, message: 'Coaches successfully added' };
  }

  async seedAthletes() {
    logger.log('Adding athletes...');

    for (const athlete of athletes) {
      await this.prisma.athlete.upsert({
        where: { id: athlete.id },
        update: athlete,
        create: athlete,
      });
    }

    return { success: true, message: 'Athletes successfully added' };
  }

  async seedAthleteResults() {
    logger.log('Adding athlete results...');

    for (const result of athleteResults) {
      await this.prisma.athleteResult.upsert({
        where: { id: result.id },
        update: result,
        create: result,
      });
    }

    return { success: true, message: 'Athlete results successfully added' };
  }

  async seedUniversityRatings() {
    logger.log('Adding university ratings...');

    for (const rating of universityRatings) {
      await this.prisma.universityRating.upsert({
        where: { id: rating.id },
        update: rating,
        create: rating,
      });
    }

    return { success: true, message: 'University ratings successfully added' };
  }

  async seedPersonalRatings() {
    logger.log('Adding personal athlete ratings...');

    for (const rating of personalRatings) {
      await this.prisma.personalRating.upsert({
        where: { id: rating.id },
        update: rating,
        create: rating,
      });
    }

    return { success: true, message: 'Personal athlete ratings successfully added' };
  }

  async seedMediaItems() {
    logger.log('Adding media items...');

    for (const item of mediaItems) {
      await this.prisma.mediaItem.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }

    return { success: true, message: 'Media items successfully added' };
  }

  async seedAll() {
    logger.log('Starting database seeding...');

    await this.seedUniversities();
    await this.seedTeams();
    await this.seedCoaches();
    await this.seedAthletes();
    await this.seedAthleteResults();
    await this.seedUniversityRatings();
    await this.seedPersonalRatings();
    await this.seedMediaItems();

    logger.log('Database successfully seeded!');
    return { success: true, message: 'Database successfully seeded' };
  }
}