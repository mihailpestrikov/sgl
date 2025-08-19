import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UniversityModel } from '../../modules/university/models/university.model';
import { AthleteModel } from '../../modules/athlete/models/athlete.model';
import { TeamModel } from '../../modules/team/models/team.model';

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { description: 'Список элементов на странице' })
    items: T[];

    @Field(() => Int, { description: 'Общее количество элементов' })
    total: number;

    @Field(() => Int, { description: 'Номер текущей страницы' })
    page: number;

    @Field(() => Int, { description: 'Количество элементов на странице' })
    limit: number;

    @Field(() => Int, { description: 'Общее количество страниц' })
    totalPages: number;
  }

  return PaginatedType;
}

@ObjectType()
export class PaginatedUniversities extends Paginated(UniversityModel) {}

@ObjectType()
export class PaginatedAthletes extends Paginated(AthleteModel) {}

@ObjectType()
export class PaginatedTeams extends Paginated(TeamModel) {}