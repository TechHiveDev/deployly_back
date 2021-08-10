import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ValidationPipe } from "@nestjs/common";
require('dotenv').config({
  path: __dirname+'/../.env'
})
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRON_HOST
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}
bootstrap();
