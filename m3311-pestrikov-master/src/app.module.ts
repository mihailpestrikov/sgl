import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HomeController } from './modules/home/home.controller';
import { ParticipantsController } from './modules/participants/participants.controller';
import { RatingController } from './modules/rating/rating.controller';
import { MediaController } from './modules/media/media.controller';
import { FormController } from './modules/form/form.controller';
import { AuthController } from './modules/auth/auth.controller';
import { UniversityController } from './modules/university/university.controller';
import { CommonDataService } from './common/common-data.service';
import appConfig from './config/app.config';
import { PrismaModule } from '../prisma/prisma.module';
import { AthleteController } from './modules/athlete/athlete.controller';
import { AthleteService } from './modules/athlete/athlete.service';
import { AuthService } from './modules/auth/auth.service';
import { FormService } from './modules/form/form.service';
import { HomeService } from './modules/home/home.service';
import { MediaService } from './modules/media/media.service';
import { ParticipantsService } from './modules/participants/participants.service';
import { RatingService } from './modules/rating/rating.service';
import { UniversityService } from './modules/university/university.service';
import { UniversityModule } from './modules/university/university.module';
import { RatingModule } from './modules/rating/rating.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { MediaModule } from './modules/media/media.module';
import { HomeModule } from './modules/home/home.module';
import { FormModule } from './modules/form/form.module';
import { AuthModule } from './modules/auth/auth.module';
import { AthleteModule } from './modules/athlete/athlete.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdminController } from './modules/admin/admin.controller';
import { AdminService } from './modules/admin/admin.service';
import { TeamModule } from './modules/team/team.module';
import { GraphQLAppModule } from './graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PrismaModule,

    GraphQLAppModule,

    AthleteModule,
    AuthModule,
    FormModule,
    HomeModule,
    MediaModule,
    ParticipantsModule,
    RatingModule,
    TeamModule,
    UniversityModule,
    AdminModule,
  ],

  controllers: [
    HomeController,
    ParticipantsController,
    RatingController,
    MediaController,
    FormController,
    AuthController,
    UniversityController,
    AthleteController,
    AdminController
  ],
  providers: [
    CommonDataService,
    AthleteService,
    AuthService,
    FormService,
    HomeService,
    MediaService,
    ParticipantsService,
    RatingService,
    UniversityService,
    AdminService,
  ],
})
export class AppModule {}
