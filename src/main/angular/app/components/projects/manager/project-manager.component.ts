import {Component} from '@angular/core';
import {ProjectManagerService} from "../../../services/project-manager.service";
import {ProjectData} from "../../../models/project-models";
import {SessionService} from "../../../services/session.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectSelectionModalComponent} from "./project-selection-modal.component";
import {TextPromptModalComponent} from "../../generic/text-prompt-modal.component";
import {ProjectSaverService} from "../../../services/project-saver.service";

@Component({
    templateUrl: './project-manager.component.html'
})
export class ProjectManagerComponent {

    get projects() : ProjectData[] {
        return this.mgr.projectList;
    }

    get currentProject(): ProjectData {
        return this.mgr.currentProject;
    };

    set currentProject(project) {
        this.mgr.currentProject = project;
    }

    constructor(private mgr: ProjectManagerService,
                public user: SessionService,
                private modals: NgbModal,
                public saver: ProjectSaverService) { }

    newProject() {
        this.mgr.newProject(true);
    }

    saveProject() {
        this.mgr.saveProject(this.currentProject);
    }

    loadProject() {
        const modal = this.modals.open(ProjectSelectionModalComponent);
        modal.componentInstance.exclude = this.projects.map<string>((project) => project.id);
        modal.result
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

    renameProject() {
        const modal = this.modals.open(TextPromptModalComponent);
        modal.componentInstance.title = "Rename project";
        modal.componentInstance.label = "Project title";
        modal.componentInstance.value = this.currentProject.title;
        modal.result.then((newTitle) => {
            this.currentProject.title = newTitle;
        });
    }

    getProjectTitle(project: ProjectData) {
        let thisTitle = project.title?.trim();
        if (!thisTitle || !thisTitle.length) {
            thisTitle = "Untitled project";
        } else {
            let count = 0;
            for (let p of this.projects) {
                if (p == project) {
                    break;
                }
                if (p.title == project.title) {
                    count++;
                }
            }

            if (count > 0) {
                thisTitle += ` (${count})`
            }
        }
        return thisTitle;
    }
}
