import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@capacitor/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { Store } from 'src/app/core/store/store';
import constants from 'src/common/constants/constants';
import { ProfileService } from 'src/providers/profile/profile.service';
import { LoaderService } from 'src/services/loader.service';
import { ToastService } from 'src/services/toast.service';
import { TransactionLoadingState, TransactionLoadedState, TransactionErrorState } from 'src/state/registration-state';
declare var paypal: any;

@Component({
	selector: 'app-tiphistory',
	templateUrl: './tiphistory.component.html',
	styleUrls: ['./tiphistory.component.scss'],
})
export class TipHistoryComponent implements OnInit {

	constants = constants;
	tipTransaction: any = [];

	constructor(private modal: ModalController, private navParams: NavParams, private toast: ToastService, private profileService: ProfileService, 
		private loader: LoaderService) { }

	ngOnInit() {
		this.getTipHistory();
	}

	dismiss() {
		this.modal.dismiss();
	}

	getTipHistory() {
	
		let h = localStorage.getItem("token");
		this.profileService.getTipHistory().subscribe((state: Store.State) => {
			if (state instanceof TransactionLoadingState) {
				console.log("loading comments");
				this.loader.presentLoader(constants.WAIT);
			}
			if (state instanceof TransactionLoadedState) {
				this.tipTransaction = state.data.data.data;
			}
			if (state instanceof TransactionErrorState) {
				console.log("error loading  Prompt");
			}
		});

	}
}
