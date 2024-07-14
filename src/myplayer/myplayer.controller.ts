import { Controller, Put, Param, Body, Get, Post } from '@nestjs/common';
import { MyPlayerService } from './myplayer.service';
import { MyPlayer } from '../schemas/myplayer.schema';
import { UpdateStatsDto } from './dto/update_stats.dto';

@Controller('myplayers')
export class MyPlayerController {
  constructor(private readonly myPlayerService: MyPlayerService) {}

  @Get(':id')
  async getMyPlayerById(@Param('id') id: string): Promise<MyPlayer> {
    return this.myPlayerService.findById(id);
  }

  @Post()
  async createMyPlayer(@Body() myPlayer: MyPlayer): Promise<MyPlayer> {
    return this.myPlayerService.createMyPlayer(myPlayer);
  }

  @Put(':id/stats')
  updateStats(@Param('id') id: string, @Body() updateStatsDto: UpdateStatsDto) {
    return this.myPlayerService.updateStats(id, updateStatsDto);
  }
}
