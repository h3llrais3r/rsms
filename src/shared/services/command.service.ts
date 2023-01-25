import { Injectable, InternalServerErrorException, Logger, NotImplementedException } from '@nestjs/common';
import { CommandName, LinuxCommand, Win32Command } from '../models/command';
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

  public executeCommand(command: string, options?: string[]): string {
    try {
      return this.commandExecutor.executeCommand(command, options);
    } catch (err) {
      throw new InternalServerErrorException(`Error while executing command: ${command}`);
    }
  }

  public executeCommandAsync(command: string, options?: string[]): void {
    this.commandExecutor.executeCommandAsync(command, options);
  }

  // Platform specific command

  public executePlatformCommand(platform: NodeJS.Platform, commandName: CommandName, options?: string[]): string {
    if (platform === 'win32') {
      const win32Command = Win32Command.fromName(commandName);
      return this.executeCommand(win32Command.command, options);
    } else if (platform === 'linux') {
      const linuxCommand = LinuxCommand.fromName(commandName);
      return this.executeCommand(linuxCommand.command, options);
    } else {
      throw new NotImplementedException(`Unsupported platform: ${platform}`);
    }
  }

  public executePlatformCommandAsync(platform: NodeJS.Platform, commandName: CommandName, options?: string[]): void {
    if (platform === 'win32') {
      const win32Command = Win32Command.fromName(commandName);
      this.executeCommandAsync(win32Command.command, options);
    } else if (platform === 'linux') {
      const linuxCommand = LinuxCommand.fromName(commandName);
      this.executeCommandAsync(linuxCommand.command, options);
    } else {
      throw new NotImplementedException(`Unsupported platform: ${platform}`);
    }
  }
}
