import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AthleteModel } from './athlete.model';

@ObjectType('AthleteResultGQL')
export class AthleteResultModel {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Название соревнования' })
  competitionName: string;

  @Field({ description: 'Тип соревнования (вода, эргометр)' })
  competitionType: string;

  @Field({ description: 'Дистанция' })
  distance: string;

  @Field({ description: 'Результат (время)' })
  result: string;

  @Field({ nullable: true, description: 'Занятое место' })
  place?: number;

  @Field({ description: 'Дата проведения соревнования' })
  date: Date;

  @Field({ nullable: true, description: 'Название команды' })
  teamName?: string;

  @Field({ nullable: true, description: 'Весовая категория' })
  weightCategory?: string;

  @Field(() => AthleteModel, { description: 'Спортсмен, показавший результат' })
  athlete: AthleteModel;

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}