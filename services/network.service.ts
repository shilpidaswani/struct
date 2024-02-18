import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionStatus, Network } from '@capacitor/network';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class NetworkService {
    private readonly _didInternetWentOffline: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );

    private readonly _didInternetWentOffline$: Observable<boolean> = this._didInternetWentOffline.asObservable();

    constructor() {
        this._networkInit();
    }

    private _networkInit(): void {
        Network.addListener("networkStatusChange", (status: ConnectionStatus) => {
            this._didInternetWentOffline.next(status.connected);
        });
    }

    networkListener(): Observable<boolean> {
        return this._didInternetWentOffline$.pipe(distinctUntilChanged());
    }

    get isOnline(): boolean {
        return this._didInternetWentOffline.value;
    }
}
