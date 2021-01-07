export class UserModel {

    username: String;

    password: String;

    email: String;

    displayName: String;

    roles: String[] = [];

    get authenticated(): boolean {
        return this.roles.length > 0;
    }
}
