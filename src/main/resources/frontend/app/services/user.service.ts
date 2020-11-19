import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    get authenticated(): boolean {
        return (this.userObject && this.userObject.authenticated) || false;
    }

    get isUser(): boolean {
        return this.userObject && this.userObject.authorities
            .map(auth => {return auth.authority})
            .includes('ROLE_USER');
    }

    get isAdmin(): boolean {
        return this.userObject && this.userObject.authorities
            .map(auth => {return auth.authority})
            .includes('ROLE_ADMIN');
    }

    private userObject: any;

    constructor(private http: HttpClient) { }

    authenticate(credentials, callback, error) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Accept':  'application/json',
                'Authorization': 'Basic ' + btoa(
                    `${credentials.username}:${credentials.password}`
                )
            })
        };

        this.http.get('http://localhost:8080/api/login', httpOptions).subscribe(response => {
            if (response['name']) {
                this.userObject = response;
            } else {
                this.userObject = null;
                error();
            }
            return callback && callback();
        }, error);
    }

    logout() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Accept':  'application/json',
                'Authorization': 'Basic ' + btoa(
                    `user:pass`
                )
            })
        };

        this.http.post('http://localhost:8080/logout', {}, httpOptions).subscribe(() => {
            this.userObject = null;
        }, (error) => {
            this.userObject = null;
        });
    }
}
