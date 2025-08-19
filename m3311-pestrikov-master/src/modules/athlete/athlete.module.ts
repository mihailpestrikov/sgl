import { Module } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { AthleteResolver } from './athlete.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UniversityService } from '../university/university.service';
import { TeamService } from '../team/team.service';
import { RatingService } from '../rating/rating.service';
import { AthleteController } from './athlete.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [AthleteController],
  providers: [
    AthleteService,
    AthleteResolver,
    UniversityService,
    TeamService,
    RatingService
  ],
  exports: [AthleteService],
})
export class AthleteModule {}


