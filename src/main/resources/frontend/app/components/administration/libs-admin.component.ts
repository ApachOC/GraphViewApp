import {Component, OnInit} from "@angular/core";
import {LibraryObject, RestLibsService} from "../../services/rest-libs.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LibraryDetailsModalComponent} from "../modals/library-details-modal.component";

@Component({
    templateUrl: './libs-admin.component.html'
})
export class LibraryAdministrationComponent implements OnInit{
    libraries: LibraryObject[] = [];

    constructor(private rest: RestLibsService, private modal: NgbModal) {}

    ngOnInit(): void {
        this.loadLibs();
    }

    addLibrary() {
        this.modal.open(LibraryDetailsModalComponent, {size: "lg"}).result.then(() => {
            this.loadLibs();
        })
    }

    deleteLibrary(lib: LibraryObject) {

    }

    editLibrary(lib: LibraryObject) {

    }

    private loadLibs() {
        this.rest.listLibraries().then((libs) => {
            this.libraries = libs;
        });
    }
}
