import {Component} from '@angular/core';

import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LibraryObject, LibraryParameter, RestLibsService} from "../../services/rest-libs.service";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";

@Component({
    templateUrl: './library-details-modal.component.html'
})
export class LibraryDetailsModalComponent {

    libraryObj = new LibraryObject();

    acceptFiles = "application/x-java-archive,application/java-archive";

    libraryFile: File;

    constructor(public modal: NgbActiveModal, private rest: RestLibsService) {}

    submit() {
        this.rest.addLibrary(this.libraryObj, this.libraryFile).then(() => {
            this.modal.close(true);
        });
    }

    onAddFile(event: NgxDropzoneChangeEvent) {
        if (event.addedFiles.length > 0) {
            this.libraryFile = event.addedFiles.pop();
        }
    }

    newParameter() {
        this.libraryObj.parameters.push(new LibraryParameter());
    }

    removeParameter(parameter: LibraryParameter) {
        this.libraryObj.parameters.splice(this.libraryObj.parameters.indexOf(parameter), 1);
    }
}

