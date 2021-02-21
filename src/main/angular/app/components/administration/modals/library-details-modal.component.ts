import {Component, OnDestroy, ViewChild} from '@angular/core';

import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {LibraryObject, LibraryParameter, RestLibsService} from "../../../services/rest-libs.service";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";
import {AlertService} from "../../../services/alert.service";
import {NgModel} from "@angular/forms";

@Component({
    templateUrl: './library-details-modal.component.html'
})
export class LibraryDetailsModalComponent implements OnDestroy{

    libraryObj = new LibraryObject();

    acceptFiles = ".jar,application/x-java-archive,application/java-archive";

    predefinedArguments: Record<string, string>;

    saved = false;

    @ViewChild("name") nameModel: NgModel;

    @ViewChild("description") descModel: NgModel;

    constructor(public modal: NgbActiveModal,
                private rest: RestLibsService,
                private alerts: AlertService) {}

    submit() {
        if (this.invalid()) {
            return;
        }
        this.rest.addLibraryModel(this.libraryObj).then(() => {
            this.saved = true;
            this.modal.close(this.saved);
        });
    }

    onAddFile(event: NgxDropzoneChangeEvent) {
        if (event.addedFiles.length > 0) {
            this.rest.addLibraryFile(event.addedFiles.pop())
                .then(async (result) => {
                    this.libraryObj.id = result.value;
                    this.alerts.pushAlert("success", "Library file was uploaded successfully.");
                    this.predefinedArguments = await this.rest.getLibraryHelp(this.libraryObj.id);
                }, () => {
                    this.alerts.pushAlert("danger", "Error while uploading the library.");
                });
        }
    }

    newParameter() {
        this.libraryObj.parameters.push(new LibraryParameter());
    }

    removeParameter(parameter: LibraryParameter) {
        this.libraryObj.parameters.splice(this.libraryObj.parameters.indexOf(parameter), 1);
    }

    invalid() {
        return !this.libraryObj.id  || this.nameModel?.invalid || this.descModel?.invalid || false;
    }

    ngOnDestroy(): void {
        if (this.libraryObj.id && !this.saved) {
            this.rest.deleteLibrary(this.libraryObj.id);
        }
    }
}

