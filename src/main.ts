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

  app.enableCors({
    origin: (origin, callback) => {
      // Check if the origin is either localhost:3000 or matches the regex for golden-owl
      if (typeof origin === 'undefined' || origin === 'http://localhost:3000') {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE', // Allow specific HTTP methods (optional)
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers (optional)
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
