import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MyplayerModule } from './myplayer/myplayer.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/userdb'),
    UserModule,
    MyplayerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
