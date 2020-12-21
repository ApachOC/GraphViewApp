import {Component, OnInit} from "@angular/core";
import {LibraryObject, RestLibsService} from "../../services/rest-libs.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LibraryDetailsModalComponent} from "../modals/library-details-modal.component";
import {ConfirmModalComponent} from "../modals/confirm-modal.component";

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
        this.modal.open(LibraryDetailsModalComponent, {size: "lg"}).result.finally(() => {
            this.loadLibs();
        })
    }

    deleteLibrary(lib: LibraryObject) {
        let modal = this.modal.open(ConfirmModalComponent);
        modal.componentInstance.title = "Confirm deletion";
        modal.componentInstance.message = "Warning!\nThis action is irreversible!\n";
        modal.componentInstance.withInput = "DELETE";
        modal.result.then(() => {
            this.rest.deleteLibrary(lib).finally(() => {
                this.loadLibs();
            });
        });
    }

    editLibrary(lib: LibraryObject) {
        //todo
    }

    private loadLibs() {
        this.rest.listLibraries().then((libs) => {
            this.libraries = libs;
        });
    }
}
