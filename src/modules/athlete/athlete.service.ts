import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { PaginationParams } from '../../common/pagination/pagination-params.dto';
import { PaginatedResult } from '../../common/pagination/paginated-result.class';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

const logger = new Logger('AthleteService');

interface SearchParams {
  name?: string;
  universityId?: string;
}

@Injectable()
export class AthleteService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneForView(id: string) {
    try {
      const athlete = await this.prismaService.athlete.findUnique({
        where: { id },
        include: {
          university: true,
          results: {
            orderBy: {
              date: 'desc'
            }
          },
          team: true
        }
      });

      logger.log(`Found athlete ${id}`);

      if (athlete) {
        return {
          name: athlete.name,
          birthYear: athlete.birthYear,
          sportTitle: athlete.sportTitle,
          height: athlete.height,
          weight: athlete.weight,
          team: athlete.team?.name || null,
          role: athlete.role,
          university: athlete.university.name,
          universityLink: `/university/${athlete.university.id}`,
          photo: athlete.photo || '/img/athletes/default.png',
          results: athlete.results.map(r => ({
            stageName: r.competitionName,
            team: r.teamName,
            distance: r.distance,
            result: r.result,
            place: r.place,
            competitionType: r.competitionType,
            weightCategory: r.weightCategory,
          }))
        };
      }
    } catch (error) {
      console.error('Error fetching athlete:', error);
    }
  }

  async create(createAthleteDto: CreateAthleteDto) {
    return this.prismaService.athlete.create({
      data: createAthleteDto,
      include: {
        university: true,
        team: true,
      },
    });
  }

  async findAll(params: PaginationParams) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const [athletes, total] = await Promise.all([
      this.prismaService.athlete.findMany({
        include: {
          university: true,
          team: true,
        },
        skip,
        take: limitNumber,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.athlete.count(),
    ]);

    return new PaginatedResult(athletes, total, pageNumber, limitNumber);
  }

  async findOne(id: string) {
    const athlete = await this.prismaService.athlete.findUnique({
      where: { id },
      include: {
        university: true,
        team: true,
      },
    });

    if (!athlete) {
      throw new NotFoundException(`Athlete with ID ${id} not found`);
    }

    return athlete;
  }

  async searchAthletes(searchParams: SearchParams, paginationParams: PaginationParams) {
    const { page = 1, limit = 20 } = paginationParams;
    const skip = (page - 1) * limit;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    logger.log(`Searching athletes with params: ${JSON.stringify(searchParams)}`);

    const whereConditions: any = {};

    if (searchParams.name) {
      whereConditions.name = {
        contains: searchParams.name,
        mode: 'insensitive'
      };
    }

    if (searchParams.universityId) {
      whereConditions.universityId = searchParams.universityId;
    }

    const [athletes, total] = await Promise.all([
      this.prismaService.athlete.findMany({
        where: whereConditions,
        include: {
          university: true,
          team: true,
        },
        skip,
        take: limitNumber,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.athlete.count({
        where: whereConditions
      }),
    ]);

    logger.log(`Found ${athletes.length} athletes matching search criteria`);

    return new PaginatedResult(athletes, total, pageNumber, limitNumber);
  }


  async update(id: string, updateAthleteDto: UpdateAthleteDto) {
    await this.findOne(id);

    return this.prismaService.athlete.update({
      where: { id },
      data: updateAthleteDto,
      include: {
        university: true,
        team: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.athlete.delete({
      where: { id },
    });
  }

  async findByTeamId(teamId: string) {
    logger.log(`Finding athletes for team ID: ${teamId}`);

    return this.prismaService.athlete.findMany({
      where: { teamId },
      orderBy: {
        name: 'asc',
      },
      include: {
        university: true,
        team: true,
      },
    });
  }

  async findByUniversityId(universityId: string) {
    logger.log(`Finding athletes for university ID: ${universityId}`);

    return this.prismaService.athlete.findMany({
      where: { universityId },
      orderBy: {
        name: 'asc',
      },
      include: {
        university: true,
        team: true,
      },
    });
  }

  async findAthleteResults(id: string) {
    await this.findOne(id);
    logger.log(`Finding results for athlete ID: ${id}`);

    return this.prismaService.athleteResult.findMany({
      where: { athleteId: id },
      orderBy: {
        date: 'desc',
      },
    });
  }
}