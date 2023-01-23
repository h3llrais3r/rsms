import { platform } from 'node:os';

export class PlatformDetector {
  public detectPlatform(): NodeJS.Platform {
    return platform();
  }

  public isWindows(): boolean {
    return platform() === 'win32';
  }
}
