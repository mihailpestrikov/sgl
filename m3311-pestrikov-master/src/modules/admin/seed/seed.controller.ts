import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('admin/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  async seedAll() {
    return this.seedService.seedAll();
  }

  @Get('universities')
  async seedUniversities() {
    return this.seedService.seedUniversities();
  }

  @Get('teams')
  async seedTeams() {
    return this.seedService.seedTeams();
  }

  @Get('coaches')
  async seedCoaches() {
    return this.seedService.seedCoaches();
  }

  @Get('athletes')
  async seedAthletes() {
    return this.seedService.seedAthletes();
  }

  @Get('athlete-results')
  async seedAthleteResults() {
    return this.seedService.seedAthleteResults();
  }

  @Get('university-ratings')
  async seedUniversityRatings() {
    return this.seedService.seedUniversityRatings();
  }

  @Get('personal-ratings')
  async seedPersonalRatings() {
    return this.seedService.seedPersonalRatings();
  }

  @Get('media-items')
  async seedMediaItems() {
    return this.seedService.seedMediaItems();
  }
}