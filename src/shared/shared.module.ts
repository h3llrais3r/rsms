import { Logger, Module } from '@nestjs/common';
import { CommandService } from './services/command.service';

@Module({
  imports: [],
  providers: [Logger, CommandService],
  exports: [Logger, CommandService]
})
export class SharedModule {}
