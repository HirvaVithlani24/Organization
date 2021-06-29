import { NgxLoggerLevel } from 'ngx-logger'

export interface IAppConfig {
    env: {
        name: string;
    };
    logging: {
        debug: boolean,
        serverLoggingUrl: string,
        logLevel: NgxLoggerLevel,
        serverLogLevel: NgxLoggerLevel,
        disableConsoleLogging: boolean
    };
}