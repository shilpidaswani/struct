import { Component, OnInit } from "@angular/core";
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { ImagePicker } from "@awesome-cordova-plugins/image-picker/ngx";
import { ModalController, NavParams, Platform } from "@ionic/angular";
import * as moment from "moment";
import { Store } from "src/app/core/store/store";
import constants from "src/common/constants/constants";
import { MediauploadService } from "src/providers/media/mediaupload.service";
import { PostService } from "src/providers/post/post.service";
import { LoaderService } from "src/services/loader.service";
import { ToastService } from "src/services/toast.service";
import {
  MediaLoadingState,
  MediaLoadedState,
  MediaLoadingErrorState,
  PostLoadingState,
  PostLoadedState,
  PostErrorState,
} from "src/state/registration-state";

@Component({
  selector: "app-check-in",
  templateUrl: "./check-in.component.html",
  styleUrls: ["./check-in.component.scss"],
})
export class CheckInComponent implements OnInit {
  searchLocation: any = "";
  options: any;
  profiledata: any;
  placesOfWork: any = [];
  constants = constants;
  entryPoint: any;

  currentDate: any = moment().format("YYYY-MM-DDTHH:mm");
  selected_location: any = "";
  selectedLocObj: any = {};

  filesToUpload: any = [];
  action: any = "";
  media_S3Id: any = "";
  mediaUrl: any = [];

  checkedInLocation: any = {};
  description: any = "";

  selected_date: any;
  errorMsg: any = "";
  kBytes: any;

  hoursArray: any = [1, 2, 3, 4, 5, 6, 7, 8, "other"];
  showOtherInput: any = 4;
  enteredCheckoutAfter: any = "";

  constructor(
    private modal: ModalController,
    private navParams: NavParams,
    private postService: PostService,
    private mediaService: MediauploadService,
    private loader: LoaderService,
    private toast: ToastService,
    private platform: Platform,
    private camera: Camera
  ) {}

  ngOnInit() {
    this.profiledata = this.navParams.get("profiledata");
    console.log(this.profiledata);

    this.entryPoint = this.navParams.get("entryPoint");
    console.log(this.entryPoint);

    this.currentDate = moment().format("YYYY-MM-DDTHH:mm");
    // this.getPlaceDetailsFromPlaceIdnew(this.profiledata.workplace);

    this.placesOfWork = JSON.parse(
      localStorage.getItem(constants.PLACEOFWORKDETAILS)
    );
  }
  ionViewWillEnter() {
    this.filesToUpload = [];
  }

  handlePlacesOfWork(event) {
    console.log(event);

    let eventString = JSON.stringify(event);
    this.selectedLocObj = JSON.parse(eventString);
    this.selected_location = event.name;

    console.log(this.selectedLocObj);
    // this.modal.dismiss(event);
  }

  selectedCheckoutAfter(hr) {
    if (hr == "other") {
      this.showOtherInput = "other";
      // this.tipAmount = "";
    } else {
      this.enteredCheckoutAfter = hr;
      this.showOtherInput = hr;
    }
  }

  dismiss() {
    this.modal.dismiss();
  }

  // getPlaceDetailsFromPlaceIdnew(placeIds) {
  // 	placeIds.forEach((placeId) => {
  // 		let trimplaceid = placeId.trim();

  // 		let request = {
  // 			placeId: trimplaceid
  // 		};

  // 		let service = new google.maps.places.PlacesService(document.createElement('div'));
  // 		console.log(service);
  // 		service.getDetails(request, (place, status) => {
  // 			console.log(place, status)

  // 			this.placesOfWork.push(place);
  // 		});
  // 	});
  // }

  setDate(event) {
    console.log(event);
    // this.selected_date = moment(event.detail.value).format('x');

    this.selected_date = Date.parse(event.detail.value);
  }

  uploadMedia(size) {
    if (this.mediaUrl.length < 3) {
      if (size <= 10485760) {
        // let payload = new FormData();
        // let profile_Object = {
        //   type: "post_attachment",
        // };
        // payload.append("data", JSON.stringify(profile_Object));

        // console.log(this.filesToUpload);
        // for (const fileList of this.filesToUpload) {
        //   payload.append("files", fileList);
        // }
        let payload = new FormData();
        let profile_Object = {
          type: "profile_picture",
        };
        payload.append("data", JSON.stringify(profile_Object));
        payload.append("files", this.filesToUpload);
        this.mediaService
          .uploadMedia(payload, this.action)
          .subscribe((state: Store.State) => {
            if (state instanceof MediaLoadingState) {
              console.log("Loading");
              this.loader.presentLoader(constants.WAIT);
            }

            if (state instanceof MediaLoadedState) {
              console.log(state.data);
              this.loader.dismissLoader();
              this.media_S3Id = state.data.s3Id;
              console.log("this.media_S3Id: ", this.media_S3Id);
              this.mediaUrl = [...this.mediaUrl, ...state.data.mediaUrls];
              console.log("this.mediaUrl: in upload media", this.mediaUrl);
              this.filesToUpload = [];
              console.log(
                "this.filesToUpload: after empty",
                this.filesToUpload
              );
              // this.mediaUrl = state.data.mediaUrls;
              console.log("this.mediaUrls: ", this.mediaUrl);
              // this.createPost();
            }
            if (state instanceof MediaLoadingErrorState) {
              this.loader.dismissLoader();
              this.toast.showToastMessage("Failed to Load");
            }
          });
      } else {
        this.toast.showToastMessage("Cannot upload file size more than 15MB");
      }
    } else {
      this.toast.showToastMessage("Cannot upload more than 3 Images.");
    }
  }
  validationCheck() {
    if (this.selected_location.length <= 0) {
      this.errorMsg = "Please select the check in location.";
      return false;
    } else {
      this.errorMsg = "";
      return true;
      // this.createCheckIn();
    }
  }

