import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const logger = new Logger('ParticipantsService');

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async getMenPersonalRating() {
    try {
      const menRating = await this.prismaService.personalRating.findMany({
        where: {
          gender: 'Мужской',
        },
        include: {
          athlete: {
            include: {
              university: true,
            },
          },
        },
        orderBy: {
          place: 'asc',
        },
      });

      logger.log(`found ${menRating.length} men's ratings`)

      return menRating;
    } catch (error) {
      logger.error('Error fetching men rating:', error);
    }
  }

  async getWomenPersonalRating() {
    try {
      const womenRating = await this.prismaService.personalRating.findMany({
        where: {
          gender: 'Женский',
        },
        include: {
          athlete: {
            include: {
              university: true,
            },
          },
        },
        orderBy: {
          place: 'asc',
        },
      });

      logger.log(`found ${womenRating.length} men's ratings`)

      return womenRating;
    } catch (error) {
      logger.error('Error fetching women rating:', error);
    }
  }

  async getMenUniversityRating() {
    try {
      const universityRating = await this.prismaService.universityRating.findMany({
        where: {
          gender: 'Мужской',
        },
        include: {
          university: true,
        },
        orderBy: {
          position: 'asc',
        },
      });

      logger.log(`found ${universityRating.length} men university ratings`)


      return universityRating;
    } catch (error) {
      logger.error('Error fetching men university rating:', error);
    }
  }

  async getWomenUniversityRating() {
    try {
      const universityRating = await this.prismaService.universityRating.findMany({
        where: {
          gender: 'Женский',
        },
        include: {
          university: true,
        },
        orderBy: {
          position: 'asc',
        },
      });

      logger.log(`found ${universityRating.length} women university ratings`)

      return universityRating;
    } catch (error) {
      logger.error('Error fetching women university rating:', error);
    }
  }

  async findUniversityRatings(universityId: string) {
    logger.log(`Finding ratings for university ID: ${universityId}`);

    return this.prismaService.universityRating.findMany({
      where: { universityId },
      orderBy: {
        gender: 'asc',
      },
      include: {
        university: true,
      },
    });
  }

  async findPersonalRating(athleteId: string) {
    logger.log(`Finding personal rating for athlete ID: ${athleteId}`);

    return this.prismaService.personalRating.findUnique({
      where: { athleteId },
      include: {
        athlete: true,
      },
    });
  }

}