import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import constants from 'src/common/constants/constants';



@Injectable()
export class LoginRequiredGuard implements CanActivate {

    constructor(private navCtrl: NavController) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (localStorage.getItem(constants.ACCESS_TOKEN) && localStorage.getItem(constants.ACCESS_TOKEN) !== "") {
            return true;
        } else {
            this.navCtrl.navigateRoot("/");
            return false;
        }
    }


}
