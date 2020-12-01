import {Component} from '@angular/core';

import {SessionService} from "../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: './login-modal.component.html'
})
export class LoginModalComponent {

    credentials = {username: '', password: ''};

    showAlert = false;

    alertText = "Error during login";

    constructor(public modal: NgbActiveModal, private user: SessionService) {}

    login() {
        this.user.login(this.credentials).then(
            () => {
                this.modal.close();
            },
            () => this.showAlert = true
        );
        return false;
    }
}

