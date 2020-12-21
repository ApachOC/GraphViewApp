import {Component, Input} from '@angular/core';
import {ProjectManagerService} from "../../services/project-manager.service";
import {ProjectData} from "../../models/project-models";
import {SessionService} from "../../services/session.service";

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

    constructor(private mgr: ProjectManagerService, private user: SessionService) {
    }

    newProject() {
        this.mgr.newProject();
    }

    saveProject() {

    }

    loadProject() {

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
