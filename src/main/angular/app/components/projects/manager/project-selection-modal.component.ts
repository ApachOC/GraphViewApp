import {Component, Input, OnInit} from '@angular/core';

import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {RestProjectsService} from "../../../services/rest-projects.service";
import {ProjectRecord} from "../../../models/project-models";

@Component({
    templateUrl: './project-selection-modal.component.html'
})
export class ProjectSelectionModalComponent implements OnInit{

    projectId: string;

    projects: ProjectRecord[] = [];

    @Input()
    exclude: string[] = [];

    constructor(public modal: NgbActiveModal, private rest: RestProjectsService) { }

    ngOnInit(): void {
        this.rest.listProjects().then((list) => {
            this.projects = list.filter((record) => {
                return !(this.exclude.includes(record.id));
            });
        });
    }

    submit() {
        if (!this.projectId) {
            return;
        }
        this.modal.close(this.projectId);
    }

}
