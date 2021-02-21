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

    getLibraryHelp(id: string): Promise<Record<string, string>> {
        return this.http.get<Record<string, string>>(`${environment.apiUrl}/libs/${id}/help`).toPromise();
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

    runLibrary(project: ProjectData, libId: string, args: Record<string, string>): Promise<Record<string, number>> {
        return this.http.post<Record<string, number>>(`${environment.apiUrl}/libs/${libId}/run`, {
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
    defaultValue: string | number;
    type: LibraryParameterType;
    mandatory: boolean;

    constructor(init?:Partial<LibraryParameter>) {
        Object.assign(this, init);
    }
}

export enum LibraryParameterType {
    String,
    Integer,
    Float
}
