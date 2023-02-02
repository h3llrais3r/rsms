import { Injectable, InternalServerErrorException, Logger, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.config';
import { CommandName, LinuxCommand, Win32Command, Win32SysInternalsCommand } from '../models/command';
import { CommandExecutor } from '../utils/command-executor';

@Injectable()
export class CommandService {
  private logger: Logger;
  private commandExecutor: CommandExecutor;

  constructor(private configService: ConfigService<AppConfig, true>) {
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
      const win32Command = this.getWin32Command(commandName);
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
      const win32Command = this.getWin32Command(commandName);
      this.executeCommandAsync(win32Command.command, options);
    } else if (platform === 'linux') {
      const linuxCommand = LinuxCommand.fromName(commandName);
      this.executeCommandAsync(linuxCommand.command, options);
    } else {
      throw new NotImplementedException(`Unsupported platform: ${platform}`);
    }
  }

  private getWin32Command(commandName: CommandName): Win32Command | Win32SysInternalsCommand {
    let win32Command: Win32Command | Win32SysInternalsCommand;
    if (this.configService.get('win32SysInternalsEnabled')) {
      win32Command = Win32SysInternalsCommand.fromName(commandName);
    } else {
      win32Command = Win32Command.fromName(commandName);
    }
    return win32Command;
  }
}
