import {Component, Input} from '@angular/core';

import {UserObject, SessionService} from "../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: './user-details-modal.component.html'
})
export class UserDetailsModalComponent {

    @Input()
    userObj = new UserObject();

    @Input()
    title = "Register a new account";

    constructor(public modal: NgbActiveModal, public user: SessionService) {}

    submit() {
        this.user.register(this.userObj).then(
            () => {
                this.modal.close();
            }
        );
        return false;
    }
}

