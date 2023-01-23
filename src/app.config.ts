export class AppConfig {
  PORT: number;
  BASEPATH: string;
  LOGLEVEL: string;
  CUSTOM_COMMANDS_ENABLED: boolean;
}

export function configFactory() {
  // If we provide a default value for all, we can use the ConfigService with the validated flag (ConfigService<AppConfig, true>)
  // If not, we need to remove the 'true' flag and use getOrThrow() to get the values
  const config: AppConfig = {
    PORT: parseInt(process.env.PORT as string, 10) || 3000,
    BASEPATH: process.env.BASEPATH || 'api',
    LOGLEVEL: process.env.LOGLEVEL || 'info',
    CUSTOM_COMMANDS_ENABLED: process.env.CUSTOM_COMMANDS_ENABLED === 'true' || false // only allow 'true' value as true
  };
  return config;
}
