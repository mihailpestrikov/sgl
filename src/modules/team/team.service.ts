import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaginationParams } from '../../common/pagination/pagination-params.dto';
import { PaginatedResult } from '../../common/pagination/paginated-result.class';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    this.logger.log(`Finding all teams with pagination: page ${pageNumber}, limit ${limitNumber}`);

    const [teams, total] = await Promise.all([
      this.prismaService.team.findMany({
        skip,
        take: limitNumber,
        orderBy: {
          name: 'asc',
        },
        include: {
          university: true,
        },
      }),
      this.prismaService.team.count(),
    ]);

    return new PaginatedResult(teams, total, pageNumber, limitNumber);
  }

  async findOne(id: string) {
    this.logger.log(`Finding team with ID: ${id}`);

    const team = await this.prismaService.team.findUnique({
      where: { id },
      include: {
        university: true,
      },
    });

    if (!team) {
      this.logger.warn(`Team with ID ${id} not found`);
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async findByUniversityId(universityId: string) {
    this.logger.log(`Finding teams for university ID: ${universityId}`);

    const teams = await this.prismaService.team.findMany({
      where: { universityId },
      orderBy: {
        name: 'asc',
      },
      include: {
        university: true,
      },
    });

    return teams;
  }

  async findByIds(ids: string[]) {
    this.logger.log(`Finding teams by IDs: ${ids.join(', ')}`);

    const teams = await this.prismaService.team.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        university: true,
      },
    });

    return teams;
  }

  async create(data: any) {
    this.logger.log(`Creating new team: ${data.name}`);

    return this.prismaService.team.create({
      data,
      include: {
        university: true,
      },
    });
  }

  async update(id: string, data: any) {
    this.logger.log(`Updating team with ID: ${id}`);

    await this.findOne(id);

    return this.prismaService.team.update({
      where: { id },
      data,
      include: {
        university: true,
      },
    });
  }

  async remove(id: string) {
    this.logger.log(`Removing team with ID: ${id}`);

    await this.findOne(id);

    await this.prismaService.team.delete({
      where: { id },
    });
  }
}