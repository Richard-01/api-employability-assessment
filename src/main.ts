import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/env.validation';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = envs.port || 3000;
  await app.listen(port);
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST',
    allowedHeaders: 'Content-Type, Accept',
  });

  const logger = new Logger('RunningPort');
  logger.log(`Server running on port ${port}`);
}
bootstrap();