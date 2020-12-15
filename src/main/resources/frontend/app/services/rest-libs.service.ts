import {Injectable} from "@angular/core";
import {RestBase} from "./rest-base";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class RestLibsService extends RestBase {

    listLibraries(): Promise<LibraryObject[]> {
        return this.http.get<LibraryObject[]>(`${environment.apiUrl}/libs`).toPromise();
    }

    addLibrary(lib: LibraryObject) {
        return this.http.post(`${environment.apiUrl}/libs`, lib).toPromise();
    }

    updateLibrary(lib: LibraryObject) {
        return this.http.put(`${environment.apiUrl}/libs`, lib).toPromise();
    }

    deleteLibrary(lib: LibraryObject) {
        return this.http.delete(`${environment.apiUrl}/libs/${lib.id}`).toPromise();
    }
}

export class LibraryObject {
    id: string;
    name: string;
    description: string;
    parameters: LibraryParameter[];
}

export class LibraryParameter {
    option: string;
    defaultValue: string | number;
    type: LibraryParameterType;
}

export enum LibraryParameterType {
    String,
    Integer,
    Float
}
