import {Component, OnInit} from "@angular/core";
import {LibraryObject, RestLibsService} from "../../services/rest-libs.service";

@Component({
    templateUrl: './libs-admin.component.html'
})
export class LibraryAdministrationComponent implements OnInit{
    libraries: LibraryObject[] = [];

    constructor(private rest: RestLibsService) {}

    ngOnInit(): void {
        this.rest.listLibraries().then((libs) => {
            this.libraries = libs;
        });
    }

    addLibrary() {

    }

    deleteLibrary(lib: LibraryObject) {

    }

    editLibrary(lib: LibraryObject) {

    }
}
