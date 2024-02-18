import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import constants from "src/common/constants/constants";
import { AuthenticationService } from "src/providers/authentication/authentication.service";


@Injectable({

	providedIn: "root",
})
export class CanEnterGuard implements CanActivate {

	constructor(private authService: AuthenticationService, private router: Router) {

	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authService.isAuthenticated()) {
			if (!localStorage.getItem(constants.ACCESS_TOKEN)) {
				return true
			} else {

				if (localStorage.getItem(constants.ACCESS_TOKEN) !== '') {
					this.router.navigate(['/home']) //enter your route
				} else {
					return true;
				}
			}
		}
		else {
			return true
		}
	}

}

