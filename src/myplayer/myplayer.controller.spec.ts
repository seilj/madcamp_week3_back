import { Test, TestingModule } from '@nestjs/testing';
import { MyplayerController } from './myplayer.controller';

describe('MyplayerController', () => {
  let controller: MyplayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyplayerController],
    }).compile();

    controller = module.get<MyplayerController>(MyplayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
