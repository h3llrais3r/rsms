export class CommandRequest {
  public command: string;
  public encoding?: string;
}

export class CommandResponse {
  public output: string;

  constructor(output: string) {
    this.output = output;
  }
}

export class CommandOutput {
  public stdout: string;
  public stderr: string;
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

  public static SHUTDOWN = new Win32Command(CommandName.SHUTDOWN, 'shutdown.exe /s');
  public static RESTART = new Win32Command(CommandName.RESTART, 'shutdown.exe /r');
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
