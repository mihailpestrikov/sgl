import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UniversityModel } from '../../university/models/university.model';
import { AthleteModel } from '../../athlete/models/athlete.model';

@ObjectType('Team')
export class TeamModel {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Название команды' })
  name: string;

  universityId: string;

  @Field(() => UniversityModel, { description: 'Университет, к которому относится команда' })
  university: UniversityModel;

  @Field(() => [AthleteModel], { description: 'Спортсмены в команде' })
  athletes: AthleteModel[];

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}