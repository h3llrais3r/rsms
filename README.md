# RSMS (Remote System Management Service)

A simple rest api service to handle system services remotely.<br>
**Please use with care, as you system becomes vulnerable if an unwanted person gets access to this api!**

## Installation

```bash
$ npm install
```

## Configuration

The default settings can be found in the `app.config.ts` file.<br>
If you want to override any of these settings, you can create the `.env` file and override the setting here.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Implemented services

### <ins>Windows</ins>

- system shutdown
- system restart
- system sleep (attention: hibernate by default, unless you disable it by running `powercfg /hibernate off` with administrative rights on your system)

### <ins>Linux</ins>

- system shutdown
- system restart
- system sleep

### <ins>Custom</ins>

The custom command api has been disabled by default to prevent you from destroying your system.<br>
If you know what you are doing, and you accept the security risk, you can enable it by setting the `ENABLE_CUSTOM_COMMAND=true` property in the `.env` file.<br>
Be aware that as of now, every command can be executed on your system via the api!<br>

## License

RSMS (Remote System Management Service) is [MIT licensed](LICENSE.md).
