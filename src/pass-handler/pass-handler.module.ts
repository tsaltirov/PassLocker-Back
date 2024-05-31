import { Module } from '@nestjs/common';
import { PasswordModuleService } from './password-module.service';
import { PassHandlerController } from './pass-handler.controller';

@Module({
  controllers: [PassHandlerController],
  providers: [PasswordModuleService],
})
export class PasswordModuleModule {}
