import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const logger = new Logger('HomeService');

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMenTopUniversities(limit: number = 5) {
    try {
      const topUniversities = await this.prismaService.universityRating.findMany({
        where: {
          gender: 'Мужской',
        },
        include: {
          university: true,
        },
        orderBy: {
          position: 'asc',
        },
        take: limit,
      });

      logger.log('Found men top universities');

      if (topUniversities && topUniversities.length > 0) {
        return topUniversities.map(rating => ({
          position: rating.position,
          university: rating.university.shortName,
          link: `/university/${rating.university.id}`,
          score: rating.score,
        }));
      }

    } catch (error) {
      logger.error('Error fetching men top universities:', error);
    }
  }

  async getWomenTopUniversities(limit: number = 5) {
    try {
      const topUniversities = await this.prismaService.universityRating.findMany({
        where: {
          gender: 'Женский',
        },
        include: {
          university: true,
        },
        orderBy: {
          position: 'asc',
        },
        take: limit,
      });

      logger.log('Found women top universities');

      if (topUniversities && topUniversities.length > 0) {
        return topUniversities.map(rating => ({
          position: rating.position,
          university: rating.university.shortName,
          link: `/university/${rating.university.id}`,
          score: rating.score,
        }));
      }

    } catch (error) {
      logger.error('Error fetching women top universities:', error);
    }
  }

  async getLatestNews(limit: number = 5) {
    return []; // todo
  }

  async getFeaturedMedia(limit: number = 4) {
    return []; // todo
  }

  async getHomePageData() {
    const menRatings = await this.getMenTopUniversities(5);
    const womenRatings = await this.getWomenTopUniversities(5);
    const latestNews = await this.getLatestNews();
    const featuredMedia = await this.getFeaturedMedia();

    return {
      menRatings,
      womenRatings,
      latestNews,
      featuredMedia,
      viewAllLink: "/rating"
    };
  }
}