import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ToastService } from 'src/services/toast.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
	selector: 'app-scancode',
	templateUrl: './scancode.component.html',
	styleUrls: ['./scancode.component.scss'],
})
export class ScanCodeComponent implements OnInit {
	scanActive: boolean = false;


	constructor(private modal: ModalController, private navParams: NavParams, private toast: ToastService) { }

	ngOnInit() {

	}

	dismiss() {
		this.modal.dismiss();
	}

	async checkPermission() {
		return new Promise(async (resolve, reject) => {
			const status = await BarcodeScanner.checkPermission({ force: true });
			if (status.granted) {
				resolve(true);
			} else if (status.denied) {
				BarcodeScanner.openAppSettings();
				resolve(false);
			}
		});
	}

	async startScanner() {
		const allowed = await this.checkPermission();

		if (allowed) {
			this.scanActive = true;
			BarcodeScanner.hideBackground();

			document.querySelector('body').classList.add('scanner-active');
			const result = await BarcodeScanner.startScan();

			if (result.hasContent) {
				this.scanActive = false;

				console.log(result.content);
				this.modal.dismiss({content: result.content});
				// alert(result.content); //The QR content will come out here
				//Handle the data as your heart desires here
			} else {
				alert('NO DATA FOUND!');
			}
		} else {
			alert('NOT ALLOWED!');
		}
	}

	stopScanner() {
		BarcodeScanner.stopScan();
		document.querySelector('body').classList.remove('scanner-active');
		this.scanActive = false;
	}

	ionViewWillLeave() {
		BarcodeScanner.stopScan();
		document.querySelector('body').classList.remove('scanner-active');
		this.scanActive = false;
	}
}
