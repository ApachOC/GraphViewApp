import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export abstract class RestBase {

    protected defaultHttpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Accept':  'application/json',
        }),
        withCredentials: true,
    };

    constructor(protected http: HttpClient) { }
}
