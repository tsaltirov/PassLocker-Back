import { Test, TestingModule } from '@nestjs/testing';
import { PasswordModuleService } from './password-module.service';

describe('PasswordModuleService', () => {
  let service: PasswordModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordModuleService],
    }).compile();

    service = module.get<PasswordModuleService>(PasswordModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
