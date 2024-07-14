import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MyPlayerModule } from './myplayer/myplayer.module';
import { MeetingsModule } from './meetings/meetings.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/userdb'),
    UserModule,
    MeetingsModule,
    HttpModule, // HttpModule 추가
    MyPlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}