import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AthleteModel } from '../../athlete/models/athlete.model';

@ObjectType('PersonalRating')
export class PersonalRatingModel {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Место в рейтинге' })
  place: number;

  @Field({ description: 'Количество очков' })
  points: number;

  @Field({ description: 'Пол (Мужской/Женский)' })
  gender: string;

  @Field(() => AthleteModel, { description: 'Спортсмен' })
  athlete: AthleteModel;
}