import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityResolver } from './university.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { TeamService } from '../team/team.service';
import { AthleteService } from '../athlete/athlete.service';
import { RatingService } from '../rating/rating.service';
import { CommonModule } from '../../common/common.module';
import { UniversityController } from './university.controller';

@Module({
  imports: [
    PrismaModule,
    CommonModule],
  controllers: [UniversityController],
  providers: [
    UniversityService,
    UniversityResolver,
    TeamService,
    AthleteService,
    RatingService
  ],
  exports: [UniversityService],
})
export class UniversityModule {}



