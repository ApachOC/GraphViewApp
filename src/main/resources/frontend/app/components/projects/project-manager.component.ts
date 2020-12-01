import {Component, Input} from '@angular/core';
import {ProjectData, ProjectManagerService} from "../../services/project-manager.service";

@Component({
    templateUrl: './project-manager.component.html'
})
export class ProjectManagerComponent {

    constructor(private mgr: ProjectManagerService) {
        if (!this.currentProject) {
            mgr.addProject(this.newProject())
            this.currentProject = this.projects[0];
        }
    }

    get projects() : ProjectData[] {
        return this.mgr.projectList;
    }

    get currentProject(): ProjectData {
        return this.mgr.current;
    };

    set currentProject(project) {
        this.mgr.current = project;
    }

    newProject() {
        const defaultName = 'Untitled project'

        let count = 0;
        this.projects.forEach(prj => {
            if (prj.title.startsWith(defaultName)) {
                count++;
            }
        });

        this.currentProject = new ProjectData(
            count ? `${defaultName}  (${count})` : defaultName
        );

        return this.currentProject;
    }
}
