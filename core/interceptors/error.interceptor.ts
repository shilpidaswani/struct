import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { SessionService } from 'src/app/core/session/session.service';
// import { SnackBarService } from 'src/app/shared/common/services/snack-bar.service';
import { AppLocalStorage } from 'src/app/utility/local-storage.util';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private sessionService: SessionService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const me = this;
        return next.handle(request).pipe(

            catchError(err => {
                if (err.status == 500) {

                    AppLocalStorage.clear('SESSION', 'SESSION');
                    if(AppLocalStorage.get('SESSION', 'DEEPLINKCODE')){
                        AppLocalStorage.clear('SESSION', 'DEEPLINKCODE');
                        }

                    if(!AppLocalStorage.get('SESSION', 'SESSION')){
                        
                        let apiTimeOut;
                    if (apiTimeOut) {
                        clearTimeout(apiTimeOut);
                    }
                    apiTimeOut = setTimeout(() => {
                        // me.snackBarService.openSnackBar("internal server error", 3000);
                        window.location.href = '/login'
                    }, 1000);
                        
                    }
                    
                } else if (err.status == 403) {

                    AppLocalStorage.clear('SESSION', 'SESSION');
                    if(AppLocalStorage.get('SESSION', 'DEEPLINKCODE')){
                    AppLocalStorage.clear('SESSION', 'DEEPLINKCODE');
                    }

                    if(!AppLocalStorage.get('SESSION', 'SESSION')){
                        
                        let apiTimeOut;
                    if (apiTimeOut) {
                        clearTimeout(apiTimeOut);
                    }
                    apiTimeOut = setTimeout(() => {
                        // me.snackBarService.openSnackBar("your session has expired please login again", 3000);
                        window.location.href = '/login'

                    }, 1000);
                        
                    }

                }
                const error = err;
                return throwError(error);
            })
        )
    }
}