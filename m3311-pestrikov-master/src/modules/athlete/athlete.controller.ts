import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { AthleteService } from './athlete.service';
import { PAGE_TITLES } from '../../config/constants';

@Controller('athlete')
export class AthleteController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly athleteService: AthleteService,
  ) {}
  @Get(':id')
  async getAthlete(@Param('id') id: string, @Res() res: Response) {

    const commonData = this.commonDataService.getCommonTemplateData();
    const athleteData = await this.athleteService.findOneForView(id);

    renderWithLayout(res, 'athlete', {
      title: PAGE_TITLES.ATHLETE,
      ...commonData,
      ...athleteData,
    });
  }
}