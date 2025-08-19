import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AthleteModel } from './models/athlete.model';
import { AthleteService } from './athlete.service';
import { UniversityService } from '../university/university.service';
import { TeamService } from '../team/team.service';
import { RatingService } from '../rating/rating.service';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { PaginatedAthletes } from '../../common/pagination/paginated-response';
import { AthleteInput } from './dto/athlete-input';

@Resolver(() => AthleteModel)
export class AthleteResolver {
  constructor(
    private athleteService: AthleteService,
    private universityService: UniversityService,
    private teamService: TeamService,
    private ratingService: RatingService,
  ) {}

  @Query(() => PaginatedAthletes, { description: 'Получить список спортсменов с пагинацией' })
  async athletes(@Args('pagination', { nullable: true }) pagination?: PaginationInput) {
    return this.athleteService.findAll(pagination || { page: 1, limit: 10 });
  }

  @Query(() => AthleteModel, { description: 'Получить спортсмена по ID' })
  async athlete(@Args('id', { type: () => ID }) id: string) {
    return this.athleteService.findOne(id);
  }

  @Mutation(() => AthleteModel, { description: 'Создать нового спортсмена' })
  async createAthlete(@Args('input') input: AthleteInput) {
    return this.athleteService.create(input);
  }

  @Mutation(() => AthleteModel, { description: 'Обновить данные спортсмена' })
  async updateAthlete(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: AthleteInput,
  ) {
    return this.athleteService.update(id, input);
  }

  @Mutation(() => Boolean, { description: 'Удалить спортсмена' })
  async removeAthlete(@Args('id', { type: () => ID }) id: string) {
    await this.athleteService.remove(id);
    return true;
  }

  @ResolveField()
  async university(@Parent() athlete: AthleteModel) {
    const { universityId } = athlete;
    return this.universityService.findOne(universityId);
  }

  @ResolveField()
  async team(@Parent() athlete: AthleteModel) {
    const { teamId } = athlete;
    if (!teamId) return null;
    return this.teamService.findOne(teamId);
  }

  @ResolveField()
  async results(@Parent() athlete: AthleteModel) {
    const { id } = athlete;
    return this.athleteService.findAthleteResults(id);
  }

  @ResolveField()
  async rating(@Parent() athlete: AthleteModel) {
    const { id } = athlete;
    return this.ratingService.findPersonalRating(id);
  }
}