export class AppConfig {
  port: number;
  basePath: string;
  logLevel: string;

  constructor(obj: AppConfig) {
    Object.assign(this, obj);
  }
}

export function configFactory() {
  return new AppConfig({
    port: parseInt(process.env.PORT as string, 10) || 3000,
    basePath: process.env.BASEPATH || 'api',
    logLevel: process.env.LOGLEVEL || 'info'
  });
}
