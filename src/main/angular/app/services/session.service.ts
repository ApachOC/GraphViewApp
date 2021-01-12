import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RestUsersService} from "./rest-users.service";
import {Router} from '@angular/router';
import {UserModel} from "../models/user-model";

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

    get user(): UserModel {
        return this.currentUser;
    }

    private currentUser: UserModel;

    constructor(private mgmt: RestUsersService,
                private http: HttpClient,
                private router: Router) {
        mgmt.getUser().then((user) => this.currentUser = user)
    }

    login(credentials) {
        const formData = new FormData();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);
        const request = this.http.post<UserModel>(`${environment.apiUrl}/login`, formData).toPromise();
        request.then((userObj) => {
            this.currentUser = userObj;
        }, () => {
            this.currentUser = null;
        });
        return request;
    }

    logout() {
        this.http.post(`${environment.apiUrl}/logout`, {}).toPromise().finally(() => {
            this.mgmt.getUser().then((user) => this.currentUser = user);
            this.router.navigateByUrl("/");
        });
    }

    register(user: UserModel) {
        return this.mgmt.addUser(user);
    }

    save(user: UserModel) {
        return this.mgmt.updateUser(user);
    }
}
