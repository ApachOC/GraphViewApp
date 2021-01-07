import {Injectable} from "@angular/core";
import {UserObject} from "./session.service";
import {environment} from "../../environments/environment";
import {RestBase} from "./rest-base";

@Injectable({
    providedIn: 'root',
})
export class RestUsersService extends RestBase {

    listUsers(): Promise<UserObject[]> {
        return this.http.get<UserObject[]>(`${environment.apiUrl}/users`).toPromise();
    }

    addUser(user: UserObject) {
        return this.http.post(`${environment.apiUrl}/users`, user).toPromise();
    }

    updateUser(user: UserObject) {
        return this.http.put(`${environment.apiUrl}/users`, user).toPromise();
    }

    deleteUser(user: UserObject) {
        return this.http.delete(`${environment.apiUrl}/users/${user.username}`).toPromise();
    }

    getUser(): Promise<UserObject> {
        return this.http.get<UserObject>(`${environment.apiUrl}/user`).toPromise()
            .catch((e) => { return null });
    }
}

