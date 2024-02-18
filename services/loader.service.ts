import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private loading: Promise<HTMLIonLoadingElement>;
    constructor(public loadingController: LoadingController) { }

    async presentLoader(msg: string): Promise<void> {
        // Return;
        const loaderOpts: LoadingOptions = {
            //  message:msg,
            spinner: 'circular',
            duration: 1000,
            translucent: true,
            cssClass: "custom-loader",
            animated: true,
            keyboardClose: true,
            showBackdrop: true,
            backdropDismiss: false,

        };
        this.loading = this.loadingController?.create(loaderOpts);
        (await this.loading)?.onDidDismiss().then((): any => (this.loading = null));
        return (await this.loading)?.present();
    }
    async presentLoaderWithoutTimer(msg: string): Promise<void> {
        // Return;
        const loaderOpts: LoadingOptions = {
            //  message:msg,
            spinner: 'circular',
            // duration: 3000,
            translucent: true,
            cssClass: "custom-loader",
            animated: true,
            keyboardClose: true,
            showBackdrop: true,
            backdropDismiss: false,

        };
        this.loading = this.loadingController?.create(loaderOpts);
        (await this.loading)?.onDidDismiss().then((): any => (this.loading = null));
        return (await this.loading)?.present();
    }

    // Hide the loader if already created otherwise return error
    async dismissLoader() {
        return (await this.loading)?.dismiss();
    }

}