  createCheckIn() {
    if (this.validationCheck()) {
      console.log("valid");
      if (this.entryPoint == "checkin") {
        console.log(this.enteredCheckoutAfter);

        const current_time = moment(new Date());
        current_time.add(this.enteredCheckoutAfter, "h");

        console.log(current_time);
        console.log(moment(current_time).unix() * 1000);

        let convertedTime = moment(current_time).unix() * 1000;
        let obj = {
          description: this.description,
          mediaURL: this.mediaUrl,
          PostS3Id: this.media_S3Id,
          location: {
            placeName: this.selectedLocObj.name,
            placeId: this.selectedLocObj.place_id,
            coordinates: [
              this.selectedLocObj.geometry.location.lng,
              this.selectedLocObj.geometry.location.lat,
            ],
          },
          type: "check-in",
          checkedOutTime: convertedTime,
        };

        console.log(obj);
        this.postService.createPost(obj).subscribe((state: Store.State) => {
          if (state instanceof PostLoadingState) {
            console.log("Loading");
            this.loader.presentLoader(constants.WAIT);
          }

          if (state instanceof PostLoadedState) {
            console.log(state.data);

            if (state.data.status == "success") {
              this.toast.customToast("Checked in successfully!");
              this.description = "";
              this.checkedInLocation = {};
              this.mediaUrl = [];
              this.media_S3Id = "";
              this.selectedLocObj = {};
              this.selected_date = "";

              this.modal.dismiss({ checkedin: "checkedin" });
              // this.router.navigate(['/home/feed']);
            }
          }
          if (state instanceof PostErrorState) {
            this.toast.showToastMessage("Failed to create post");
          }
        });
      } else if (this.entryPoint == "post") {
        this.modal.dismiss(this.selectedLocObj);
      }
    }
  }

  uploadFromCamera() {
    const platformArr = this.platform.platforms();
    console.log(platformArr);

    if (platformArr.includes("mobileweb")) {
      this.selectFileButton();
    } else {
      this.ImagePicker();
    }
  }

  selectFileButton() {
    let element: HTMLElement = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    element.click();
  }

  uploadFile(event) {
    console.log("uploadFile called");
    this.filesToUpload = event.target.files;
    let fileSize = this.filesToUpload.size;
    this.uploadMedia(fileSize);
  }

  ImagePicker() {
    this.filesToUpload = [];
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        /*
         * ImageData is either a base64 encoded string or a file URI
         * If it's base64 (DATA_URL):
         */
        // console.log(`==>>img ${imageData}`);
        const img = `data:image/jpeg;base64,${imageData}`;
        console.log(`img`);
        const date = new Date();
        const blob_nw = this.dataURItoBlob(img);
        let metadata = {
          type: blob_nw.type,
        };
        let file = new File(
          [blob_nw],
          "profile_pic_" + date.getTime(),
          metadata
        );
        console.log(file);
        this.filesToUpload = file;
        this.uploadMedia(this.filesToUpload.size);
        // this.loader.dismissLoader()
      },
      (err) => {
        console.log(err);
      }
    );
    // const options = {
    //   outputType: 1,
    //   disable_popover: true,
    //   maximumImagesCount: 3,
    //   width: 200,
    //   quality: 100,
    // };
    // this.imagePicker.getPictures(options).then(
    //   (results) => {
    //     for (let i = 0; i < results.length; i++) {
    //       results[i] = "data:image/jpeg;base64," + results[i];
    //       console.log("", results[i]);
    //       const date = new Date();
    //       const blob_nw = this.dataURItoBlob(results[i]);

    //       let metadata = {
    //         type: blob_nw.type,
    //       };
    //       let file = new File(
    //         [blob_nw],
    //         "post_attachment_" + date.getTime(),
    //         metadata
    //       );
    //       console.log(file);

    //       this.filesToUpload.push(file);
    //     }

    //     console.log("this.filesToUpload: ", this.filesToUpload);
    //     let fileSize = 0;
    //     for (let i = 0; i < this.filesToUpload.length; i++) {
    //       fileSize += this.filesToUpload[i].size;
    //     }
    //     // this.filesToUpload = filesArray;
    //     this.uploadMedia(this.filesToUpload.size);
    //     this.loader.dismissLoader();
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const bb = new Blob([ab], { type: mimeString });
    return bb;
  }

  selectCheckInPlace(place) {
    this.selectedLocObj = place;
    this.selected_location = place.name;
    console.log(this.selectedLocObj);
  }
  checkImageSize(base64String) {
    let padding;
    let inBytes;
    let base64StringLength;
    if (base64String.endsWith("==")) {
      padding = 2;
    } else if (base64String.endsWith("=")) {
      padding = 1;
    } else {
      padding = 0;
    }

    base64StringLength = base64String.length;
    console.log(base64StringLength);
    inBytes = (base64StringLength / 4) * 3 - padding;
    console.log(inBytes);
    this.kBytes = inBytes / 1000;
    return this.kBytes;
  }
  ionViewWillLeave() {
    console.log("ionViewWillLeave: ");
    this.filesToUpload = [];
  }
  ngOnDestroy() {
    this.filesToUpload = [];
    console.log("destroyed visual ");
  }
}
