import {Component, Input} from '@angular/core';

import {SessionService} from "../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    template: `<div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">{{title}}</h4>
        <button type="button" class="close" aria-label="Close" (click)="modal.dismiss()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label for="input">{{label}}:</label>
            <input type="text" class="form-control" id="input" name="username" [(ngModel)]="value"/>
        </div>
    </div>
    <div class="modal-footer">
        <button type="submit" class="btn btn-primary" (click)="modal.close(value)">Submit</button>
        <button type="button" class="btn btn-outline-dark" (click)="modal.dismiss()">Cancel</button>
    </div>`
})
export class TextPromptModalComponent {

    @Input()
    title = "";

    @Input()
    label = "";

    value = "";

    constructor(public modal: NgbActiveModal) {}

}

