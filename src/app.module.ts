import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MyPlayerModule } from './myplayer/myplayer.module';
import { MeetingsModule } from './meetings/meetings.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/userdb'),
    UserModule,
    MyPlayerModule,
    MeetingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
