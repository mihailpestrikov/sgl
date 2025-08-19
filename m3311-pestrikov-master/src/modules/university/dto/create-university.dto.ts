import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUniversityDto {
  @ApiProperty({ description: 'Полное название университета', example: 'Университет ИТМО' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Сокращенное название университета', example: 'ИТМО' })
  @IsString()
  @IsOptional()
  shortName?: string;

  @ApiProperty({ description: 'Дата основания', example: '26 марта 1900 г.' })
  @IsString()
  foundationDate: string;

  @ApiProperty({
    description: 'Год вступления в Студенческую Гребную Лигу',
    example: 2018,
    minimum: 1900
  })
  @IsInt()
  @Min(1900)
  sglJoinYear: number;

  @ApiPropertyOptional({
    description: 'Достижения в СГЛ',
    example: 'Чемпион СГЛ 2020, 2022, 2023'
  })
  @IsString()
  @IsOptional()
  achievements?: string;

  @ApiProperty({
    description: 'Описание университета',
    example: 'Университет ИТМО — ведущий вуз России в области информационных технологий...'
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'URL баннера университета',
    example: '/img/universities/itmo_banner.jpg'
  })
  @IsString()
  @IsOptional()
  headerImage?: string;

  @ApiPropertyOptional({
    description: 'URL логотипа университета',
    example: '/img/universities/itmo_logo.png'
  })
  @IsString()
  @IsOptional()
  logo?: string;
}