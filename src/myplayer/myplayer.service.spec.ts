import { Test, TestingModule } from '@nestjs/testing';
import { MyPlayerService } from './myplayer.service';

describe('MyplayerService', () => {
  let service: MyPlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyPlayerService],
    }).compile();

    service = module.get<MyPlayerService>(MyPlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
