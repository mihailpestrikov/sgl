import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UniversityService } from '../university/university.service';
import { AthleteService } from '../athlete/athlete.service';

@Module({
  imports: [PrismaModule],
  providers: [
    TeamService,
    TeamResolver,
    UniversityService,
    AthleteService
  ],
  exports: [TeamService],
})
export class TeamModule {}