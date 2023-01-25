import { Injectable, Logger } from '@nestjs/common';
import { CommandName } from '../../shared/models/command';
import { CommandService } from '../../shared/services/command.service';
import { PlatformDetector } from '../../shared/utils/platform-detector';

@Injectable()
export class SystemService {
  private logger: Logger;
  private platform: NodeJS.Platform;

  constructor(private readonly commandService: CommandService) {
    this.logger = new Logger(this.constructor.name);
    this.platform = new PlatformDetector().detectPlatform();
  }

  triggerCommand(command: string): string {
    this.logger.log('Triggering system command...');
    return this.commandService.executeCommand(command);
  }

  triggerCommandAsync(command: string): void {
    this.logger.log('Triggering async system command...');
    this.commandService.executeCommandAsync(command);
  }

  triggerShutdown(): void {
    this.logger.log('Triggering system shutdown...');
    // Always in async mode as we don't get feedback from the command in time
    this.commandService.executePlatformCommandAsync(this.platform, CommandName.SHUTDOWN);
  }

  triggerRestart(): void {
    this.logger.log('Triggering system restart...');
    // Always in async mode as we don't get feedback from the command in time
    this.commandService.executePlatformCommandAsync(this.platform, CommandName.RESTART);
  }

  triggerSleep(): void {
    this.logger.log('Triggering system sleep...');
    // Always in async mode as we don't get feedback from the command in time
    this.commandService.executePlatformCommandAsync(this.platform, CommandName.SLEEP);
  }
}
