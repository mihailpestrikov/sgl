import { Args, Query, Resolver } from '@nestjs/graphql';
import { UniversityRatingModel } from './models/university-rating.model';
import { PersonalRatingModel } from './models/personal-rating.model';
import { RatingService } from './rating.service';

@Resolver()
export class RatingResolver {
  constructor(private ratingService: RatingService) {}

  @Query(() => [UniversityRatingModel], { description: 'Получить мужской рейтинг университетов' })
  async menUniversityRatings() {
    return this.ratingService.getMenUniversityRating();
  }

  @Query(() => [UniversityRatingModel], { description: 'Получить женский рейтинг университетов' })
  async womenUniversityRatings() {
    return this.ratingService.getWomenUniversityRating();
  }

  @Query(() => [PersonalRatingModel], { description: 'Получить мужской персональный рейтинг' })
  async menPersonalRatings() {
    return this.ratingService.getMenPersonalRating();
  }

  @Query(() => [PersonalRatingModel], { description: 'Получить женский персональный рейтинг' })
  async womenPersonalRatings() {
    return this.ratingService.getWomenPersonalRating();
  }
}