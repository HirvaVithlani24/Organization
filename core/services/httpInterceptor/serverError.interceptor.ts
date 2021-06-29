import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            // retry(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}