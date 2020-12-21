import {Injectable} from "@angular/core";
import {ProjectData} from "../models/project-models";

@Injectable()
export class RestProjectsService {

    getActiveProject(): Promise<ProjectData> {
        return null;
    }
}
