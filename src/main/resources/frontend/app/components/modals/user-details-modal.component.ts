import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {UserObject, SessionService} from "../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: './user-details-modal.component.html'
})
export class UserDetailsModalComponent {

    @Input()
    userObj = new UserObject();

    @Input()
    update = false;

    @Input()
    title = "Register a new account";

    constructor(public modal: NgbActiveModal, public user: SessionService) {}

    submit() {
        let promise: Promise<Object>;
        if (this.update) {
            promise = this.user.save();
        } else {
            promise = this.user.register(this.userObj);
        }
        promise.then(() => { this.modal.close(); } );
    }

    removeRole(role: String) {
        this.userObj.roles.splice(this.userObj.roles.indexOf(role), 1);
    }

    selectRole(value) {
        if (!this.userObj.roles.includes(value)) {
            this.userObj.roles.push(value);
        }
    }
}

