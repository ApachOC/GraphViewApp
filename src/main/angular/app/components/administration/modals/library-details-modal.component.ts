import {Component, OnDestroy} from '@angular/core';

import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LibraryObject, LibraryParameter, RestLibsService} from "../../../services/rest-libs.service";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import {AlertService} from "../../../services/alert.service";

@Component({
    templateUrl: './library-details-modal.component.html'
})
export class LibraryDetailsModalComponent implements OnDestroy{

    libraryObj = new LibraryObject();

    acceptFiles = "application/x-java-archive,application/java-archive";

    predefinedArguments: Record<string, string>;

    saved = false;

    constructor(public modal: NgbActiveModal,
                private rest: RestLibsService,
                private alerts: AlertService) {}

    submit() {
        this.rest.addLibraryModel(this.libraryObj).then(() => {
            this.saved = true;
            this.modal.close(this.saved);
        });
    }

    onAddFile(event: NgxDropzoneChangeEvent) {
        if (event.addedFiles.length > 0) {
            this.rest.addLibraryFile(event.addedFiles.pop())
                .then((result) => {
                    this.libraryObj.id = result.value;
                    this.alerts.pushAlert("success", "Library file was uploaded successfully.");
                    this.getHelp();
                }, () => {
                    this.alerts.pushAlert("danger", "Error while uploding the library.");
                });
        }
    }

    async getHelp() {
        this.predefinedArguments = await this.rest.getLibraryHelp(this.libraryObj.id);
        //todo populate some list
    }

    newParameter() {
        this.libraryObj.parameters.push(new LibraryParameter());
    }

    removeParameter(parameter: LibraryParameter) {
        this.libraryObj.parameters.splice(this.libraryObj.parameters.indexOf(parameter), 1);
    }

    ngOnDestroy(): void {
        if (this.libraryObj.id && !this.saved) {
            this.rest.deleteLibrary(this.libraryObj.id);
        }
    }
}

