import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class CommandRequest {
  @IsDefined()
  @IsString()
  public command: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => ['true', true].includes(value)) // See https://github.com/typestack/class-transformer/issues/550
  public async?: boolean; // if true, the command is launched without waiting for completion and result
}

export class CommandResponse {
  public command: string;
  public output: string;

  constructor(command: string, output: string) {
    this.command = command;
    this.output = output;
  }
}

export enum CommandName {
  SHUTDOWN = 'shutdown',
  RESTART = 'restart',
  SLEEP = 'sleep'
}

export class PlatformCommand {
  public name: CommandName;
  public command: string;
  public options?: string[];

  constructor(name: CommandName, command: string, options?: string[]) {
    this.name = name;
    this.command = command;
    this.options = options;
  }

  // Helper to get the full command with options
  get commandWithOptions(): string {
    if (this.options) {
      return [this.command].concat(this.options).join(' ');
    } else {
      return this.command;
    }
  }

  // Helper to add options on the PlatformCommand
  public withOptions(options?: string[]): PlatformCommand {
    this.options = options;
    return this;
  }
}

export class Win32Command extends PlatformCommand {
  // Keep at first line to be sure it's initialized before the different commands
  private static values: Win32Command[] = [];

  // All commands imply no timeout
  public static SHUTDOWN = new Win32Command(CommandName.SHUTDOWN, 'shutdown.exe /s /t 0');
  public static RESTART = new Win32Command(CommandName.RESTART, 'shutdown.exe /r /t 0');
  public static SLEEP = new Win32Command(CommandName.SLEEP, 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0');

  constructor(name: CommandName, command: string) {
    super(name, command);
    Win32Command.values.push(this);
  }

  // Helper to find the correct command based on the command name
  public static fromName(name: CommandName): Win32Command {
    for (const cmd of Win32Command.values) {
      if (cmd.name === name) {
        return cmd;
      }
    }
    throw new Error(`Unsupported command name: ${name}`);
  }
}

// Requires the windows sysinternals commands being added to you path!
// See https://learn.microsoft.com/en-gb/sysinternals/downloads/
export class Win32SysInternalsCommand extends PlatformCommand {
  // Keep at first line to be sure it's initialized before the different commands
  private static values: Win32SysInternalsCommand[] = [];

  // All commands imply no timeout
  public static SHUTDOWN = new Win32SysInternalsCommand(CommandName.SHUTDOWN, 'psshutdown.exe -s -t 0');
  public static RESTART = new Win32SysInternalsCommand(CommandName.RESTART, 'psshutdown.exe -r -t 0');
  public static SLEEP = new Win32SysInternalsCommand(CommandName.SLEEP, 'psshutdown -d -t 0');

  constructor(name: CommandName, command: string) {
    super(name, command);
    Win32SysInternalsCommand.values.push(this);
  }

  // Helper to find the correct command based on the command name
  public static fromName(name: CommandName): Win32SysInternalsCommand {
    for (const cmd of Win32SysInternalsCommand.values) {
      if (cmd.name === name) {
        return cmd;
      }
    }
    throw new Error(`Unsupported command name: ${name}`);
  }
}

export class LinuxCommand extends PlatformCommand {
  // Keep at first line to be sure it's initialized before the different commands
  private static values: LinuxCommand[] = [];

  // All commands imply no timeout
  public static SHUTDOWN = new LinuxCommand(CommandName.SHUTDOWN, 'sudo shutdown -h 0');
  public static RESTART = new LinuxCommand(CommandName.RESTART, 'sudo shutdown -r 0');
  public static SLEEP = new LinuxCommand(CommandName.SLEEP, 'sudo systemctl suspend');

  constructor(name: CommandName, command: string) {
    super(name, command);
    LinuxCommand.values.push(this);
  }

  // Helper to find the correct command based on the command name
  public static fromName(name: CommandName): LinuxCommand {
    for (const cmd of LinuxCommand.values) {
      if (cmd.name === name) {
        return cmd;
      }
    }
    throw new Error(`Unsupported command name: ${name}`);
  }
}
