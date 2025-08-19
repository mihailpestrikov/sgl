import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly universityService: UniversityService,
  ) {}

  @Get(':id')
  async getUniversity(@Param('id') id: string, @Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();

    const universityData = await this.universityService.findOneForView(id);

    const data = {
      ...commonData,
      ...universityData
    };

    renderWithLayout(res, 'university', data);
  }
}