import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UniversityModel } from './models/university.model';
import { UniversityService } from './university.service';
import { AthleteService } from '../athlete/athlete.service';
import { RatingService } from '../rating/rating.service';
import { TeamService } from '../team/team.service';
import { PaginationInput } from '../../common/pagination/pagination.input';
import { PaginatedUniversities } from '../../common/pagination/paginated-response';
import { UniversityInput } from './dto/university-input';

@Resolver(() => UniversityModel)
export class UniversityResolver {
  constructor(
    private universityService: UniversityService,
    private teamService: TeamService,
    private athleteService: AthleteService,
    private ratingService: RatingService,
  ) {}

  @Query(() => PaginatedUniversities, { description: 'Получить список университетов с пагинацией' })
  async universities(@Args('pagination', { nullable: true }) pagination?: PaginationInput) {
    return this.universityService.findAll(pagination || { page: 1, limit: 10 });
  }

  @Query(() => UniversityModel, { description: 'Получить университет по ID' })
  async university(@Args('id', { type: () => ID }) id: string) {
    return this.universityService.findOne(id);
  }

  @Mutation(() => UniversityModel, { description: 'Создать новый университет' })
  async createUniversity(@Args('input') input: UniversityInput) {
    return this.universityService.create(input);
  }

  @Mutation(() => UniversityModel, { description: 'Обновить данные университета' })
  async updateUniversity(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UniversityInput,
  ) {
    return this.universityService.update(id, input);
  }

  @Mutation(() => Boolean, { description: 'Удалить университет' })
  async removeUniversity(@Args('id', { type: () => ID }) id: string) {
    await this.universityService.remove(id);
    return true;
  }

  @ResolveField()
  async teams(@Parent() university: UniversityModel) {
    const { id } = university;
    return this.teamService.findByUniversityId(id);
  }

  @ResolveField()
  async athletes(@Parent() university: UniversityModel) {
    const { id } = university;
    return this.athleteService.findByUniversityId(id);
  }

  @ResolveField()
  async ratings(@Parent() university: UniversityModel) {
    const { id } = university;
    return this.ratingService.findUniversityRatings(id);
  }
}