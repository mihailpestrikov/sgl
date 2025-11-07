import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { PAGE_TITLES } from '../../config/constants';
import { AuthService } from './auth.service';

@Controller('login')
export class AuthController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  login(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();

    const data = {
      title: PAGE_TITLES.LOGIN,
      ...commonData,
    };
    renderWithLayout(res, 'login', data);
  }
}