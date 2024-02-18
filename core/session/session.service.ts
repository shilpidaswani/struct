// import { CometChatCustomService } from "./../../pages/comet-chat/service/comet-chat.service";

// import { SnackBarService } from "src/app/shared/common/services/snack-bar.service";
// import { MyNotificationService } from "src/app/pages/notifications/service/my-notification.service";
// import { SignupService } from "./../../pages/signup/service/signup.service";
import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import * as moment from "moment";
// import { NgxPermissionsObject, NgxPermissionsService } from "ngx-permissions";
import { BehaviorSubject, Observable, Subject } from "rxjs";
// import { CustomUtilityService } from "src/app/shared/common/services/custom-utility.service";
import { Subscriptions } from "src/app/utility/common.model";
import { IDGenerator } from "src/app/utility/id-generator.util";
import { AppLocalStorage } from "src/app/utility/local-storage.util";
import { environment } from "src/environments/environment";
import { AppError } from "../error/error.model";
import { Store } from "../store/store";
import {
  AuthTokenResponse,
  LoginCredentials,
  LogoutResponse,
  Session,
  SessionAccountResponse,
} from "./session.model";
import {
  SessionCreatingErrorState,
  SessionCreatingState,
  LogoutLoadingState,
  LogoutLoadedState,
  LogoutErrorState,
  SignupLoginLoadingState,
  SignupLoginLoadedState,
  SignupLoginErrorState,
} from "./session.state";
import { PRO_ADMIN, PRO_USER } from "./session.data";
import { AuthenticationService } from "src/providers/authentication/authentication.service";
import constants from "src/common/constants/constants";
import { LogoutService } from "src/providers/logout/logout.service";
import { ToastService } from "src/services/toast.service";
// import { MyNotificationPayload } from "src/app/pages/notifications/service/my-notification.model";
// import { CometChat } from "@cometchat-pro/chat";
// import { PushNotificationService } from "src/app/shared/push-notification/push-notification.service";
// import { MixpanelService } from "src/app/shared/mixpanel/mixpanel.service";
// import { HOMEOWNER_LOG_IN } from "src/app/shared/mixpanel/mixpanel.enums";
// import { MEDIA_MESSAGE_RECEIVED } from "src/app/pages/comet-chat/comet-chat-ui-kit/utils/enums";

@Injectable({
  providedIn: "root",
})
export class SessionService extends Store.AbstractService {
  private static RESTRICTED_REDIRECT_URLS: string[] = [
    "/loading",
    "/login",
    "/logout",
    "/signup",
    "/signup/register",
    "/firm/info",
  ];

  sessionValidityTimer: any;

  private redirectURL: string;
  private redirectToken: string;
  private redirectURLParams: string;

  session: Session;
  account: any;
  details: any;
  tabSessionId: string;

  accountValidityTimer: any;

  public checkPlatformWithView: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public mql = window.matchMedia("(orientation: landscape)");

  private logoPath = new BehaviorSubject<string>("");
  readonly logoPath$ = this.logoPath.asObservable();

  private profilePath = new BehaviorSubject<string>("");
  readonly profilePath$ = this.profilePath.asObservable();

  private bannerPath = new BehaviorSubject<string>("");
  readonly bannerPath$ = this.bannerPath.asObservable();

  private fullName = new BehaviorSubject<string>("");
  readonly fullName$ = this.fullName.asObservable();

  private firmName = new BehaviorSubject<string>("");
  readonly firmName$ = this.firmName.asObservable();

  private notificationEnable = new BehaviorSubject<boolean>(false);
  readonly notificationEnable$ = this.notificationEnable.asObservable();

  private logo = new BehaviorSubject<any>({});
  readonly logo$ = this.logo.asObservable();

  private proGalleryImageLimit = new BehaviorSubject<number>(0);
  readonly proGalleryImageLimit$ = this.proGalleryImageLimit.asObservable();

  private subscriptions: Subscriptions = {
    sessionValidate: null,
  };

  mixPanleServiceEnabled: boolean = false;

