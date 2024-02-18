import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ModalController, NavParams } from "@ionic/angular";
import { Store } from "src/app/core/store/store";
import { CommentService } from "src/providers/comment/comment.service";
import { LoaderService } from "src/services/loader.service";
import constants from "src/common/constants/constants";

import {
	GetCommetLoadedState,
	GetCommetLoadingState,
	GetCommetErrorState,
	PostCommetLoadedState,
	PostCommetLoadingState,
	PostCommetErrorState,
	PostLoadingState,
	PostLoadedState,
	PostErrorState,
} from "src/state/registration-state";
import { PhotoViewer } from "@awesome-cordova-plugins/photo-viewer/ngx";
@Component({
	selector: "app-comment-modal",
	templateUrl: "./comment-modal.component.html",
	styleUrls: ["./comment-modal.component.scss"],
})
export class CommentModalComponent implements OnInit {
	singleFeed: any;
	comments: any[] = [];
	count: number = 4;
	slideOpts = {
		initialSlide: 0,
		speed: 400,
	};
	commentForm: FormGroup;

	profilePic: any = ""

	constructor(
		private modalCtrl: ModalController,
		private route: ActivatedRoute,
		private navParams: NavParams,
		private commetService: CommentService,
		private loader: LoaderService,
		private fb: FormBuilder,
		private photoViewer: PhotoViewer,

	) {
		this.route.queryParams.subscribe((params) => {
			let feed = this.navParams.get("feedData");
			console.log(feed);

			this.getPostByID(feed._id);
		});
	}

	getPostByID(id) {
		this.commetService.getPostByID(id).subscribe((state: Store.State) => {
			if (state instanceof PostLoadingState) {
				console.log("loading comments");
			}
			if (state instanceof PostLoadedState) {

				console.log(state.data)
				this.singleFeed = state.data.data.data;

				this.getAllComments();
				// this.comments = state.data.data.data;
				// console.log("comments loaded", this.comments);
				// this.comments = this.comments.map((item) => ({
				// 	...item,
				// 	showMore: false,
				// }));
			}
			if (state instanceof PostErrorState) {
				console.log("error loading  comment");
			}
		});
	}

	ngOnInit() {
		this.commentForm = this.fb.group({
			commentText: ['', Validators.required],
		});
		// this.getAllComments();

		this.profilePic = localStorage.getItem(constants.PROFILE_PIC_URL) && localStorage.getItem(constants.PROFILE_PIC_URL) != "" ? localStorage.getItem(constants.PROFILE_PIC_URL) : '../../../assets/images/landing-image.jpeg';
	}
	trimString(string, length) {
		return string.length > length
			? string.substring(0, length) + "..."
			: string;
	}

	cancel() {
		return this.modalCtrl.dismiss("cancel");
	}

	confirm() {
		return this.modalCtrl.dismiss("confirm");
	}
	getInputData() {
		this.createComment();
	}
	addCount(count) {
		count <= this.comments.length - 1 ? this.count = count + 3 : this.count = 4;
	}

	getAllComments() {
		this.commetService.getAllComments(this.singleFeed._id).subscribe((state: Store.State) => {
			if (state instanceof GetCommetLoadingState) {
				console.log("loading comments");
			}
			if (state instanceof GetCommetLoadedState) {
				this.comments = state.data.data.data;
				console.log("comments loaded", this.comments);
				this.comments = this.comments.map((item) => ({
					...item,
					showMore: false,
				}));
			}
			if (state instanceof GetCommetErrorState) {
				console.log("error loading  comment");
			}
		});
	}
	createComment() {

		console.log(this.commentForm);
		let payload = {
			comment: this.commentForm.get("commentText").value,
			post: this.singleFeed._id,
		};

		this.commetService
			.createNewComment(payload)
			.subscribe((state: Store.State) => {
				if (state instanceof PostCommetLoadingState) {
					console.log("loading comments");
					this.loader.presentLoader(constants.WAIT);

				}
				if (state instanceof PostCommetLoadedState) {
					console.log(state);
					this.loader.dismissLoader();
					return this.modalCtrl.dismiss("confirm");
				}
				if (state instanceof PostCommetErrorState) {
					console.log("error loading  comment");
				}
			});
	}

	openImage(img_src) {
		this.photoViewer.show(img_src);
	}
}
