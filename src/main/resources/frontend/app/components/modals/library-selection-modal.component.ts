import {Component, Input, OnInit, Optional} from '@angular/core';

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

    parameters: Record<string, string> = {};

    get library() {
        return this.libraryList.find((lib) => lib.id = this.libraryId);
    }

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

        // filter out invalid parameters
        Object.keys(this.parameters)
            .filter(key =>
                this.parameters[key] == null ||
                this.parameters[key].length == 0 ||
                this.library.parameters.findIndex((par) => par.option == key) < 0
            )
            .forEach(key => delete this.parameters[key]);

        // run the selected library
        this.rest.runLibrary(this.project, this.libraryId, this.parameters).then((result) => {
            this.modal.close(result);
        });
    }
}
