import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // CORS 설정
  app.useWebSocketAdapter(new IoAdapter(app)); // WebSocket 어댑터 설정
  await app.listen(3000); // 서버 포트 설정
}
bootstrap();
