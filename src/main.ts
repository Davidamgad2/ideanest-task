import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const host = configService.get<string>('APP_HOST') || '0.0.0.0';
  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port, host);
}
bootstrap();
