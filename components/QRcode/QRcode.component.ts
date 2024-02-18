import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ToastService } from 'src/services/toast.service';

@Component({
	selector: 'app-QRcode',
	templateUrl: './QRcode.component.html',
	styleUrls: ['./QRcode.component.scss'],
})
export class QRCodeComponent implements OnInit {

	elementType = NgxQrcodeElementTypes.URL;
	correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
	value: any = "";
	profiledata: any = {};

	constructor(private modal: ModalController, private navParams: NavParams, private toast: ToastService) {
		this.profiledata = navParams.get('profiledata');
		this.value = JSON.stringify({"id": this.profiledata._id});
	}

	ngOnInit() {
		
	}

	dismiss() {
		this.modal.dismiss();
	}

}
