import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';
import constants from "../common/constants/constants";

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    TOAST_SUCCESS = "TOAST_SUCCESS";

    TOAST_ERROR = "TOAST_ERROR";

    TOAST_WARNING = "TOAST_WARNING";

    TOAST_INFO = "TOAST_INFO";
    constructor(public toastController: ToastController) { }

    async showtoast(msg: string): Promise<void> {
        const toastOpts: ToastOptions = await this.toastController.create({
            message: msg,
            duration: 3000,
            animated: true,
            cssClass: "ion-text-center",
            keyboardClose: true,
            translucent: true,
            header: "Info",
        }),
            toast = this.toastController.create(toastOpts);
        return (await toast).present();
    }

    async showToastMessage(message: string): Promise<void> {
        let toast = await this.toastController.create({
            message: message,
            position: "bottom",
            duration: 3000,
            animated: true,
            // color: 'danger',
            cssClass: "toast-regulars",
            keyboardClose: true,
            translucent: false
        })

        return toast.present();
        // const { icon, position, color } = this._colorPosition(type),
        //     toast = await this.toastController.create({
        //         message: `<ion-icon name="${icon}" position="${position}" ></ion-icon> ${message}`,
        //         duration: 2500,
        //         position: "bottom",
        //         color,
        //         cssClass: "toast_msg",
        //     });

        // return toast.present();
    }
    _colorPosition(type: string) {
        let color = "",
            icon = "",
            position = "";
        if (type == constants.TOAST_ERROR) {
            color = "danger";

            icon = "warning-outline";
        } else if (type == constants.TOAST_INFO) {
            color = "tertiary";
            icon = "information-circle-outline";
        } else if (type == constants.TOAST_SUCCESS) {
            color = "success";
            icon = "checkmark-outline";
        } else if (type == constants.TOAST_WARNING) {
            color = "warning";
            icon = "warning-outline";
        }
        position = "relative";
        return { icon, position, color };
    }

    async customToast(msg) {
        let toast = await this.toastController.create({
            message: '<ion-icon class="checkmark-icon" name="checkmark-circle"></ion-icon><div>' + msg + ' </div>',
            position: "middle",
            duration: 3000,
            animated: true,
            cssClass: "toast-regulars",
            keyboardClose: true,
            translucent: false
        })

        return toast.present();
            // toast = this.toastController.create(toastOpts);
        // return (await toast).present();
    }
}
