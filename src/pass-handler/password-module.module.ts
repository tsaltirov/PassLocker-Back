import { Module } from '@nestjs/common';
import { PasswordModuleService } from './password-module.service';
import { PasswordModuleController } from './password-module.controller';

@Module({
  controllers: [PasswordModuleController],
  providers: [PasswordModuleService],
})
export class PasswordModuleModule {}
