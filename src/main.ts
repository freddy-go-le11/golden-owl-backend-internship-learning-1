import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // Retrieve and split multiple CORS regex patterns from the environment variable
  const corsWhitelistRegexes = process.env.CORS_WHITELIST_REGEX
    ? process.env.CORS_WHITELIST_REGEX.split(',').map(
        (pattern) => new RegExp(pattern),
      )
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsWhitelistRegexes.some((regex) => regex.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
