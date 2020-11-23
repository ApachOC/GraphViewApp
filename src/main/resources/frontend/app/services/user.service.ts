import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    get authenticated(): boolean {
        return this.userObject != null;
    }

    get isUser(): boolean {
        return this.userObject && this.userObject.roles.includes('user');
    }

    get isAdmin(): boolean {
        return this.userObject && this.userObject.roles.includes('admin');
    }

    get user():UserObject {
        return this.userObject;
    }

    private userObject: UserObject;

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Accept':  'application/json',
        }),
        withCredentials: true,
    };

    constructor(private http: HttpClient) {
        this.getCurrentUser();
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
        const request = this.http.post(`${environment.apiUrl}/login`, formData).toPromise();
        request.then(() => {
            this.getCurrentUser();
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
            this.userObject = null;
        }, (error) => {
            this.userObject = null;
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

    getCurrentUser() {
        this.http.get<UserObject>(`${environment.apiUrl}/user`, this.httpOptions).subscribe((user) => {
            this.userObject = user;
        });
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
