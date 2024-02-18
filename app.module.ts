import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthenticationService } from "src/providers/authentication/authentication.service";
import { DataService } from "src/api-service/data.service";
import { NetworkService } from "src/services/network.service";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { InjectorResolver } from "./core/injector/injector.service";
//import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { LoginRequiredGuard } from "./gaurds/loginRequired";
import { CanEnterGuard } from "./gaurds/canEnter";
import { ImagePicker } from "@awesome-cordova-plugins/image-picker/ngx";
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import { CommonModule, DatePipe } from "@angular/common";
import { PostPage } from "./screens/post/post.page";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { sessionProviderFactory } from "./core/session/session.module";
import { SessionService } from "./core/session/session.service";
import { LoggerModule } from "ngx-logger";
import { PipesModule } from "src/pipes/pipes.module";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@awesome-cordova-plugins/native-geocoder/ngx";
import { CheckInComponent } from "./components/check-in/check-in.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { MasonryGalleryModule } from 'ngx-masonry-gallery';
import { PhotoViewer } from "@awesome-cordova-plugins/photo-viewer/ngx";
import { CommentModalComponent } from "./modals/comment-modal/comment-modal.component";
import { DeleteAccountPage } from "./components/delete-account/delete-account.component";
import { AccountPage } from "./components/account/account.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { TipHistoryComponent } from "./components/tiphistory/tiphistory.component";
import { QRCodeComponent } from "./components/QRcode/QRcode.component";
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
import { ScanCodeComponent } from "./components/scancode/scancode.component";
import { NgxMaskIonicModule } from "ngx-mask-ionic";
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions,
} from "@awesome-cordova-plugins/media-capture/ngx";

@NgModule({
  declarations: [
    AppComponent,
    CheckInComponent,
    CommentModalComponent,
    DeleteAccountPage,
    AccountPage,
    PaymentComponent,
    TipHistoryComponent,
    QRCodeComponent,
    ScanCodeComponent,
  ],
  entryComponents: [
    CheckInComponent,
    DeleteAccountPage,
    AccountPage,
    PaymentComponent,
    TipHistoryComponent,
    QRCodeComponent,
    ScanCodeComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    GooglePlaceModule,
    LoggerModule.forRoot(null),
    Ng2SearchPipeModule,
    PipesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    NgxMaskIonicModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthenticationService,
    DataService,
    NetworkService,
    LoginRequiredGuard,
    CanEnterGuard,
    ImagePicker,
    Camera,
    Geolocation,
    NativeGeocoder,
    PhotoViewer,
    MediaCapture,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: sessionProviderFactory,
      deps: [InjectorResolver, SessionService],
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
