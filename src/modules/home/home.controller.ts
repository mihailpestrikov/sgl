import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { PAGE_TITLES } from '../../config/constants';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly homeService: HomeService,
  ) {}

  @Get()
  async index(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();

    const homeData = await this.homeService.getHomePageData();

    const data = {
      title: PAGE_TITLES.HOME,
      ...commonData,
      ...homeData
    };

    renderWithLayout(res, 'home', data);
  }
}