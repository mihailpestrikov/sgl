import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UniversityInput {
  @Field({ description: 'Полное название университета' })
  name: string;

  @Field({ nullable: true, description: 'Сокращенное название университета' })
  shortName?: string;

  @Field({ description: 'Дата основания университета' })
  foundationDate: string;

  @Field(() => Int, { description: 'Год вступления в СГЛ' })
  sglJoinYear: number;

  @Field({ nullable: true, description: 'Достижения в СГЛ' })
  achievements?: string;

  @Field({ description: 'Описание университета' })
  description: string;

  @Field({ nullable: true, description: 'URL логотипа' })
  logo?: string;

  @Field({ nullable: true, description: 'URL заголовочного изображения' })
  headerImage?: string;
}

