import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RestUsersService} from "./rest-users.service";
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class SessionService {

    get authenticated(): boolean {
        return this.currentUser != null;
    }

    get isUser(): boolean {
        return this.currentUser && this.currentUser.roles.includes('user');
    }

    get isAdmin(): boolean {
        return this.currentUser && this.currentUser.roles.includes('admin');
    }

    get user(): UserObject {
        return this.currentUser;
    }

    private currentUser: UserObject;

    constructor(private mgmt: RestUsersService,
                private http: HttpClient,
                private router: Router) {
        mgmt.getUser().then((user) => this.currentUser = user)
    }

    login(credentials) {
        const formData = new FormData();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);
        const request = this.http.post<UserObject>(`${environment.apiUrl}/login`, formData).toPromise();
        request.then((userObj) => {
            this.currentUser = userObj;
        }, () => {
            this.currentUser = null;
        });
        return request;
    }

    logout() {
        this.http.post(`${environment.apiUrl}/logout`, {}).subscribe(() => {
            this.currentUser = null;
        }, (error) => {
            this.currentUser = null;
        });
        this.router.navigateByUrl("/");
    }

    register(user: UserObject) {
        return this.mgmt.addUser(user);
    }

    save() {
        return this.mgmt.updateUser(this.currentUser);
    }
}

export class UserObject {

    username: String;

    password: String;

    email: String;

    displayName: String;

    roles: String[] = [];

    get authenticated(): boolean {
        return this.roles.length > 0;
    }

}
