import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    private static ERROR_HASH: any = {
        '400': 'The request is not proper',
        '401': 'Authentication failed - could not decode JWT token',
        '403': 'No Permission to Access',
        '404': 'The request is not proper',
        '405': 'The method is not allowed for the requested URL',
        '500': 'Server responded with error Retry again later',
        '501': 'Server responded with error Retry again later',
        '502': 'The server encountered a temporary error and could not complete your request',
        '504': 'Gateway Timeout, try again later',
        'GENERIC': 'There was a problem fetching results, please try again'
    };

    constructor() {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
              if (err instanceof HttpErrorResponse) {
                return this.handleError(err);
              }
            })
          );
      }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('Inside Interceptor', error);
        const formError: any = {
            status: error.status
        };
        formError['message'] = InterceptorService.ERROR_HASH['GENERIC'];
        return throwError(formError);
    }

}
