import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {RestBase} from "./rest-base";
import {UserModel} from "../models/user-model";

@Injectable({
    providedIn: 'root',
})
export class RestUsersService extends RestBase {

    listUsers(): Promise<UserModel[]> {
        return this.http.get<UserModel[]>(`${environment.apiUrl}/users`).toPromise();
    }

    addUser(user: UserModel) {
        return this.http.post(`${environment.apiUrl}/users`, user).toPromise();
    }

    updateUser(user: UserModel) {
        return this.http.put(`${environment.apiUrl}/users`, user).toPromise();
    }

    deleteUser(user: UserModel) {
        return this.http.delete(`${environment.apiUrl}/users/${user.username}`).toPromise();
    }

    getUser(): Promise<UserModel> {
        return this.http.get<UserModel>(`${environment.apiUrl}/user`).toPromise()
            .catch(() => { return null });
    }
}

