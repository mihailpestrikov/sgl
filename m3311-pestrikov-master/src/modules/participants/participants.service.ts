import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaginatedResult } from '../../common/pagination/paginated-result.class';
import { PaginationParams } from '../../common/pagination/pagination-params.dto';

const logger = new Logger('ParticipantsService');

@Injectable()
export class ParticipantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllAthletes(paginationParams: PaginationParams | { page: number; limit: number }) {
    try {
      const { page = 1, limit = 20 } = paginationParams;
      const skip = (page - 1) * limit;

      const [athletes, totalCount] = await Promise.all([
        this.prismaService.athlete.findMany({
          include: {
            university: true,
          },
          orderBy: {
            name: 'asc',
          },
          skip: skip,
          take: limit,
        }),
        this.prismaService.athlete.count()
      ]);

      logger.log(`Found ${athletes.length} athletes`);

      const formattedAthletes = athletes.map(athlete => ({
        name: athlete.name,
        university: athlete.university.shortName,
        role: athlete.role,
        gender: athlete.gender,
        height: athlete.height,
        weight: athlete.weight,
        athleteId: athlete.id,
        universityId: athlete.universityId,
      }));

      return new PaginatedResult(formattedAthletes, totalCount, +page, +limit);
    } catch (error) {
      logger.error('Error fetching athletes:', error);
      return new PaginatedResult([], 0, 1, 20);
    }
  }

  async searchAthletesByName(searchQuery: string, paginationParams: PaginationParams | { page: number; limit: number }) {
    try {
      const { page = 1, limit = 20 } = paginationParams;
      const skip = (page - 1) * limit;

      const [athletes, totalCount] = await Promise.all([
        this.prismaService.athlete.findMany({
          where: {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          include: {
            university: true,
          },
          orderBy: {
            name: 'asc',
          },
          skip: skip,
          take: limit,
        }),
        this.prismaService.athlete.count({
          where: {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        })
      ]);

      logger.log(`Found ${athletes.length} athletes matching "${searchQuery}"`);

      const formattedAthletes = athletes.map(athlete => ({
        name: athlete.name,
        university: athlete.university.shortName,
        role: athlete.role,
        gender: athlete.gender,
        height: athlete.height,
        weight: athlete.weight,
        athleteId: athlete.id,
        universityId: athlete.universityId,
      }));

      return new PaginatedResult(formattedAthletes, totalCount, +page, +limit);
    } catch (error) {
      logger.error(`Error searching athletes with query "${searchQuery}":`, error);
      return new PaginatedResult([], 0, 1, 20);
    }
  }
}