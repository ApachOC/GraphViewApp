import {Component} from '@angular/core';

import {UserService} from "../../services/user.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'login-modal-content',
    templateUrl: './login-modal.component.html'
})
export class LoginModalComponent {

    credentials = {username: '', password: ''};

    showAlert = false;

    alertText = "Error during login";

    constructor(public modal: NgbActiveModal, private user: UserService) {}

    login() {
        this.user.login(this.credentials).subscribe(
            () => this.showAlert = false,
            () => this.showAlert = true
        );
        return false;
    }

    register() {
        this.user.register(this.credentials);
    }
}

