// src/modules/team/team.resolver.ts
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TeamModel } from './models/team.model';
import { TeamService } from './team.service';
import { UniversityService } from '../university/university.service';
import { AthleteService } from '../athlete/athlete.service';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { PaginatedTeams } from '../../common/pagination/paginated-response';

@Resolver(() => TeamModel)
export class TeamResolver {
  constructor(
    private teamService: TeamService,
    private universityService: UniversityService,
    private athleteService: AthleteService,
  ) {}

  @Query(() => PaginatedTeams, { description: 'Получить список команд с пагинацией' })
  async teams(@Args('pagination', { nullable: true }) pagination?: PaginationInput) {
    return this.teamService.findAll(pagination || { page: 1, limit: 10 });
  }

  @Query(() => TeamModel, { description: 'Получить команду по ID' })
  async team(@Args('id', { type: () => ID }) id: string) {
    return this.teamService.findOne(id);
  }

  @ResolveField()
  async university(@Parent() team: TeamModel) {
    const { universityId } = team;
    return this.universityService.findOne(universityId);
  }

  @ResolveField()
  async athletes(@Parent() team: TeamModel) {
    const { id } = team;
    return this.athleteService.findByTeamId(id);
  }
}