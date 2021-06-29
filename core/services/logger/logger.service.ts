import { Injectable } from '@angular/core';
import { NGXLogger, NGXLoggerMonitor, NGXLogInterface, NgxLoggerLevel } from 'ngx-logger';
import { AppConfigService } from '../appConfig/appConfig.service';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  env: string;
  canDebug: boolean;

  constructor(private logger: NGXLogger) {
    // TRACE|DEBUG|INFO|LOG|WARN|ERROR|FATAL|OFF
    this.env = AppConfigService.settings.env.name;
    this.canDebug = AppConfigService.settings.logging.debug;
    console.log(
      'This environment ',
      this.env,
      ' debugging enabled ',
      this.canDebug
    );

    this.logger.updateConfig({
      serverLoggingUrl: AppConfigService.settings.logging.serverLoggingUrl,
      level: (<any>NgxLoggerLevel)[AppConfigService.settings.logging.logLevel],
      serverLogLevel: (<any>NgxLoggerLevel)[AppConfigService.settings.logging.serverLogLevel],
      disableConsoleLogging: AppConfigService.settings.logging.disableConsoleLogging
    });
  }

  // very detailed tracing
  sendTraceLevelMessage(message: any, source: any, error: any) {
    this.logger.trace(message, source, error);
  }

  // Relatively detailed tracing used by application developers
  sendDebugLevelMessage(message: any, source: any, error: any) {
    this.logger.debug(message, source, error);
  }

  // Informational messages that might make sense to end users and system administrators, and highlight the progress of the application
  sendInfoLevelMessage(message: any) {
    this.logger.info(message);
  }

  // Along with INFO level, these are more informational
  sendLogLevelMessage(message: any, source: any, error: any) {
    this.logger.log(message, source, error);
  }

  // Potentially harmful situations of interest to end users or system managers
  sendWarnLevelMessage(message: any, error: any) {
    this.logger.warn(message, error);
  }

  // Error events of considerable importance that will prevent normal program execution, but might still allow the application to continue running.
  sendErrorLevelMessage(message: any, source: any, error: any) {
    this.logger.error(message, source, error);
  }

  // Very severe error events that might cause the application to terminate.
  sendFatalLevelMessage(message: any, source: any, error: any) {
    this.logger.fatal(message, source, error);
  }
}

export class MyLoggerMonitor implements NGXLoggerMonitor {
  onLog(logObject: NGXLogInterface): void {
    console.log('logging stuff to an API', logObject);
  }
}
