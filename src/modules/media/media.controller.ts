import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderWithLayout } from '../../common/render';
import { CommonDataService } from '../../common/common-data.service';
import { PAGE_TITLES } from '../../config/constants';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly commonDataService: CommonDataService,
    private readonly mediaService: MediaService,
  ) {}

  @Get()
  async media(@Res() res: Response) {
    const commonData = this.commonDataService.getCommonTemplateData();

    const carouselImages = await this.mediaService.getCarouselImages();
    const galleryImages = await this.mediaService.getGalleryImages();

    const data = {
      title: PAGE_TITLES.MEDIA,
      ...commonData,
      carouselImages,
      galleryImages,
    };

    renderWithLayout(res, 'media', data);
  }
}