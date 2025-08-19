import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { UniversityService } from '../../university/university.service';
import { CreateUniversityDto } from '../../university/dto/create-university.dto';
import { UpdateUniversityDto } from '../../university/dto/update-university.dto';
import { PaginationParams } from '../../../common/pagination/pagination-params.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('universities')
@Controller('admin/api/universities')
export class AdminUniversityApiController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новый университет' })
  @ApiResponse({
    status: 201,
    description: 'Университет успешно создан',
    type: Object
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiBody({ type: CreateUniversityDto })
  async create(@Body() createUniversityDto: CreateUniversityDto) {
    try {
      return await this.universityService.create(createUniversityDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create university',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех университетов' })
  @ApiResponse({
    status: 200,
    description: 'Список университетов',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'object' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' }
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество элементов на странице', type: Number })
  async findAll(@Query() paginationParams: PaginationParams) {
    return this.universityService.findAll(paginationParams);
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск университетов по названию' })
  @ApiResponse({
    status: 200,
    description: 'Список найденных университетов',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'object' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' }
      }
    }
  })
  @ApiQuery({ name: 'name', required: true, description: 'Название для поиска', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество элементов на странице', type: Number })
  async search(
    @Query('name') name: string,
    @Query() paginationParams: PaginationParams
  ) {
    if (!name || name.trim() === '') {
      return this.universityService.findAll(paginationParams);
    }
    return this.universityService.searchByName(name, paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить университет по ID' })
  @ApiResponse({ status: 200, description: 'Данные университета', type: Object })
  @ApiResponse({ status: 404, description: 'Университет не найден' })
  @ApiParam({ name: 'id', description: 'ID университета', type: String })
  async findOne(@Param('id') id: string) {
    try {
      const university = await this.universityService.findOne(id);
      return university;
    } catch (error) {
      throw new HttpException(
        error.message || 'University not found',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные университета' })
  @ApiResponse({ status: 200, description: 'Данные университета обновлены', type: Object })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Университет не найден' })
  @ApiParam({ name: 'id', description: 'ID университета', type: String })
  @ApiBody({ type: UpdateUniversityDto })
  async update(@Param('id') id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
    try {
      return await this.universityService.update(id, updateUniversityDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update university',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить университет' })
  @ApiResponse({ status: 204, description: 'Университет успешно удален' })
  @ApiResponse({ status: 400, description: 'Ошибка при удалении' })
  @ApiResponse({ status: 404, description: 'Университет не найден' })
  @ApiParam({ name: 'id', description: 'ID университета', type: String })
  async remove(@Param('id') id: string) {
    try {
      await this.universityService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete university',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id/teams')
  @ApiOperation({ summary: 'Получить команды университета' })
  @ApiResponse({
    status: 200,
    description: 'Список команд',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          universityId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Университет или команды не найдены' })
  @ApiParam({ name: 'id', description: 'ID университета', type: String })
  async findUniversityTeams(@Param('id') id: string) {
    try {
      await this.universityService.findOne(id);

      const teams = await this.findTeamsByUniversityId(id);
      return teams;
    } catch (error) {
      throw new HttpException(
        error.message || 'Teams not found for this university',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(':id/coaches')
  @ApiOperation({ summary: 'Получить тренеров университета' })
  @ApiResponse({
    status: 200,
    description: 'Список тренеров',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
          description: { type: 'string' },
          universityId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Университет или тренеры не найдены' })
  @ApiParam({ name: 'id', description: 'ID университета', type: String })
  async findUniversityCoaches(@Param('id') id: string) {
    try {
      await this.universityService.findOne(id);

      const coaches = await this.findCoachesByUniversityId(id);
      return coaches;
    } catch (error) {
      throw new HttpException(
        error.message || 'Coaches not found for this university',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(':id/athletes')
  @ApiOperation({ summary: 'Получить спортсменов университета' })
  @ApiResponse({
    status: 200,
    description: 'Список спортсменов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
          gender: { type: 'string' },
          height: { type: 'number' },
          weight: { type: 'number' },
          birthYear: { type: 'number' },
          sportTitle: { type: 'string', nullable: true },
          universityId: { type: 'string' },
          teamId: { type: 'string', nullable: true },
          team: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Университет или спортсмены не найдены' })
  @ApiParam({ name: 'id', description: 'ID университета', type: String })
  async findUniversityAthletes(@Param('id') id: string) {
    try {
      await this.universityService.findOne(id);

      const athletes = await this.findAthletesByUniversityId(id);
      return athletes;
    } catch (error) {
      throw new HttpException(
        error.message || 'Athletes not found for this university',
        HttpStatus.NOT_FOUND
      );
    }
  }

  private async findTeamsByUniversityId(universityId: string) {
    return this.universityService['prismaService'].team.findMany({
      where: { universityId },
      orderBy: { name: 'asc' }
    });
  }

  private async findCoachesByUniversityId(universityId: string) {
    return this.universityService['prismaService'].coach.findMany({
      where: { universityId },
      orderBy: { name: 'asc' }
    });
  }

  private async findAthletesByUniversityId(universityId: string) {
    return this.universityService['prismaService'].athlete.findMany({
      where: { universityId },
      include: {
        team: true
      },
      orderBy: { name: 'asc' }
    });
  }
}