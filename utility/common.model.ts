import { Subscription } from 'rxjs';

export type Subscriptions = { [key: string]: Subscription };

export interface CommonResponseModel {
    message?: string;
    status?: string;
    [key: string]: any;
}


export interface LoginRedirectActionData {
    action: string,
    actionType: string
}

export interface LoginRedirectData {
    primaryLabel: string;
    loginRedirectBody: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    action: string;

}