import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyPlayerController } from './myplayer.controller';
import { MyPlayerService } from './myplayer.service';
import { MyPlayer, MyPlayerSchema } from 'src/schemas/myplayer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MyPlayer.name, schema: MyPlayerSchema }])
  ],
  controllers: [MyPlayerController],
  providers: [MyPlayerService],
  exports: [MyPlayerService],
})
export class MyPlayerModule {}
