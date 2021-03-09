import {Injectable} from "@angular/core";
import {RestBase} from "./rest-base";
import {environment} from "../../environments/environment";
import {ProjectData} from "../models/project-models";

@Injectable({
    providedIn: 'root',
})
export class RestLibsService extends RestBase {

    listLibraries(): Promise<LibraryObject[]> {
        return this.http.get<LibraryObject[]>(`${environment.apiUrl}/libs`).toPromise();
    }

    getLibrary(id: string): Promise<LibraryObject> {
        return this.http.get<LibraryObject>(`${environment.apiUrl}/libs/${id}`).toPromise();
    }

    getLibraryHelp(id: string): Promise<LibraryParameter[]> {
        return this.http.get<LibraryParameter[]>(`${environment.apiUrl}/libs/${id}/help`).toPromise();
    }


    addLibraryFile(file: File): Promise<{value: string}> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{value: string}>(`${environment.apiUrl}/libs`, formData).toPromise();
    }

    addLibraryModel(lib: LibraryObject) {
        return this.http.post(`${environment.apiUrl}/libs/${lib.id}`, lib).toPromise();
    }

    deleteLibrary(id: string) {
        return this.http.delete(`${environment.apiUrl}/libs/${id}`).toPromise();
    }

    runLibrary(project: ProjectData, libId: string, args: Record<string, string>): Promise<LibraryResults> {
        return this.http.post<LibraryResults>(`${environment.apiUrl}/libs/${libId}/run`, {
            project: project,
            args: args
        }).toPromise();
    }
}

export class LibraryObject {
    id: string = '';
    name: string = '';
    description: string = '';
    parameters: LibraryParameter[] = [];
}

export class LibraryParameter {
    name: string;
    option: string;
    description: string;
    type: LibraryParameterType;
    mandatory: boolean;

    constructor(init?:Partial<LibraryParameter>) {
        Object.assign(this, init);
    }
}

export class LibraryResults {
    nodeLabels: string[]
    edgeLabels: string[]
    nodeResults: Record<string, string[]>
    edgeResults: Record<string, string[]>
}

export enum LibraryParameterType {
    String,
    Integer,
    Float
}