  constructor(
    private router: Router,
    // private permissionsService: NgxPermissionsService,
    private location: Location,
    private authService: AuthenticationService,
    private logoutService: LogoutService,
    private toast: ToastService // private customUtilityService: CustomUtilityService
  ) {
    super();
    const me = this;

    me.tabSessionId = IDGenerator.newId();

    me.router.events.subscribe((re: RouterEvent) => {
      me.onRouterEvent(re);
    });

    window["getAccessToken"] = () => {
      return me.session.token;
    };

    me.checkPlatformWithView.next(
      /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) && !me.mql.matches
    );

    window.addEventListener("orientationchange", () => {
      if (screen.availHeight > screen.availWidth) {
        me.checkPlatformWithView.next(true);
      } else {
        me.checkPlatformWithView.next(false);
      }
    });
  }

  init() {
    const me = this;
    me.setRedirectURL();
    // me.loadDetails();
    return new Promise<void>((resolve, reject) => {
      resolve();
      me.initSession(resolve, reject);
    });
  }

  redirectToLoginPage() {
    const me = this;

    me.setRedirectURL();

    if (!me.account) {
      me.router.navigate(["/login"]);
    }

    if (me.account?.roles[0].code == "PRO_USER") {
      me.router.navigate(["/login"]);
    }

    if (me.account?.roles[0].code == "PRO_ADMIN") {
      me.router.navigate(["/login"]);
    }

    if (
      me.account?.roles[0].code == "HOMEOWNER" ||
      me.account.roles[0].code == "PROPERTY_MANAGER" ||
      me.account.roles[0].code == "PROPERTY_MANAGER_ADMIN"
    ) {
      me.router.navigate(["/home-owner/login"]);
    }
  }

  // Contains info about where to redirect after login based on roles(HOMEOWNER/PRO_USER)
  redirectToHomePage() {
    const me = this;
    let redirectTo = "/pro/settings";

    if (me.account.roles[0].code == "PRO_USER") {
      redirectTo = "/pro/notifications";
    }

    if (me.account.roles[0].code == "HOMEOWNER") {
      redirectTo = "/home-owner/services";
    }
    if (me.account.roles[0].code == "PROPERTY_MANAGER") {
      redirectTo = "/home-owner/properties";
    }
    if (me.account.roles[0].code == "PROPERTY_MANAGER_ADMIN") {
      redirectTo = "/home-owner/properties";
    }
    if (me.redirectToken && me.redirectURL) {
      redirectTo = me.redirectURL;
      me.redirectToken = null;
    }

    me.router.navigate([redirectTo], {
      queryParams: me.queryStringToJSON(me.redirectURLParams),
    });
  }

  private setRedirectURL(url?: string) {
    const me = this;
    const sessionInfo = AppLocalStorage.get("SESSION", "SESSION");
    let redirectURL: string = url;
    if (sessionInfo?.token) {
      redirectURL = url || me.location.path().split("?")[0];

      me.redirectURLParams = me.location.path().split("?")[1];
    }

    me.redirectToken = IDGenerator.newId();

    if (SessionService.RESTRICTED_REDIRECT_URLS.indexOf(redirectURL) !== -1) {
      redirectURL = null;
    }

    me.redirectURL = redirectURL;
  }

  private queryStringToJSON(qs) {
    if (qs) {
      var pairs = qs.split("&");
      var result = {};
      pairs.forEach(function (pair) {
        pair = pair.split("=");
        result[pair[0]] = decodeURIComponent(pair[1] || "");
      });
      return result;
    }
  }

  private isSSORequest(): boolean {
    return window.location.hash.startsWith("#id_token");
  }

  private isFirmDetailsPage(): boolean {
    return (
      SessionService.RESTRICTED_REDIRECT_URLS.indexOf("/pro/firm/info") !== -1
    );
  }

  private isSignUpPage(): boolean {
    return (
      SessionService.RESTRICTED_REDIRECT_URLS.indexOf("/signup/register") !== -1
    );
  }

  private isForgotPasswordPage(): boolean {
    return (
      SessionService.RESTRICTED_REDIRECT_URLS.indexOf(
        "/signup/forgot-password"
      ) !== -1
    );
  }

  //  Login Observable of type state which will accept payload from loginform & post payload to backend through controller.
  // public login(credentials: LoginCredentials): Observable<Store.State> {
  //   const me = this;

  //   const output = new Subject<Store.State>();

  //   setTimeout(() => {
  //     output.next(new SessionCreatingState());
  //   }, 0);

  //   // POST Observable which takes URL & data(payload)
  //   me.controller
  //     .post<AuthTokenResponse>(
  //       environment.api.session.login.endpoint,
  //       credentials
  //     )
  //     .subscribe(
  //       (data: AuthTokenResponse) => {
  //         // After subscribing, it creates a session & set values in local storage
  //         if (data) {
  //           me.session = {
  //             token: data.data.appToken,
  //             id: IDGenerator.newId(),
  //             expiry: moment().add(1, "day").toDate(),
  //           };

  //           AppLocalStorage.set("SESSION", "SESSION", me.session);

  //           // Validate session & completes the observable data stream.
  //           me.loadAccount().subscribe(() => {
  //             me.redirectToHomePage();
  //             if (data.status == "LOGIN_SUCCESSFUL") {
  //               // me.snackbar.openSnackBar(data.message, 3000);
  //             }
  //             me.startSessionValidation();
  //             me.startAccountValidation();
  //             output.complete();
  //           });
  //         } else {
  //           setTimeout(() => {
  //             output.error(
  //               new SessionCreatingErrorState(new AppError("No Token Received"))
  //             );
  //             output.complete();
  //           }, 0);
  //         }
  //       },
  //       (e: Error) => {
  //         setTimeout(() => {
  //           output.error(new SessionCreatingErrorState(AppError.fromError(e)));
  //           output.complete();
  //         }, 0);
  //       }
  //     );

  //   return output;
  // }

  //  homeOwnerLogin Observable of type state which will accept payload from loginform & post payload to backend through controller.
  // public homeOwnerLogin(
  //   credentials: LoginCredentials
  // ): Observable<Store.State> {
  //   const me = this;
  //   const output = new Subject<Store.State>();

  //   setTimeout(() => {
  //     output.next(new SessionCreatingState());
  //   }, 0);

  //   // POST Observable which takes URL & data(payload)
  //   me.controller
  //     .post<AuthTokenResponse>(
  //       environment.api.auth.homeOwnerLogin.endpoint,
  //       credentials
  //     )
  //     .subscribe(
  //       // After subscribing, it creates a session & set values in local storage
  //       (data: AuthTokenResponse) => {
  //         if (data) {
  //           me.session = {
  //             token: data.data.appToken,
  //             id: IDGenerator.newId(),
  //             expiry: moment().add(1, "day").toDate(),
  //           };

  //           AppLocalStorage.set("SESSION", "SESSION", me.session);

  //           // Validate session & completes the observable data stream.
  //           me.loadAccount().subscribe(() => {
  //             me.redirectToHomePage();
  //             if (data.status == "LOGIN_SUCCESSFUL") {
  //               // NEED TO CHANGE
  //               // me.details?.mixPanelAnalyticsEnabled && me.account?.meta?.mixPanelAnalyticsEnabled
  //               if (me.details?.mixPanelAnalyticsEnabled) {
  //                 const device =
  //                   me.customUtilityService.checkDeviceInformation();
  //                 const superProperties = {
  //                   Email: me.account.email,
  //                   "User Type": "Homeowner",
  //                   Platform: device,
  //                   "App Version": environment.applicationVersion,
  //                 };

  //                 me.mixPanelService.setSuperProperties(superProperties);
  //                 me.mixPanelService.identify(me.account.id);

  //                 let eventProperties = {
  //                   "First Name": me.account.firstName,
  //                   "Last Name": me.account.lastName,
  //                   "Phone Number": me.account.mobile,
  //                   "User Type": "Homeowner",
  //                   Email: me.account.email,
  //                   Provider: "Allpros",
  //                 };

  //                 me.mixPanelService.sendEvent(
  //                   HOMEOWNER_LOG_IN,
  //                   eventProperties
  //                 );
  //               }

  //               me.snackbar.openSnackBar("Signed in successfully", 3000);
  //             }
  //             me.startSessionValidation();
  //             me.startAccountValidation();
  //             output.complete();
  //           });
  //         } else {
  //           setTimeout(() => {
  //             output.error(
  //               new SessionCreatingErrorState(new AppError("No Token Received"))
  //             );
  //             output.complete();
  //           }, 0);
  //         }
  //       },
  //       (e: Error) => {
  //         setTimeout(() => {
  //           output.error(new SessionCreatingErrorState(AppError.fromError(e)));
  //           output.complete();
  //         }, 0);
  //       }
  //     );

  //   return output;
  // }

  // public logout(): Observable<Store.State> {
  //   const me = this;
  //   const output = new Subject<Store.State>();

  //   setTimeout(() => {
  //     output.next(new LogoutLoadingState());
  //   }, 0);

  //   const headearParams = {
  //     Authorization: true,
  //   };

  //   if (me.pushNotificationService.fcmToken) {
  //     headearParams["fcmToken"] = me.pushNotificationService.fcmToken;
  //   }

  //   me.controller
  //     .get(
  //       environment.api.session.logout.endpoint,
  //       null,
  //       undefined,
  //       headearParams
  //     )
  //     .subscribe(
  //       (data: LogoutResponse) => {
  //         if (data) {
  //           me.pushNotificationService.deleteToken();
  //           output.next(new LogoutLoadedState(data));
  //           output.complete();
  //         }
  //       },
  //       (e: Error) => {
  //         setTimeout(() => {
  //           output.error(new LogoutErrorState(AppError.fromError(e)));
  //           output.complete();
  //         }, 0);
  //       }
  //     );
  //   return output;
  // }

  public setLogoPath(logoPathURL) {
    const me = this;
    me.logoPath.next(logoPathURL);
  }

  public setBannerPath(bannerPathURL) {
    const me = this;
    me.bannerPath.next(bannerPathURL);
  }

  public setProfilePath(profilePathURL) {
    const me = this;
    me.profilePath.next(profilePathURL);
  }

  // public signupLogin(appToken: string): Observable<Store.State> {
  //   const output = new Subject<Store.State>();

  //   setTimeout(() => {
  //     output.next(new SignupLoginLoadingState());
  //   }, 0);
  //   const me = this;
  //   if (appToken) {
  //     me.session = {
  //       token: appToken,
  //       id: IDGenerator.newId(),
  //       expiry: moment().add(1, "day").toDate(),
  //     };
  //     AppLocalStorage.clear("SESSION", "SELECTEDADDRESS");
  //     AppLocalStorage.set("SESSION", "SESSION", me.session);
  //     me.loadAccount().subscribe(
  //       () => {
  //         output.next(new SignupLoginLoadedState());
  //         output.complete();
  //         me.redirectToHomePage();
  //         me.startAccountValidation();
  //         me.startSessionValidation();
  //       },
  //       (error) => {
  //         output.error(new SignupLoginErrorState(error));
  //         output.complete();
  //       }
  //     );
  //   }
  //   return output;
  // }

  // private loadAccount(): Observable<void> {
  //   const me = this;
  //   const output = new Subject<void>();

  //   const path = environment.api.auth.me.endpoint;

  //   me.controller.get(path, null, undefined, { Authorization: true }).subscribe(
  //     (data: SessionAccountResponse) => {
  //       me.account = data?.data;
  //       if (me.account?.meta?.cometchatUID != null) {
  //         setTimeout(() => {
  //           me.cometChatCustomService.init(me.account.meta.cometchatUID);
  //         });
  //       }

  //       if (me.account.roles[0].code == "PRO_USER" || me.account.roles[0].code == 'PRO_ADMIN') {
  //         me.logoPath.next(me.account?.firms[0]?.logoPath);
  //         me.fullName.next(me.account?.fullName);
  //         me.firmName.next(me.account?.firms[0]?.name);
  //         const bannerURL =
  //           me.account?.firms[0]?.bannerPath &&
  //             me.account?.firms[0]?.bannerPath != ""
  //             ? JSON.parse(me.account?.firms[0]?.bannerPath)?.big
  //             : null;
  //         me.bannerPath.next(bannerURL);
  //         //Notification call
  //         me.myNotification();
  //       }

  //       if (!(me.account.roles[0].code == "PRO_USER" || me.account.roles[0].code == 'PRO_ADMIN')) {
  //         if (me.account?.meta?.profile) {
  //           me.logoPath.next(me.account?.meta?.profile + "?date=" + new Date());
  //         }
  //         me.fullName.next(me.account?.fullName);
  //         me.myNotification();
  //       }
  //       me.refreshPermissions(output);
  //       // start push notification service
  //       me.pushNotificationService.getToken(
  //         me.account?.id.toString(),
  //         me.account?.meta?.cometchatUID
  //       );

  //       if (me.details?.mixPanelAnalyticsEnabled) {
  //         me.mixPanelService.setInitialData(me.details, me.account);
  //         me.mixPanleServiceEnabled =
  //           me.account?.meta?.mixPanelAnalyticsEnabled;
  //       }
  //     },
  //     (e: any) => {
  //       output.error(new Error("Failed to Load Account"));
  //       output.complete();
  //     }
  //   );

  //   return output;
  // }

  // public loadDetails(): void {
  //   const me = this;

  //   const path = environment.api.auth.details.endpoint;

  //   me.controller.get(path, null, undefined, {}).subscribe(
  //     (data: any) => {
  //       me.details = data?.data;
  //       if (me.details) {
  //         // start mixpanel events service.
  //         // me.details?.mixPanelAnalyticsEnabled
  //         if (me.details?.mixPanelAnalyticsEnabled) {
  //           // me.mixPanelService.mixPanelInitialization();
  //           // console.log("mixpanel service start");
  //         }
  //         me.logo.next(me.details);
  //       }
  //     },
  //     (e: any) => { }
  //   );
  // }

  // public refreshAccountInfo(): Observable<any> {
  //   const me = this;
  //   const subject = new Subject();
  //   me.loadAccount().subscribe((data) => {
  //     subject.next(true);
  //     subject.complete();
  //   });
  //   return subject;
  // }

  public updateCometChatId(cometChatId: string) {
    const me = this;
    let accountInfo = { ...me.account };
    accountInfo.meta.cometchatUID = cometChatId;
    me.account = accountInfo;
  }

  // private refreshPermissions(subject: Subject<void>) {
  //   const me = this;

  //   const permissions = Object.keys(me.account.permissions);

  //   me.permissionsService.loadPermissions(permissions);
  //   subject.next();
  //   subject.complete();
  // }

  // RolePermission[]
  public getRolePermissionsFor(code: string): any[] {
    const me = this;
    if (me.account && me.account.permissions && me.account.permissions[code]) {
      return Object.values(me.account.permissions[code]);
    }
    return null;
  }

  private startSessionValidation() {
    const me = this;
    me.stopSessionValidation();
    if (
      this.authService.getTokenExpiryTime(
        localStorage.getItem(constants.ACCESS_TOKEN)
      )
    ) {
      me.sessionValidityTimer = setTimeout(() => {
        me.validateSession();
      }, 600000);
    } else {
      this.authService.refreshToken(
        localStorage.getItem(constants.REFRESH_TOKEN)
      );
    }
  }

  private startAccountValidation() {
    const me = this;

    // Do not remove code below

    // me.accountValidityTimer = setInterval(() => {
    //   me.validateAccount();
    // }, 6000);
  }

  validateAccount() {
    const me = this;
    const session = AppLocalStorage.get("SESSION", "SESSION", true) as Session;

    console.log(me.session.token !== session.token);

    if (
      me.session &&
      session &&
      session.token &&
      me.session.token !== session.token
    ) {
      window.location.href = "/login";
    }
  }

  private stopSessionValidation() {
    const me = this;
    if (me.sessionValidityTimer) {
      clearTimeout(me.sessionValidityTimer);
    }
  }

  private validateSession() {
    const me = this;

    // console.log("Validating Session");

    // const path = environment.api.auth.validate.endpoint;
    // me.controller.get(path, null, undefined, { Authorization: true }).subscribe(
    //   (data: any) => {
    me.startSessionValidation();
    me.startAccountValidation();
    //   },
    //   (e: any) => {
    //     me.router.navigate(["logout"]);
    //   }
    // );
  }

  // private myNotification() {
  //   const me = this;
  //   const accountId: string[] = [];
  //   accountId.push(me.account?.id.toString());

  //   const notificationPayload: MyNotificationPayload = {
  //     query: null,
  //     filter: {
  //       receiverId: accountId,
  //       fromDate: null,
  //       toDate: null,
  //     },
  //     sort: [
  //       {
  //         field: "",
  //         order: "",
  //       },
  //     ],
  //     p: 0,
  //     pp: 100,
  //   };
  //   me.notificationService.customGetMyNotificationsList(notificationPayload);
  // }

  private initSession(resolve: () => void, reject: (reason: AppError) => void) {
    const me = this;

    const session: Session = AppLocalStorage.get(
      "SESSION",
      "SESSION"
    ) as Session;

    if (me.isSessionActive(session)) {
      me.session = session;
      me.validateSession();
      resolve();
      return;
    }

    if (me.isSSORequest()) {
      resolve();
      return;
    }

    // TODO: Need to verify this

    if (me.isFirmDetailsPage()) {
      resolve();
      return;
    }

    if (me.isSignUpPage()) {
      resolve();
      return;
    }

    if (me.isForgotPasswordPage()) {
      resolve();
      return;
    }

    // Redirect to Login
    me.router.navigate(["login"]);
    resolve();
  }
  // returns a boolean depending on session active
  public isActive(): boolean {
    return this.isSessionActive(this.session);
  }

  // public clear(): Observable<any> {
  //   const output = new Subject<any>();
  //   const me = this;

  //   // Clear session local storage
  //   AppLocalStorage.clear("SESSION", "SELECTEDADDRESS");
  //   AppLocalStorage.clear("SESSION", "SESSION");

  //   // Stop session validation check
  //   me.stopSessionValidation();

  //   //stop notifications.
  //   me.notificationService.stopTimer();
  //   me.cometChatCustomService.logout();
  //   me.logoPath.next(null);
  //   // Reset Session
  //   me.session = null;

  //   // stop account validation
  //   if (me.accountValidityTimer) {
  //     clearInterval(me.accountValidityTimer);
  //   }

  //   setTimeout(() => {
  //     output.next();
  //   });

  //   return output;
  // }

  // public hasPermissionsAll(permissions: string[]): boolean {
  //   const me = this;
  //   const sessionPermissions: NgxPermissionsObject =
  //     me.permissionsService.getPermissions();
  //   let flag = true;

  //   for (const permission of permissions) {
  //     if (!sessionPermissions[permission]) {
  //       flag = false;
  //       break;
  //     }
  //   }

  //   return flag;
  // }
  //   It is taking session with token| id| expiry as a parameter & returns a boolean
  private isSessionActive(session: Session): boolean {
    return !!session;
  }

  private onRouterEvent(event: RouterEvent) {
    const me = this;

    if (event instanceof NavigationEnd) {
      switch (event.url) {
        case "/pro/loading":
          me.redirectToken = null;
          break;
      }
    }
  }

  // public platformViewCheck(): Observable<boolean> {
  //   const me = this;
  //   const mql = window.matchMedia("(orientation: landscape)");
  //   const output: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
  //     !(/Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
  //       navigator.userAgent
  //     ) && mql.matches)
  //   );

  //   window.addEventListener("orientationchange", function () {
  //     output.next(
  //       /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
  //         navigator.userAgent
  //       ) && mql.matches
  //     );
  //   });
  //   return output;
  // }
}
