import { Test, TestingModule } from '@nestjs/testing';
import { PassHandlerController } from './pass-handler.controller';
import { PasswordModuleService } from './password-module.service';

describe('PassHandlerController', () => {
  let controller: PassHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassHandlerController],
      providers: [PasswordModuleService],
    }).compile();

    controller = module.get<PassHandlerController>(PassHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
