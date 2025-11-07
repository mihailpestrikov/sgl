import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RatingController } from '../rating/rating.controller';
import { CommonDataService } from '../../common/common-data.service';
import { renderWithLayout } from '../../common/render';

@Controller('admin')
export class AdminController {
  constructor(private readonly commonDataService: CommonDataService) {}

  @Get('simulate-rating-change')
  simulateRatingChange(@Query('type') type: string = 'positionUp') {
    let changeData = {};

    switch(type) {
      case 'positionUp':
        changeData = {
          changeType: 'positionUp',
          name: 'Иван Иванов',
          positionsChanged: 2,
          newPosition: 1,
          oldPosition: 3
        };
        break;
      case 'positionDown':
        changeData = {
          changeType: 'positionDown',
          name: 'Петр Петров',
          positionsChanged: 1,
          newPosition: 3,
          oldPosition: 2
        };
        break;
      case 'newEntry':
        changeData = {
          changeType: 'newEntry',
          name: 'Антон Новиков',
          newPosition: 10,
          totalEntries: 10
        };
        break;
      case 'scoreChange':
        changeData = {
          changeType: 'scoreChange',
          name: 'Иван Иванов',
          oldScore: 110,
          newScore: 120
        };
        break;
    }

    RatingController.notifyRatingChange(changeData);

    return {
      success: true,
      message: 'Rating change notification sent',
      data: changeData
    };
  }

  @Get()
  adminIndex(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Админ-панель - Студенческая Гребная Лига',
      ...commonData,
      adminPanel: true,
      currentPage: 'main'
    };
    renderWithLayout(res, 'admin/index', data);
  }

  @Get('athletes')
  adminAthletes(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Управление спортсменами - Админ-панель',
      ...commonData,
      adminPanel: true,
      currentPage: 'athletes'
    };
    renderWithLayout(res, 'admin/athletes', data);
  }

  @Get('universities')
  adminUniversities(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Управление университетами - Админ-панель',
      ...commonData,
      adminPanel: true,
      currentPage: 'universities'
    };
    renderWithLayout(res, 'admin/universities', data);
  }

  @Get('teams')
  adminTeams(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Управление командами - Админ-панель',
      ...commonData,
      adminPanel: true,
      currentPage: 'teams'
    };
    renderWithLayout(res, 'admin/teams', data);
  }

  @Get('results')
  adminResults(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Управление результатами - Админ-панель',
      ...commonData,
      adminPanel: true,
      currentPage: 'results'
    };
    renderWithLayout(res, 'admin/results', data);
  }

  @Get('coaches')
  adminCoaches(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Управление тренерами - Админ-панель',
      ...commonData,
      adminPanel: true,
      currentPage: 'coaches'
    };
    renderWithLayout(res, 'admin/coaches', data);
  }

  @Get('ratings')
  adminRatings(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();
    const data = {
      title: 'Управление рейтингами - Админ-панель',
      ...commonData,
      adminPanel: true,
      currentPage: 'ratings'
    };
    renderWithLayout(res, 'admin/ratings', data);
  }
}