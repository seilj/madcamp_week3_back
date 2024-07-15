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
    MongooseModule.forRoot('mongodb+srv://yjbigbrr:youha0227@cluster0.zh6wdf9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    UserModule,
    MeetingsModule,
    HttpModule, // HttpModule 추가
    MyPlayerModule, MatchModule,
  ],
  controllers: [AppController],
  providers: [AppService, MeetingsGateway], // MeetingsGateway 추가
})
export class AppModule {}
