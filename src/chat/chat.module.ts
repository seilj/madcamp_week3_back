import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
