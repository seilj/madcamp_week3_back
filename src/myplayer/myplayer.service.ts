import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyPlayer } from '../schemas/myplayer.schema';
import { UpdateStatsDto } from './dto/update_stats.dto';
import { MAX, MIN } from './constants';

@Injectable()
export class MyPlayerService {
  constructor(@InjectModel(MyPlayer.name) private myPlayerModel: Model<MyPlayer>) {}

  async findById(id: string): Promise<MyPlayer> {
    const myPlayer = await this.myPlayerModel.findOne({ id }).exec();
    if (!myPlayer) {
      throw new HttpException('MyPlayer not found', HttpStatus.NOT_FOUND);
    }
    return myPlayer;
  }

  async createMyPlayer(myPlayer: MyPlayer): Promise<MyPlayer> {
    const createdMyPlayer = new this.myPlayerModel(myPlayer);
    return createdMyPlayer.save();
  }

  async generateRandomId(): Promise<string> {
    let id: string;
    let exists: boolean;
    do {
      id = Math.random().toString(36).substring(2, 15);
      const result = await this.myPlayerModel.exists({ id });
      exists = !!result; // 존재 여부를 boolean 값으로 변환
    } while (exists);
    return id;
  }

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
