import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor() {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		var isTranslationRequest = false;
		try {
			new URL(request.url);
		} catch (err) {
			isTranslationRequest = true;
		}

		if (!window.navigator.onLine && !isTranslationRequest) {
			// if there is no internet, throw a HttpErrorResponse error
			// since an error is thrown, the function will terminate here
			let errorMessage = 'No internet';
            // this.snackBarService.showErrorMessage(errorMessage);

			return Observable.throw(new HttpErrorResponse({ error: errorMessage }));
		} else {
			if (!isTranslationRequest) {

			}

			return next.handle(request).pipe(
				retry(2),
				catchError((error: HttpErrorResponse) => {
					let errorMessage = '';
					if (error.error instanceof ErrorEvent) {
						// client-side error
						errorMessage = `${error.error.message}`;
					} else {
						// server-side error
						errorMessage = `${error.error.error.message}`;
					}
                    // this.snackBarService.showErrorMessage(errorMessage);
					return throwError(errorMessage);
				})
			);
		}
	}
}
