import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    get authenticated(): boolean {
        return (this.userObject && this.userObject.authenticated) || false;
    }

    get isUser(): boolean {
        return this.userObject && this.userObject.roles.includes('user');
    }

    get isAdmin(): boolean {
        return this.userObject && this.userObject.roles.includes('admin');
    }

    private userObject: UserObject;

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Accept':  'application/json',
        }),
        withCredentials: true,
    };

    constructor(private http: HttpClient) { }

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
        const request = this.http.post('http://localhost:8080/api/login', formData).toPromise();
        request.then(() => {
            this.getUser();
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

        this.http.post('http://localhost:8080/api/logout', {}, httpOptions).subscribe(() => {
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
        return this.http.post('http://localhost:8080/api/user', formData, httpOptions);
    }

    getUser() {
        return this.http.get<UserObject>('http://localhost:8080/api/user', this.httpOptions).subscribe((user) => {
            this.userObject = user;
        });
    }
}

export class UserObject {

    public username: String;

    public password: String;

    public email: String;

    public displayName: String;

    public roles: String[];

    public projects: String[];

    public get authenticated(): boolean {
        return this.roles.length > 0;
    }

}
