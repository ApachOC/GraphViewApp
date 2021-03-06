import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {SessionService} from "../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserModel} from "../../models/user-model";
import {AlertService} from "../../services/alert.service";

@Component({
    templateUrl: './user-details-modal.component.html'
})
export class UserDetailsModalComponent {

    @Input()
    userObj = new UserModel();

    @Input()
    update = false;

    @Input()
    title = "Register a new account";

    constructor(public modal: NgbActiveModal, public user: SessionService, private alerts: AlertService) {}

    submit() {
        let promise: Promise<Object>;
        if (this.update) {
            promise = this.user.save(this.userObj);
        } else {
            promise = this.user.register(this.userObj);
        }
        promise.then(() => {
            this.modal.close();
            this.alerts.pushAlert("success", "Registration request sent!");
            this.alerts.pushAlert("info", "You will be able to login once the administrator reviews the request.")
        }).catch((e) => {
            if (e.status == 409) {
                this.alerts.pushAlert("danger", "Error, user already exists!");
            } else {
                this.alerts.pushAlert("danger", "Error during registration!");
            }
        });
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

