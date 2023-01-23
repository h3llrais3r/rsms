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

  triggerShutdown(options?: string[]): void {
    this.logger.log('Triggering system shutdown...');
    this.commandService.executePlatformCommand(this.platform, CommandName.SHUTDOWN, options);
  }

  triggerRestart(options?: string[]): void {
    this.logger.log('Triggering system restart...');
    this.commandService.executePlatformCommand(this.platform, CommandName.RESTART, options);
  }

  triggerSleep(options?: string[]): void {
    this.logger.log('Triggering system sleep...');
    this.commandService.executePlatformCommand(this.platform, CommandName.SLEEP, options);
  }
}
