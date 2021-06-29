import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from '../logger/logger.service';
import { ErrorService } from '../error/error.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse) {
        const errorSvc = this.injector.get(ErrorService);
        const loggerSvc = this.injector.get(LoggingService);
        const notificationSvc = this.injector.get(NotificationService);

        let message;
        let stackTrace;

        if (error instanceof HttpErrorResponse) {
            message = errorSvc.getServerErrorMessage(error);
            notificationSvc.showErrorMessage(message);
        }
        else {
            message = errorSvc.getClientErrorMessage(error);
            notificationSvc.showErrorMessage(message);
        }

        loggerSvc.sendErrorLevelMessage(message, stackTrace, error);
    }
}