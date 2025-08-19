import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UniversityModel } from '../../university/models/university.model';
import { TeamModel } from '../../team/models/team.model';
import { AthleteResultModel } from './athlete-result.model';
import { PersonalRatingModel } from '../../rating/models/personal-rating.model';

@ObjectType('Athlete')
export class AthleteModel {
  @Field(() => ID)
  id: string;

  @Field({ description: 'ФИО спортсмена' })
  name: string;

  @Field({ description: 'Роль спортсмена (гребец, рулевой и т.д.)' })
  role: string;

  @Field({ description: 'Пол спортсмена' })
  gender: string;

  @Field({ description: 'Рост спортсмена в сантиметрах' })
  height: number;

  @Field({ description: 'Вес спортсмена в килограммах' })
  weight: number;

  @Field({ description: 'Год рождения спортсмена' })
  birthYear: number;

  @Field({ nullable: true, description: 'Спортивное звание' })
  sportTitle?: string;

  @Field({ nullable: true, description: 'URL фотографии спортсмена' })
  photo?: string;

  universityId: string;

  @Field(() => UniversityModel, { description: 'Университет спортсмена' })
  university: UniversityModel;

  teamId?: string;

  @Field(() => TeamModel, { nullable: true, description: 'Команда спортсмена' })
  team?: TeamModel;

  @Field(() => [AthleteResultModel], { description: 'Результаты спортсмена' })
  results: AthleteResultModel[];

  @Field(() => PersonalRatingModel, { nullable: true, description: 'Персональный рейтинг спортсмена' })
  rating?: PersonalRatingModel;
}