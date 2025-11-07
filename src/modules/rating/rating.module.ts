import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingResolver } from './rating.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UniversityService } from '../university/university.service';
import { AthleteService } from '../athlete/athlete.service';
import { CommonModule } from '../../common/common.module';
import { RatingController } from './rating.controller';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [RatingController],
  providers: [
    RatingService,
    RatingResolver,
    UniversityService,
    AthleteService
  ],
  exports: [RatingService],
})
export class RatingModule {}