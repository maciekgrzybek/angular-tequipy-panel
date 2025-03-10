import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        errorMessage = `Server Error: ${error.status} - ${
          error.statusText || ''
        } - ${error.error?.message || ''}`;
      }
      console.error(errorMessage);

      return throwError(() => error);
    })
  );
};
