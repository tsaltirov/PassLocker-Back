import { Test, TestingModule } from '@nestjs/testing';
import { PasswordModuleController } from './password-module.controller';
import { PasswordModuleService } from './password-module.service';

describe('PasswordModuleController', () => {
  let controller: PasswordModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordModuleController],
      providers: [PasswordModuleService],
    }).compile();

    controller = module.get<PasswordModuleController>(PasswordModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
