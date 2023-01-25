import { Logger } from '@nestjs/common';
import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';

export class CommandExecutor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  public executeCommand(command: string, options?: string[]): string {
    try {
      const output = execSync(this.createFullCommand(command, options), { encoding: 'utf8' });
      this.logCommandOutput(output);
      return output;
    } catch (err) {
      this.logCommandError(err);
      throw err;
    }
  }

  public executeCommandAsync(command: string, options?: string[]): void {
    // Don't return the promise as we don't want to block the api until the response is returned
    promisify(exec)(this.createFullCommand(command, options))
      .then((output) => this.logCommandOutput(output))
      .catch((error) => this.logCommandError(error));
  }

  private createFullCommand(command: string, options?: string[]): string {
    // Create the full command with the options (if specified)
    let commandList = [command];
    commandList = options ? commandList.concat(options) : commandList;
    const cmd = commandList.join(' ');
    this.logger.log(`Command: ${cmd}`);
    return cmd;
  }

  private logCommandOutput(output: string | { stdout: string; stderr: string }): void {
    let debugOutput = `Output:\n${'#'.repeat(58)}`;
    if (output) {
      if (typeof output === 'string') {
        debugOutput = `${debugOutput}\n${output}`.trimEnd();
      } else {
        if (output.stdout) {
          debugOutput = `${debugOutput}\nstdout:\n${output.stdout}`.trimEnd();
        }
        if (output.stderr) {
          debugOutput = `${debugOutput}\nstderr:\n${output.stdout}`.trimEnd();
        }
      }
    }
    debugOutput = `${debugOutput}\n${'#'.repeat(58)}`;
    this.logger.debug(debugOutput);
  }

  private logCommandError(error: any): void {
    let debugOutput = `Error:\n${'#'.repeat(57)}`;
    if (error) {
      debugOutput = `${debugOutput}\n${error}`.trimEnd();
    }
    debugOutput = `${debugOutput}\n${'#'.repeat(57)}`;
    this.logger.debug(debugOutput);
  }
}
