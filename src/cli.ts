
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './core/app.module';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log']
  });
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
}
bootstrap();