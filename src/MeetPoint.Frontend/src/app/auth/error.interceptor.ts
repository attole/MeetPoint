import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('INTER', req);

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('ITERCEPTOR ERROR:', { REQUEST: req, ERROR: err });
        if (err.status === 401) {
          inject(AuthService).logout();
          console.log('INTERCEPTOR ERROR - 401 - LOGOUT');
        }
        return throwError(() => err);
      })
    );
  }
}
