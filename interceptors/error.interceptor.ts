import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import EndPoints from "src/common/constants/EndPoints";
import constants from "src/common/constants/constants";
import { LoaderService } from "src/services/loader.service";
import { CoreService } from "src/services/core.service";
import { ToastService } from "src/services/toast.service";
import { AuthenticationService } from "src/providers/authentication/authentication.service";
import { LogoutService } from "src/providers/logout/logout.service";
import { Route, Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  ipAddress;
  //constant:constants;
  constructor(
    private loader: LoaderService,
    private core: CoreService,
    private toast: ToastService,
    private authService: AuthenticationService,
    private logoutService: LogoutService,
    private router: Router
  ) {}

  /***
   * description: http intercepter to handle API errors
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log("in error interceptor");
        let BASE_URL = environment.base_url;
        let signupUrl = EndPoints.SIGNUP;
        const signupURL = `${BASE_URL + "" + signupUrl}`;

        this.loader.dismissLoader();
        //if (err.status === 401 || err.status === 403 || err.status === 0) {
        console.log(err);
        if (err.status == 401) {
          const token = localStorage.getItem(constants.ACCESS_TOKEN);

          if (
            this.authService.getTokenExpiryTime(token) &&
            !this.authService.getTokenExpiryTime(
              localStorage.getItem(constants.REFRESH_TOKEN)
            )
          ) {
            console.log("Refresh Token not expired");
            this.authService.refreshToken(token);
          } else {
            console.log("refreshToken Expired");
            // this.authService.refreshToken(token);
            let payload = {
              refreshToken: localStorage.getItem(constants.REFRESH_TOKEN),
              userId: localStorage.getItem(constants.USER_ID),
            };
            this.logoutService.logout(payload);
            localStorage.clear();
            this.router.navigate(["/"], { replaceUrl: true });
          }
        } else if (err.status === 404) {
          // this.toast.showToastMessage(
          //     constants.API_ERROR,
          //     constants.TOAST_ERROR
          // );
        } else if (err.status == 400) {
          // this.toast.showToastMessage(err.error.message, constants.TOAST_ERROR);
        } else {
          console.log(err);
          // this.toast.showToastMessage(err.error.message, constants.TOAST_ERROR);
        }
        return throwError(err);
      })
    );
  }
}
