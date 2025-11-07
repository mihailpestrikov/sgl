import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { AthleteService } from '../../athlete/athlete.service';
import { CreateAthleteDto } from '../../athlete/dto/create-athlete.dto';
import { UpdateAthleteDto } from '../../athlete/dto/update-athlete.dto';
import { PaginationParams } from '../../../common/pagination/pagination-params.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('athletes')
@Controller('admin/api/athletes')
export class AdminAthleteApiController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать нового спортсмена' })
  @ApiResponse({
    status: 201,
    description: 'Спортсмен успешно создан',
    type: Object
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiBody({ type: CreateAthleteDto })
  async create(@Body() createAthleteDto: CreateAthleteDto) {
    try {
      return await this.athleteService.create(createAthleteDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create athlete',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех спортсменов' })
  @ApiResponse({
    status: 200,
    description: 'Список спортсменов',
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
    return this.athleteService.findAll(paginationParams);
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск спортсменов по имени' })
  @ApiResponse({
    status: 200,
    description: 'Список найденных спортсменов',
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
  @ApiQuery({ name: 'name', required: true, description: 'Имя для поиска', type: String })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество элементов на странице', type: Number })
  async search(
    @Query('name') name: string,
    @Query('universityId') universityId: string,
    @Query() paginationParams: PaginationParams
  ) {
    if ((!name || name.trim() === '') && (!universityId || universityId.trim() === '')) {
      return this.athleteService.findAll(paginationParams);
    }

    return this.athleteService.searchAthletes({
      name: name?.trim() || undefined,
      universityId: universityId?.trim() || undefined
    }, paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить спортсмена по ID' })
  @ApiResponse({ status: 200, description: 'Данные спортсмена', type: Object })
  @ApiResponse({ status: 404, description: 'Спортсмен не найден' })
  @ApiParam({ name: 'id', description: 'ID спортсмена', type: String })
  async findOne(@Param('id') id: string) {
    const athlete = await this.athleteService.findOne(id);
    if (!athlete) {
      throw new HttpException('Athlete not found', HttpStatus.NOT_FOUND);
    }
    return athlete;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные спортсмена' })
  @ApiResponse({ status: 200, description: 'Данные спортсмена обновлены', type: Object })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Спортсмен не найден' })
  @ApiParam({ name: 'id', description: 'ID спортсмена', type: String })
  @ApiBody({ type: UpdateAthleteDto })
  async update(@Param('id') id: string, @Body() updateAthleteDto: UpdateAthleteDto) {
    try {
      return await this.athleteService.update(id, updateAthleteDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update athlete',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить спортсмена' })
  @ApiResponse({ status: 204, description: 'Спортсмен успешно удален' })
  @ApiResponse({ status: 400, description: 'Ошибка при удалении' })
  @ApiResponse({ status: 404, description: 'Спортсмен не найден' })
  @ApiParam({ name: 'id', description: 'ID спортсмена', type: String })
  async remove(@Param('id') id: string) {
    try {
      await this.athleteService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete athlete',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Получить результаты спортсмена' })
  @ApiResponse({
    status: 200,
    description: 'Список результатов',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          competitionName: { type: 'string' },
          competitionType: { type: 'string' },
          distance: { type: 'string' },
          result: { type: 'string' },
          place: { type: 'number', nullable: true },
          date: { type: 'string', format: 'date-time' },
          teamName: { type: 'string', nullable: true },
          weightCategory: { type: 'string', nullable: true }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Результаты не найдены' })
  @ApiParam({ name: 'id', description: 'ID спортсмена', type: String })
  async findAthleteResults(@Param('id') id: string) {
    const results = await this.athleteService.findAthleteResults(id);
    if (!results || results.length === 0) {
      throw new HttpException('Results not found for this athlete', HttpStatus.NOT_FOUND);
    }
    return results;
  }
}