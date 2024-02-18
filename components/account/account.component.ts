import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Store } from 'src/app/core/store/store';
import constants from 'src/common/constants/constants';
import { AccountService } from 'src/providers/account/account.service';
import { SignupService } from 'src/providers/signup/signup.service';
import { ToastService } from 'src/services/toast.service';
import { GetUserLoadedState, GetUserLoadingErrorState, GetUserLoadingState } from 'src/state/registration-state';
import { AccountModel } from './account.model';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class AccountPage implements OnInit {
	account: AccountModel[];
	form: FormGroup<any>;
	profiledata: any;
	profile_pic_src: any = "";
	placeOfWorkId: any = [];
	constructor(private accountService: AccountService, private router: Router, private modal: ModalController,private signupservice: SignupService, private toast: ToastService,private fb: FormBuilder) { }

	ngOnInit() {
		this.getuserdata();
		// this.account = this.accountService.accountData;
		// console.log(this.account[0]);
		// this.form = new FormGroup({
		// 	name: new FormControl(this.account[0].name, {
		// 		updateOn: "blur",
		// 		validators: [Validators.required],
		// 	}),
		// 	email: new FormControl(this.account[0].email, {
		// 		updateOn: "blur",
		// 		validators: [Validators.required],
		// 	}),
		// 	phone: new FormControl(this.account[0].phone, {
		// 		updateOn: "blur",
		// 		validators: [Validators.required],
		// 	}),
		// 	accountType: new FormControl(this.account[0].accountType, {
		// 		updateOn: "blur",
		// 		validators: [Validators.required],
		// 	}),

		// });
	}
	onUpdate() {
		if (!this.form.valid) {
			return;
		}
		console.log(this.form.value);

		this.modal.dismiss();
		// this.router.navigateByUrl("/settings");
	}

	dismissModal() {
		this.modal.dismiss();
	}
	getuserdata() {
		let user_id = localStorage.getItem(constants.USER_ID);
		this.signupservice.getuser(user_id).subscribe((state: Store.State) => {
			if (state instanceof GetUserLoadingState) {
			}

			if (state instanceof GetUserLoadedState) {
				this.profiledata = state?.data.data.data;

			}
			if (state instanceof GetUserLoadingErrorState) {
				console.log(GetUserLoadingErrorState);
				this.toast.showToastMessage("Failed to Load");
			}
		});
	}
}


