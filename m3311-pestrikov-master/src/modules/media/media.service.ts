import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const logger = new Logger('MediaService');

@Injectable()
export class MediaService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async getCarouselImages() {
    try {
      const carouselImages = await this.prismaService.mediaItem.findMany({
        where: {
          type: 'carousel',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (carouselImages.length > 0) {
        logger.log(`Found ${carouselImages.length} carousel images`);

        return carouselImages.map(image => ({
          src: image.src,
          alt: image.alt || 'Карусель изображение',
        }));
      }
    } catch (error) {
      logger.error('Error fetching carousel images:', error);
      return [];
    }
  }

  async getGalleryImages() {
    try {
      const galleryImages = await this.prismaService.mediaItem.findMany({
        where: {
          type: 'gallery',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (galleryImages.length > 0) {
        logger.log(`Found ${galleryImages.length} gallery images`);

        return galleryImages.map(image => ({
          src: image.src,
          alt: image.alt || 'Изображение галереи',
        }));
      }
    } catch (error) {
      logger.error('Error fetching gallery images:', error);
      return [];
    }
  }
}
