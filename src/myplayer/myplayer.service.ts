import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyPlayer } from '../schemas/myplayer.schema';
import { UpdateStatsDto } from './dto/update_stats.dto';
import { MAX, MIN } from './constants';

@Injectable()
export class MyPlayerService {
  constructor(@InjectModel(MyPlayer.name) private myPlayerModel: Model<MyPlayer>) {}

  async updateStats(id: string, updateStatsDto: UpdateStatsDto): Promise<MyPlayer> {
    const player = await this.myPlayerModel.findById(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    Object.keys(updateStatsDto).forEach((key) => {
      player[key] += updateStatsDto[key];
      if (player[key] > MAX) player[key] = MAX;
    });

    return player.save();
  }
}
