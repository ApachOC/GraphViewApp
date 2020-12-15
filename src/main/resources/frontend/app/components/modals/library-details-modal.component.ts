import {Component} from '@angular/core';

import {SessionService} from "../../services/session.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LibraryObject} from "../../services/rest-libs.service";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";

@Component({
    templateUrl: './library-details-modal.component.html'
})
export class LibraryDetailsModalComponent {

    libraryObj = new LibraryObject();
    acceptFiles = "application/java-archive";

    constructor(public modal: NgbActiveModal) {}

    submit() {

    }

    onAddFile($event: NgxDropzoneChangeEvent) {

    }
}

