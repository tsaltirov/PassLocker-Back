import { Module } from '@nestjs/common';
import { PassHandlerController } from './pass-handler.controller';
import { PassHandlerService } from './pass-handler.service';

@Module({
  controllers: [PassHandlerController],
  providers: [PassHandlerService],
})
export class PasswordModuleModule {}
