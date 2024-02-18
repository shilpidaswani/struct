import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { Store } from 'src/app/core/store/store';
import constants from 'src/common/constants/constants';
import { ProfileService } from 'src/providers/profile/profile.service';
import { ToastService } from 'src/services/toast.service';
import { TransactionLoadingState, TransactionLoadedState, TransactionErrorState } from 'src/state/registration-state';
declare var paypal: any;

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

	tipAmount: any = "2.00";
	amounts: any = ["2.00", "3.00", "4.00", "5.00", "10.00", "20.00", "Other"];
	showOtherInput: any = "2.00";
	shoutout: any = "";
	user_email: any = "";
	profiledata: any;
	constants = constants

	constructor(private modal: ModalController, private navParams: NavParams, private toast: ToastService, private profileService: ProfileService, private alert: AlertController) { }

	ngOnInit() {
		this.user_email = this.navParams.get('user_email');
		this.profiledata = this.navParams.get('profiledata');
		this.renderPaypalButtons();
	}

	dismiss() {
		this.modal.dismiss();
	}

	selectTipAmount(amount) {

		if (amount == "Other") {
			this.showOtherInput = "Other";
			// this.tipAmount = "";
		} else {
			this.tipAmount = amount;
			this.showOtherInput = amount;
		}
	}

	renderPaypalButtons() {
		let that = this;

		try {
			paypal.Buttons({
				// Sets up the transaction when a payment button is clicked
				createOrder: (data, actions) => {
					return actions.order.create({
						purchase_units: [{
							amount: {
								value: this.tipAmount // Can also reference a variable or function
							},
							payee: {
								// email_address: 'sb-w47yjx24634270@personal.example.com'
								email_address: this.user_email
								// email_address: 'advait.yogaonkar@personal.example.com'
							}
						}],
						application_context: {
							shipping_preference: 'NO_SHIPPING'
						}
					});
				},
				onError: (data, actions) => {
					console.log(data);
					console.log(actions);
				},
				onCancel: (data, actions) => {
					console.log(data);
					console.log(actions);
				},
				// Finalize the transaction after payer approval
				onApprove: (data, actions) => {
					return actions.order.capture().then(async (orderData) => {
						// Successful capture! For dev/demo purposes:
						console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
						const transaction = orderData.purchase_units[0].payments.captures[0];


						this.saveTransaction(transaction);
						if (transaction.status == "COMPLETED") {
							that.toast.customToast("Transaction successful!");
						} else if (transaction.status == "PENDING") {
							if (transaction.seller_protection.status == "NOT_ELIGIBLE") {
								const alert = await this.alert.create({
									header: transaction.status,
									subHeader: 'Looks like the payee is not a paypal registered or invalid payee!',
									message: '<span>Please read the next steps on the link below</span></br><a href="https://www.paypal.com/us/cshelp/article/why-is-the-payment-i-sent-pending-or-unclaimed-can-i-cancel-it-help111#:~:text=If%20a%20payment%20you%20sent,to%20a%20verified%20PayPal%20account." target="_blank">Why is the payment I sent pending or unclaimed? Can I cancel it?</a>',
									buttons: ['OK'],
								});
							  
								await alert.present();

							} else if (transaction.seller_protection.status == "ELIGIBLE") {
								const alert = await this.alert.create({
									header: transaction.status,
									subHeader: 'Looks like the payee has not yet authorized the transaction!',
									message: '<span>Please read the next steps on the link below</span></br><a href="https://www.paypal.com/us/cshelp/article/why-is-the-payment-i-sent-pending-or-unclaimed-can-i-cancel-it-help111#:~:text=If%20a%20payment%20you%20sent,to%20a%20verified%20PayPal%20account." target="_blank">Why is the payment I sent pending or unclaimed? Can I cancel it?</a>',
									buttons: ['OK'],
								});
							  
								await alert.present();

							}
							// that.toast.customToast(`Transaction ${transaction.status}!`)
						}

						that.modal.dismiss({ payment: transaction.status });

						// alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
						// When ready to go live, remove the alert and show a success message within this page. For example:
						// const element = document.getElementById('paypal-button-container');
						// element.innerHTML = '<h3>Thank you for your payment!</h3>';
						// Or go to another URL:  actions.redirect('thank_you.html');
					}).catch((err) => {
						console.log(err);
					});
				}
			}).render('#paypal-button-container');

		} catch (e) {
			console.log(e)
		}
	}

	saveTransaction(order) {
		let payload = {
			"transaction_id": order.id,
			"payer": localStorage.getItem(constants.USER_ID),
			"receiver": this.profiledata._id,
			"message": this.shoutout,
			"amount": this.tipAmount,
			"currency": order.amount.currency_code,
			"metadata": JSON.stringify(order),
			"payment_source": "paypal"
		}
		this.profileService.saveTransaction(payload).subscribe((state: Store.State) => {
			if (state instanceof TransactionLoadingState) {
				console.log("Loading Get API");
			}

			if (state instanceof TransactionLoadedState) {
				console.log(state.data);

			}
			if (state instanceof TransactionErrorState) {
				console.log(TransactionErrorState);
				this.toast.showToastMessage("Failed to Load");
			}
		});
	}
}
