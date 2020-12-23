import {Component} from '@angular/core';
import {ProjectManagerService} from "../../services/project-manager.service";
import {ProjectData} from "../../models/project-models";
import {SessionService} from "../../services/session.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectSelectionModalComponent} from "../modals/project-selection-modal.component";

@Component({
    templateUrl: './project-manager.component.html'
})
export class ProjectManagerComponent {

    get projects() : ProjectData[] {
        return this.mgr.projectList;
    }

    get currentProject(): ProjectData {
        return this.mgr.current;
    };

    set currentProject(project) {
        this.mgr.current = project;
    }

    constructor(private mgr: ProjectManagerService, public user: SessionService, private modals: NgbModal) { }

    newProject() {
        this.mgr.newProject();
    }

    saveProject() {
        this.mgr.saveProject(this.currentProject);
    }

    loadProject() {
        this.modals.open(ProjectSelectionModalComponent).result
            .then((id) => {
                this.mgr.loadProject(id);
            });
    }

    closeProject(project: ProjectData) {
        if (this.projects.length > 0) {
            this.projects.splice(this.projects.indexOf(project), 1);
            if (this.currentProject == project) {
                this.currentProject = this.projects[0];
            }
        }
    }
}
