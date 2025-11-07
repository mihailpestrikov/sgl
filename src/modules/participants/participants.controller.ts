import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { PAGE_TITLES } from '../../config/constants';
import { ParticipantsService } from './participants.service';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly participantsService: ParticipantsService,
  ) {}

  @Get()
  async participants(
    @Query('search') search: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '18',
    @Res() res: Response
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 18;
    const paginationParams = { page: pageNumber, limit: pageSize };

    const commonData = this.commonDataService.getCommonTemplateData();

    let result;
    if (search) {
      result = await this.participantsService.searchAthletesByName(search, paginationParams);
    } else {
      result = await this.participantsService.getAllAthletes(paginationParams);
    }

    const totalPages = result.totalPages;
    const pages: Array<{ number: number; current: boolean }> = [];

    const maxPageButtons = 5;
    let startPage = Math.max(1, result.page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        number: i,
        current: i === result.page
      });
    }

    const pagination = {
      currentPage: result.page,
      totalPages: totalPages,
      hasPrevPage: result.page > 1,
      hasNextPage: result.page < totalPages,
      prevPage: result.page - 1,
      nextPage: result.page + 1,
      pages: pages,
      totalItems: result.total,
      startItem: (result.page - 1) * result.limit + 1,
      endItem: Math.min(result.page * result.limit, result.total)
    };

    const data = {
      title: PAGE_TITLES.PARTICIPANTS,
      ...commonData,
      participants: result.items,
      pagination: pagination,
      searchQuery: search || '',
    };

    renderWithLayout(res, 'participants', data);
  }
}