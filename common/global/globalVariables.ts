import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class globalVariables {
	platform: string;
	ipAddress: string
	userId: string = "";
	mobile: string = "";
	email: string = "";
	fullName: string = "";
	firstName: string = "";
	lastName: string = "";
	appConfig: any;
	version: 0;
	deviceModel: string = "";
	osVersion: string = "";
	public tabString: Subject<string> = new Subject();
	public readonly $tabString: Observable<string> = this.tabString.asObservable();


  	profileData = new BehaviorSubject<any>({});



}
