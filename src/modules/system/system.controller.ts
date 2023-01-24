import { Body, Controller, Put } from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import { CommandRequest, CommandResponse } from '../../shared/models/command';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private configService: ConfigService<AppConfig, true>, private readonly systemService: SystemService) {}

  @Put('command')
  public command(@Body() body: CommandRequest): CommandResponse {
    if (this.configService.get<boolean>('customCommandEnabled')) {
      return new CommandResponse(this.systemService.triggerCommand(body.command));
    } else {
      throw new MethodNotAllowedException('Custom commands are not allowed');
    }
  }

  @Put('shutdown')
  public shutdown(): void {
    this.systemService.triggerShutdown();
  }

  @Put('restart')
  public restart(): void {
    this.systemService.triggerRestart();
  }

  @Put('sleep')
  public sleep(): void {
    this.systemService.triggerSleep();
  }
}
