import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [SharedModule],
  controllers: [SystemController],
  providers: [SystemService]
})
export class SystemModule {}
