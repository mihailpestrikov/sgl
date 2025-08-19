import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaginationParams } from '../../common/pagination/pagination-params.dto';
import { PaginatedResult } from '../../common/pagination/paginated-result.class';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

const logger = new Logger('UniversityService');

@Injectable()
export class UniversityService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneForView(id: string) {
    try {
      const university = await this.prismaService.university.findUnique({
        where: { id },
      });

      if (!university) {
        return this.getMockUniversityData(id);
      }

      const coaches = await this.prismaService.coach.findMany({
        where: { universityId: id },
        orderBy: { name: 'asc' },
      });

      const teamMembers = await this.prismaService.athlete.findMany({
        where: { universityId: id },
        orderBy: { name: 'asc' },
      });

      return {
        title: `${university.name} - Студенческая Гребная Лига`,
        universityName: university.name,
        universityHeaderImage: university.headerImage || '/img/universities/default_banner.jpg',
        universityLogo: university.logo || '/img/universities/default_logo.png',
        foundationDate: university.foundationDate,
        sglJoinYear: university.sglJoinYear.toString(),
        achievements: university.achievements || 'Информация отсутствует',
        universityDescription: university.description,
        coaches: coaches.map(coach => ({
          name: coach.name,
          role: coach.role,
          description: coach.description,
        })),
        teamMembers: teamMembers.map(athlete => ({
          name: athlete.name,
          university: university.name,
          role: athlete.role,
          gender: athlete.gender,
          height: athlete.height,
          weight: athlete.weight,
          athleteId: athlete.id,
          universityId: id,
          photo: athlete.photo || null,
        })),
      };
    } catch (error) {
      console.error(`Error fetching university with ID ${id}:`, error);
      return this.getMockUniversityData(id);
    }
  }

  async findAll(params: PaginationParams) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    logger.log(`Finding all universities with pagination: page ${pageNumber}, limit ${limitNumber}`);

    const [universities, total] = await Promise.all([
      this.prismaService.university.findMany({
        skip,
        take: limitNumber,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.university.count(),
    ]);

    return new PaginatedResult(universities, total, pageNumber, limitNumber);
  }

  async findOne(id: string) {
    logger.log(`Finding university with ID: ${id}`);

    const university = await this.prismaService.university.findUnique({
      where: { id }
    });

    if (!university) {
      logger.warn(`University with ID ${id} not found`);
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    return university;
  }

  async create(createUniversityDto: CreateUniversityDto) {
    logger.log(`Creating new university: ${createUniversityDto.name}`);
    return this.prismaService.university.create({
      data: createUniversityDto
    });
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    logger.log(`Updating university with ID: ${id}`);

    await this.findOne(id);

    return this.prismaService.university.update({
      where: { id },
      data: updateUniversityDto
    });
  }

  async remove(id: string) {
    logger.log(`Removing university with ID: ${id}`);

    await this.findOne(id);

    await this.prismaService.university.delete({
      where: { id }
    });
  }

  async searchByName(name: string, params: PaginationParams) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    logger.log(`Searching universities by name: "${name}", page ${pageNumber}, limit ${limitNumber}`);

    const [universities, total] = await Promise.all([
      this.prismaService.university.findMany({
        where: {
          OR: [
            { name: { contains: name, mode: 'insensitive' } },
            { shortName: { contains: name, mode: 'insensitive' } }
          ]
        },
        skip,
        take: limitNumber,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.university.count({
        where: {
          OR: [
            { name: { contains: name, mode: 'insensitive' } },
            { shortName: { contains: name, mode: 'insensitive' } }
          ]
        }
      }),
    ]);

    return new PaginatedResult(universities, total, pageNumber, limitNumber);
  }


  private getMockUniversityData(id: string) {
    return {
      universityName: 'Университет',
      universityHeaderImage: '/img/universities/default_banner.jpg',
      universityLogo: '/img/universities/default_logo.png',
      foundationDate: 'Информация отсутствует',
      sglJoinYear: 'Информация отсутствует',
      achievements: 'Информация отсутствует',
      universityDescription: 'Информация о данном университете отсутствует в базе данных.',
      coaches: [],
      teamMembers: []
    };
  }
}