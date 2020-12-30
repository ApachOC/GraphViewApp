import {Component, Input, OnInit} from '@angular/core';

import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {RestProjectsService} from "../../services/rest-projects.service";
import {ProjectData, ProjectRecord} from "../../models/project-models";
import {LibraryObject, RestLibsService} from "../../services/rest-libs.service";

@Component({
    templateUrl: './library-selection-modal.component.html'
})
export class LibrarySelectionModalComponent implements OnInit{

    libraryId: string;

    libraryList: LibraryObject[] = [];

    @Input()
    public project: ProjectData;

    constructor(public modal: NgbActiveModal, private rest: RestLibsService) { }

    ngOnInit(): void {
        this.rest.listLibraries().then((list) => {
            this.libraryList = list
        });
    }

    submit() {
        if (!this.libraryId) {
            return;
        }
        this.rest.runLibrary(this.project, this.libraryId, { }).then((result) => {
            this.modal.close(result);
        });
    }
}
