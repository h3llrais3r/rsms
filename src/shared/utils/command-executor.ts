import { Logger } from '@nestjs/common';
import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { CommandOutput } from '../models/command';

export class CommandExecutor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  public executeCommand(command: string, options?: string[]): string {
    const output = execSync(this.createFullCommand(command, options), { encoding: 'utf8' });
    this.logger.debug(`Output:\n${'#'.repeat(60)}\n${output}\n${'#'.repeat(60)}`);
    return output;
  }

  public async executeCommandAsync(command: string, options?: string[]): Promise<CommandOutput> {
    return promisify(exec)(this.createFullCommand(command, options));
  }

  private createFullCommand(command: string, options?: string[]): string {
    // Create the full command with the options (if specified)
    let commandList = [command];
    commandList = options ? commandList.concat(options) : commandList;
    const cmd = commandList.join(' ');
    this.logger.log(`Command: ${cmd}`);
    return cmd;
  }
}
