import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { UniversityModule } from './modules/university/university.module';
import { AthleteModule } from './modules/athlete/athlete.module';
import { TeamModule } from './modules/team/team.module';
import { RatingModule } from './modules/rating/rating.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
      ],
      buildSchemaOptions: {
        orphanedTypes: [],
        skipCheck: true
      }
    }),
    UniversityModule,
    AthleteModule,
    TeamModule,
    RatingModule,
  ],
  exports: [GraphQLModule],
})
export class GraphQLAppModule {}