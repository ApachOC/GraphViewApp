import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    get authenticated(): boolean {
        return this.currentUser != null;
    }

    get isUser(): boolean {
        return this.currentUser && this.currentUser.roles.includes('user');
    }

    get isAdmin(): boolean {
        return this.currentUser && this.currentUser.roles.includes('admin');
    }

    get user():UserObject {
        return this.currentUser;
    }

    private currentUser: UserObject;

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Accept':  'application/json',
        }),
        withCredentials: true,
    };

    constructor(private http: HttpClient) {
        this.http.get<UserObject>(`${environment.apiUrl}/ping`, this.httpOptions);
    }

    login(credentials) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'multipart/form-data',
            }),
            withCredentials: true
        };

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
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Accept':  'application/json'
            })
        };

        this.http.post(`${environment.apiUrl}/logout`, {}, httpOptions).subscribe(() => {
            this.currentUser = null;
        }, (error) => {
            this.currentUser = null;
        });
    }

    register(credentials) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Accept':  'application/json'
            })
        };

        const formData = new FormData();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);
        return this.http.post(`${environment.apiUrl}/user`, formData, httpOptions).toPromise();
    }

    save() {
        return this.update(this.currentUser);
    }

    update(user: UserObject) {
        return this.http.put(`${environment.apiUrl}/user`, user, this.httpOptions).toPromise();
    }
}

export class UserObject {

    username: String;

    password: String;

    email: String;

    displayName: String;

    roles: String[];

    projects: String[];

    get authenticated(): boolean {
        return this.roles.length > 0;
    }

}
