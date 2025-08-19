import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as hbs from 'hbs';
import * as fs from 'node:fs';
import * as exphbs from 'express-handlebars';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port') ?? 3001;
  const environment = configService.get<string>('app.environment') ?? 'development';

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));

  const logger = new Logger('Bootstrap');
  logger.log(`Environment: ${environment}`);

  const viewsPath = join(process.cwd(), 'views');
  const partialsPath = join(viewsPath, 'partials');

  registerPartials(partialsPath);

  const config = new DocumentBuilder()
    .setTitle('Студенческая Гребная Лига API')
    .setDescription('API для веб-платформы Студенческой Гребной Лиги')
    .setVersion('1.0')
    .addTag('athletes', 'Управление спортсменами')
    .addTag('universities', 'Управление университетами')
    .addTag('ratings', 'Рейтинги команд и спортсменов')
    .addTag('teams', 'Управление командами')
    .addTag('coaches', 'Управление тренерами')
    .addTag('media', 'Медиа материалы')
    .addTag('results', 'Результаты соревнований')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const handlebars = exphbs.create({
    extname: 'hbs',
    defaultLayout: false,
    layoutsDir: join(process.cwd(), 'views', 'layouts'),
    partialsDir: join(process.cwd(), 'views', 'partials'),
    helpers: {
      eq: function(arg1, arg2) {
        return arg1 === arg2;
      }
    }
  });

  app.engine('hbs', handlebars.engine);
  app.setViewEngine('hbs');

  logger.log(`Application is running on port: ${port}`);
  logger.log(`Swagger documentation available at: http://localhost:${port}/api-docs`);

  await app.listen(port);
}

function registerPartials(partialsPath: string) {
  const logger = new Logger('Partials');

  if (!fs.existsSync(partialsPath)) {
    logger.error(`Partial views folder not found: ${partialsPath}`);
    return;
  }

  const files = fs.readdirSync(partialsPath);

  files.forEach((file) => {
    if (file.endsWith('.hbs')) {
      const partialName = file.replace('.hbs', '');
      const partialPath = join(partialsPath, file);

      hbs.registerPartial(partialName, fs.readFileSync(partialPath, 'utf8'));
      logger.log(`Partial view registered: ${partialName}, ${partialPath}`);
    }
  });
}

bootstrap();