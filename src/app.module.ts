import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MyPlayerModule } from './myplayer/myplayer.module';
import { MeetingsModule } from './meetings/meetings.module';
import { HttpModule } from '@nestjs/axios';
import { MeetingsGateway } from './meetings/meetings.gateway';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/userdb'),
    UserModule,
    MeetingsModule,
    HttpModule, // HttpModule 추가
    MyPlayerModule, 
    MatchModule,
  ],
  controllers: [AppController],
  providers: [AppService, MeetingsGateway], // MeetingsGateway 추가
})
export class AppModule {}
