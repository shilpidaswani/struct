import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import constants from 'src/common/constants/constants';

@Component({
	selector: 'app-delete-account',
	templateUrl: './delete-account.component.html',
	styleUrls: ['./delete-account.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DeleteAccountPage implements OnInit {

	constants = constants;
	constructor(private modal: ModalController) { }

	ngOnInit() {
	}

	getOtp() {

	}

	dismissModal() {
		this.modal.dismiss();
	}
}
