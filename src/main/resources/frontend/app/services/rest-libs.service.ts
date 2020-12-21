import {Injectable} from "@angular/core";
import {RestBase} from "./rest-base";
import {environment} from "../../environments/environment";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class RestLibsService extends RestBase {

    listLibraries(): Promise<LibraryObject[]> {
        return this.http.get<LibraryObject[]>(`${environment.apiUrl}/libs`).toPromise();
    }

    addLibrary(lib: LibraryObject, file: File) {
        //const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(lib));

        return this.http.post(`${environment.apiUrl}/libs`, formData).toPromise();
    }

    updateLibrary(lib: LibraryObject) {
        return this.http.put(`${environment.apiUrl}/libs`, lib).toPromise();
    }

    deleteLibrary(lib: LibraryObject) {
        return this.http.delete(`${environment.apiUrl}/libs/${lib.id}`).toPromise();
    }
}

export class LibraryObject {
    id: string = '';
    name: string = '';
    description: string = '';
    parameters: LibraryParameter[] = [];
    nodeInputArg: string = '';
    edgeInputArg: string = '';
    inputFileType: string = '';
    outputArg: string = '';
    outputFileType: string = '';
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
