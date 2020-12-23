import {Injectable} from "@angular/core";
import {ProjectData, ProjectRecord} from "../models/project-models";
import {RestBase} from "./rest-base";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable()
export class RestProjectsService extends RestBase{

    getActiveProject(): Promise<ProjectData> {
        return this.http.get<ProjectData>(`${environment.apiUrl}/projects/current`).toPromise();
    }

    listProjects() {
        return this.http.get<ProjectRecord[]>(`${environment.apiUrl}/projects`).toPromise();
    }

    loadProjectData(id: string) {
        return this.http.get<ProjectData>(`${environment.apiUrl}/projects/${id}`)
            .pipe(map(res => Object.assign(new ProjectData(), res)))
            .toPromise();
    }

    saveProjectData(project: ProjectData) {
        return this.http.post(`${environment.apiUrl}/projects`, project).toPromise();
    }
}
