import {Component} from '@angular/core';

import {UserObject, UserService} from "../services/user.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: './registration-modal.component.html'
})
export class RegistrationModalComponent {

    userObj = new UserObject();

    constructor(public modal: NgbActiveModal, private user: UserService) {}

    register() {
        this.user.register(this.userObj).then(
            () => {
                this.modal.close();
            }
        );
        return false;
    }
}

