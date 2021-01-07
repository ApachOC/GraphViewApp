import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RestBase} from "./rest-base";
import {RestUsersService} from "./rest-users.service";
import {Alert, AlertService} from "./alert.service";

@Injectable({
    providedIn: 'root',
})
export class SessionService extends RestBase {

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

    constructor(private mgmt: RestUsersService, protected http: HttpClient) {
        super(http);
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
