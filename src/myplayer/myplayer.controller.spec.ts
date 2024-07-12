import { Test, TestingModule } from '@nestjs/testing';
import { MyPlayerController } from './myplayer.controller';

describe('MyplayerController', () => {
  let controller: MyPlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyPlayerController],
    }).compile();

    controller = module.get<MyPlayerController>(MyPlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
