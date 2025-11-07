import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { PAGE_TITLES } from '../../config/constants';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly formService: FormService,
  ) {}

  @Get()
  form(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();

    const data = {
      title: PAGE_TITLES.FORM,
      ...commonData,
    };
    renderWithLayout(res, 'form', data);
  }
}