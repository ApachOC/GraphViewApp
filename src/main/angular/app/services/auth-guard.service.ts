import { SessionService} from "./session.service";
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private session: SessionService, private _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.session.authenticated && this.session.user.roles.includes(next.data.role)) {
            return true;
        }
        this._router.navigate(['/']);
        return false;
    }

}
