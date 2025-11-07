import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAthleteApiController } from './api/athlete-api.controller';
import { AdminUniversityApiController } from './api/university-api.controller';
import { AthleteModule } from '../athlete/athlete.module';
import { UniversityModule } from '../university/university.module';
import { SeedController } from './seed/seed.controller';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [CommonModule, AthleteModule, UniversityModule],
  controllers: [
    AdminController,
    AdminAthleteApiController,
    AdminUniversityApiController,
    SeedController,
  ],
  providers: [
    AdminService,
    SeedService,
  ],
  exports: [AdminService]
})
export class AdminModule {}