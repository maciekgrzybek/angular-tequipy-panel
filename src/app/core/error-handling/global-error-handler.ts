import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any) {
    console.error('Global error handler caught an error:', error);

    // We should also send the error to a logging service like Rollbar, Sentry etc.
    // this.loggingService.logError(error);
  }
}
