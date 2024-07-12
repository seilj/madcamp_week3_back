import { Module } from '@nestjs/common';
import { MyplayerController } from './myplayer.controller';
import { MyplayerService } from './myplayer.service';

@Module({
  controllers: [MyplayerController],
  providers: [MyplayerService]
})
export class MyplayerModule {}
