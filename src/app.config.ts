export class AppConfig {
  port: number;
  globalPrefix: string;
  logLevel: string;
  customCommandEnabled: boolean;
}

export function configFactory() {
  // If we provide a default value for all, we can use the ConfigService with the validated flag (ConfigService<AppConfig, true>)
  // If not, we need to remove the 'true' flag and use getOrThrow() to get the values
  // REMARK: do not use the same name as the process.env.XXX variable, as it will otherwise always return the value from the variable
  // To avoid this, we make camelCase versions of the variables and use those to fetch the values
  // This will also make sure that it return in the proper type (f.e. boolean)
  const config: AppConfig = {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    globalPrefix: process.env.GLOBALPREFIX || 'api',
    logLevel: process.env.LOGLEVEL || 'info',
    customCommandEnabled: process.env.CUSTOM_COMMAND_ENABLED === 'true' || false // only allow 'true' value as true
  };
  return config;
}
