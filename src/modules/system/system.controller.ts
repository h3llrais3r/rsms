import { Body, Controller, Put } from '@nestjs/common';
import { CommandRequest, CommandResponse } from '../../shared/models/command';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Put('command')
  public command(@Body() body: CommandRequest): CommandResponse {
    return new CommandResponse(this.systemService.triggerCommand(body.command));
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
