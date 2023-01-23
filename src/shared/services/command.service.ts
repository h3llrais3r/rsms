import { Injectable, Logger } from '@nestjs/common';
import { CommandName, Win32Command } from '../models/command';
import { CommandExecutor } from '../utils/command-executor';

@Injectable()
export class CommandService {
  private logger: Logger;
  private commandExecutor: CommandExecutor;

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this.commandExecutor = new CommandExecutor();
  }

  // Generic command
  public executeCommand(command: string): string {
    if (command) {
      return this.commandExecutor.executeCommand(command);
    } else {
      throw new Error('No command specified');
    }
  }

  // Platform specific command
  public executePlatformCommand(platform: NodeJS.Platform, commandName: CommandName, options?: string[]): string {
    if (platform === 'win32') {
      const win32Command = Win32Command.fromName(commandName);
      return this.commandExecutor.executeCommand(win32Command.command, options);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
