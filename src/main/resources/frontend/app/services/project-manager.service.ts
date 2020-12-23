import {Injectable} from "@angular/core";
import {ProjectData} from "../models/project-models";
import {SessionService} from "./session.service";
import {RestProjectsService} from "./rest-projects.service";

@Injectable({
    providedIn: 'root',
})
export class ProjectManagerService {
    projectList: ProjectData[] = [];
    current: ProjectData;

    constructor(private rest: RestProjectsService, private user: SessionService) {
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
        const defaultName = 'Untitled project'

        let count = 0;
        this.projectList.forEach(prj => {
            if (prj.title.startsWith(defaultName)) {
                count++;
            }
        });

        const newProj = new ProjectData();
        newProj.title = count ? `${defaultName}  (${count})` : defaultName;
        this.addProject(newProj, current);
    }

    addProject(projectData: ProjectData, current?: boolean) {
        this.projectList.push(projectData);
        if (current) {
            this.current = projectData;
        }
    }

    loadProject(id: string) {
        this.rest.loadProjectData(id).then((project) => {
            this.projectList.push(project);
            this.current = project;
            project.ready = true;
        });
    }

    saveProject(currentProject: ProjectData) {
        this.rest.saveProjectData(currentProject);
    }
}
