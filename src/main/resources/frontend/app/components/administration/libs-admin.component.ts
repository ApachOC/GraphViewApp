import {Component, OnInit} from "@angular/core";
import {UserObject} from "../../services/session.service";
import {RestUsersService} from "../../services/rest-users.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "../modals/confirm-modal.component";
import {UserDetailsModalComponent} from "../modals/user-details-modal.component";

@Component({
    templateUrl: './libs-admin.component.html'
})
export class LibraryAdministrationComponent {

}
