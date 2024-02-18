import { EventEmitter, Injectable, Output } from "@angular/core";
import { AlertController, Platform } from "@ionic/angular";
import constants from "../common/constants/constants";
import { LoaderService } from "./loader.service";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class CoreService {
  constants = constants;
  images!: string;
  imgBlob: any;
  imageResponse: any;
  isIphone: boolean = false;
  isIpad: boolean = false;
  selected_role: any = "";
  full_name: any = "";

  constructor(
    public alertController: AlertController,
    private loader: LoaderService,
    private toast: ToastService,
    private platform: Platform
  ) {}

  getPlatformSpecs() {
    const platformArr = this.platform.platforms();
    if (platformArr.includes("iphone")) {
      this.isIphone = true;
      this.isIpad = false;
    } else if (platformArr.includes("ipad")) {
      this.isIphone = false;
      this.isIpad = true;
    }
  }
  getTokenExpiryTime(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    console.log(jsonPayload);

    return JSON.parse(jsonPayload);
  }
  validateContactNumber(number): boolean {
    const regex = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/; ///^(\[0-9]{3}\|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    if (number != "") {
      if (regex.test(number)) {
        // if(number.includes("'") == false){
        return true;
        //}
      } else {
        this.toast.customToast("Please enter a valid Phone Number.");
        return false;
      }
    }
  }
}
