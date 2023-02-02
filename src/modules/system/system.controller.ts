import { Body, Controller, Put } from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.config';
import { CommandRequest, CommandResponse } from '../../shared/models/command';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private configService: ConfigService<AppConfig, true>, private readonly systemService: SystemService) {}

  @Put('command')
  public async commandAsync(@Body() body: CommandRequest): Promise<CommandResponse | void> {
    if (this.configService.get<boolean>('customCommandEnabled')) {
      if (body.async) {
        return this.systemService.triggerCommandAsync(body.command);
      } else {
        return new CommandResponse(body.command, this.systemService.triggerCommand(body.command));
      }
    } else {
      throw new MethodNotAllowedException('Custom commands are not allowed');
    }
  }

  @Put('shutdown')
  public async shutdown(): Promise<void> {
    return this.systemService.triggerShutdown();
  }

  @Put('restart')
  public async restart(): Promise<void> {
    return this.systemService.triggerRestart();
  }

  @Put('sleep')
  public async sleep(): Promise<void> {
    return this.systemService.triggerSleep();
  }
}
