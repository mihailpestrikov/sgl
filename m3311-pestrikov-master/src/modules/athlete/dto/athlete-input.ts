import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AthleteInput {
  @Field({ description: 'ФИО спортсмена' })
  name: string;

  @Field({ description: 'Роль спортсмена' })
  role: string;

  @Field({ description: 'Пол спортсмена' })
  gender: string;

  @Field(() => Int, { description: 'Рост спортсмена в см' })
  height: number;

  @Field(() => Int, { description: 'Вес спортсмена в кг' })
  weight: number;

  @Field(() => Int, { description: 'Год рождения' })
  birthYear: number;

  @Field({ nullable: true, description: 'Спортивное звание' })
  sportTitle?: string;

  @Field({ description: 'ID университета' })
  universityId: string;

  @Field({ nullable: true, description: 'ID команды' })
  teamId?: string;
}