import {Component, Input, OnDestroy, ViewChild} from '@angular/core';

import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
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

    get selectableParameters() {
        return this.predefinedParameters.filter((p1) => !this.libraryObj.parameters.find((p2) => {
            return p1.name == p2.name;
        }))
    }

    private saved = false;

    private predefinedParameters: LibraryParameter[] = [];

    constructor(public modal: NgbActiveModal,
                private modals: NgbModal,
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
                .then(async (result) => {
                    this.libraryObj.id = result.value;
                    this.alerts.pushAlert("success", "Library file was uploaded successfully.");
                    this.predefinedParameters = await this.rest.getLibraryHelp(this.libraryObj.id);
                }, () => {
                    this.alerts.pushAlert("danger", "Error while uploading the library.");
                });
        }
    }

    async newParameter() {
        const parameter = new LibraryParameter();
        const result = await this.updateParameter(parameter);
        if (result) {
            this.libraryObj.parameters.push(parameter);
        }
    }

    updateParameter(parameter: LibraryParameter) {
        const modalRef = this.modals.open(LibraryParameterModalComponent);
        modalRef.componentInstance.parameter = parameter;
        return modalRef.result;
    }

    removeParameter(parameter: LibraryParameter) {
        this.libraryObj.parameters.splice(this.libraryObj.parameters.indexOf(parameter), 1);
    }

    ngOnDestroy(): void {
        if (this.libraryObj.id && !this.saved) {
            this.rest.deleteLibrary(this.libraryObj.id);
        }
    }

    selectParameter(selected: String) {
        this.predefinedParameters.forEach((p) => {
            if (p.name == selected) {
                this.libraryObj.parameters.push(Object.assign(new LibraryParameter(), p));
                return false;
            }
        });
    }
}

@Component({
    template: `<form #form><div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">Parameter details</h4>
        <button type="button" class="close" aria-label="Close" (click)="modal.dismiss()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="name">Parameter name:</label>
                    <input type="text" class="form-control" id="name" name="name"
                           [(ngModel)]="parameter.name" required minlength="4"/>
                </div>
                <div class="form-group">
                    <label for="option">Parameter switch:</label>
                    <input type="text" class="form-control" id="option" name="option"
                           [(ngModel)]="parameter.option" required minlength="2"/>
                </div>
                <div class="form-group">
                    <label for="type">Parameter type:</label>
                    <select class="form-control" id="type" name="type"
                           [(ngModel)]="parameter.type" required>
                        <option>string</option>
                        <option>number</option>
                        <option>normal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mandatory">Is parameter mandatory?</label>
                    <input type="checkbox" class="form-check" id="mandatory" name="mandatory"
                           [(ngModel)]="parameter.mandatory" />
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="(!form.reportValidity()) || modal.close(true)">Confirm</button>
    </div></form>`
})
export class LibraryParameterModalComponent {
    @Input() parameter: LibraryParameter;

    constructor(public modal: NgbActiveModal) {}
}
