import { Field, ID, ObjectType, Float } from '@nestjs/graphql';
import { UniversityModel } from '../../university/models/university.model';

@ObjectType('UniversityRating')
export class UniversityRatingModel {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Позиция в рейтинге' })
  position: number;

  @Field(() => Float, { description: 'Очки рейтинга' })
  score: number;

  @Field({ description: 'Пол (Мужской/Женский)' })
  gender: string;

  @Field(() => UniversityModel, { description: 'Университет' })
  university: UniversityModel;
}
