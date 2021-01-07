import {Component, Input} from '@angular/core';

import {SessionService} from "../../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {

    @Input()
    public title: string;

    @Input()
    public message: string;

    @Input()
    public withInput: string;

    public inputText = '';

    constructor(public modal: NgbActiveModal) {

    }

    submit() {
        if (this.withInput) {
            if (this.inputText !== this.withInput) {
                return;
            }
        }
        this.modal.close();
    }

}

