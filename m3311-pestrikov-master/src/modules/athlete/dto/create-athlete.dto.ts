import { IsString, IsInt, IsOptional, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAthleteDto {
  @ApiProperty({ description: 'ФИО спортсмена', example: 'Иванов Иван Иванович' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Роль спортсмена', example: 'Гребец' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Пол спортсмена', example: 'Мужской', enum: ['Мужской', 'Женский'] })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Рост спортсмена (см)', example: 185, minimum: 100, maximum: 250 })
  @IsInt()
  @Min(100)
  @Max(250)
  height: number;

  @ApiProperty({ description: 'Вес спортсмена (кг)', example: 80, minimum: 40, maximum: 150 })
  @IsInt()
  @Min(40)
  @Max(150)
  weight: number;

  @ApiProperty({ description: 'Год рождения', example: 2000, minimum: 1980, maximum: 2010 })
  @IsInt()
  @Min(1980)
  @Max(2010)
  birthYear: number;

  @ApiPropertyOptional({
    description: 'Спортивное звание',
    example: 'Мастер спорта России',
    enum: [
      'Мастер спорта России международного класса',
      'Мастер спорта России',
      'Кандидат в мастера спорта',
      'I спортивный разряд',
      'II спортивный разряд',
      'III спортивный разряд',
      'I юношеский разряд',
      'II юношеский разряд',
      'III юношеский разряд'
    ]
  })
  @IsOptional()
  @IsString()
  sportTitle?: string;

  @ApiPropertyOptional({ description: 'URL фотографии', example: '/img/athletes/photo_001.png' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ description: 'ID университета', example: 'itmo' })
  @IsUUID()
  universityId: string;

  @ApiPropertyOptional({ description: 'ID команды', example: 'itmo-m8' })
  @IsOptional()
  @IsUUID()
  teamId?: string;
}