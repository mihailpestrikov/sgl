import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TeamModel } from '../../team/models/team.model';
import { AthleteModel } from '../../athlete/models/athlete.model';
import { UniversityRatingModel } from '../../rating/models/university-rating.model';

@ObjectType('University')
export class UniversityModel {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Полное название университета' })
  name: string;

  @Field({ nullable: true, description: 'Сокращенное название университета' })
  shortName?: string;

  @Field({ description: 'Дата основания университета' })
  foundationDate: string;

  @Field({ description: 'Год вступления в Студенческую Гребную Лигу' })
  sglJoinYear: number;

  @Field({ nullable: true, description: 'Достижения университета в СГЛ' })
  achievements?: string;

  @Field({ description: 'Описание университета' })
  description: string;

  @Field({ nullable: true, description: 'URL логотипа университета' })
  logo?: string;

  @Field({ nullable: true, description: 'URL заголовочного изображения' })
  headerImage?: string;

  @Field(() => [TeamModel], { description: 'Команды университета' })
  teams: TeamModel[];

  @Field(() => [AthleteModel], { description: 'Спортсмены университета' })
  athletes: AthleteModel[];

  @Field(() => [UniversityRatingModel], { description: 'Рейтинги университета' })
  ratings: UniversityRatingModel[];
}