import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE', // Allow specific HTTP methods (optional)
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers (optional)
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
