import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ChatModule } from './chat/chat.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // CORS 설정
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000); // 서버 포트 설정

  const chatApp = await NestFactory.create(ChatModule);
  chatApp.enableCors();
  chatApp.useWebSocketAdapter(new IoAdapter(chatApp)); // WebSocket 어댑터 설정
  await chatApp.listen(3001);
}
bootstrap();
