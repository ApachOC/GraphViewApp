import {Injectable} from "@angular/core";
import {ProjectData} from "../models/project-models";
import {SessionService} from "./session.service";
import {RestProjectsService} from "./rest-projects.service";
import {AlertService} from "./alert.service";

@Injectable({
    providedIn: 'root',
})
export class ProjectManagerService {
    projectList: ProjectData[] = [];
    currentProject: ProjectData;

    constructor(private rest: RestProjectsService,
                private user: SessionService,
                private alerts: AlertService) {
        if (user.authenticated) {
            rest.getActiveProject().then((project) => {
                this.addProject(project, true);
            }, () => {
                this.newProject(true);
            });
        } else {
            this.newProject(true);
        }
    }

    newProject(current?: boolean) {
        const newProj = new ProjectData();
        this.addProject(newProj, current);
    }

    addProject(projectData: ProjectData, current?: boolean) {
        this.projectList.push(projectData);
        if (current) {
            this.currentProject = projectData;
        }
    }

    loadProject(id: string) {
        this.rest.loadProjectData(id).then((project) => {
            this.projectList.push(project);
            this.currentProject = project;
            project.ready = true;
        });
    }

    saveProject(currentProject: ProjectData) {
        this.rest.saveProjectData(currentProject).then(() => {
            this.alerts.pushAlert("info", "Project was saved successfully.")
        }, (e) => {
            let msg = "Couldn't save the project!";
            if (e.status == 409) {
                msg += "\n Project with the same name already exists.";
            }
            this.alerts.pushAlert("danger", msg)
        });
    }
}
