import { Controller, Put, Param, Body } from '@nestjs/common';
import { MyPlayerService } from './myplayer.service';
import { UpdateStatsDto } from './dto/update_stats.dto';

@Controller('myplayer')
export class MyPlayerController {
  constructor(private readonly myPlayerService: MyPlayerService) {}

  @Put(':id/stats')
  updateStats(@Param('id') id: string, @Body() updateStatsDto: UpdateStatsDto) {
    return this.myPlayerService.updateStats(id, updateStatsDto);
  }
}
