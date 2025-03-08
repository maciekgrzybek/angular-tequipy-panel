import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Log the error to the console
    console.error('Global error handler caught an error:', error);

    // You could also send the error to a logging service
    // this.loggingService.logError(error);

    // You could also show a user-friendly notification
    // this.notificationService.showError('An error occurred. Please try again later.');
  }
}
