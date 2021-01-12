import { SessionService} from "./session.service";
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private session: SessionService, private _router: Router) {
    }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        await this.session.authenticate().then()
        if (this.session.authenticated && this.session.user.roles.includes(next.data.role)) {
            return true;
        }
        await this._router.navigate(['/']);
        return false;
    }

}
