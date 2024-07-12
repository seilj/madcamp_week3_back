import { Test, TestingModule } from '@nestjs/testing';
import { MyplayerService } from './myplayer.service';

describe('MyplayerService', () => {
  let service: MyplayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyplayerService],
    }).compile();

    service = module.get<MyplayerService>(MyplayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
