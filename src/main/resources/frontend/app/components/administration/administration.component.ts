import {Component, OnInit} from "@angular/core";
import {UserObject} from "../../services/session.service";
import {RestUsersService} from "../../services/rest-users.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "../modals/confirm-modal.component";
import {UserDetailsModalComponent} from "../modals/user-details-modal.component";

@Component({
    templateUrl: './administration.component.html'
})
export class AdministrationComponent implements OnInit {

    users: UserObject[] = [];

    constructor(private rest: RestUsersService, private modalService: NgbModal) { }

    ngOnInit(): void {
        this.getUserList();
    }

    private getUserList() {
        this.rest.listUsers().then((list) => {
            this.users = list;
        })
    }

    addUser() {

    }

    deleteUser(user: UserObject) {
        let modal = this.modalService.open(ConfirmModalComponent);
        modal.componentInstance.title = "Confirm deletion";
        modal.componentInstance.message = "Warning!\nThis action is irreversible!\n";
        modal.componentInstance.withInput = "DELETE";
        modal.result.then((result) => {
            this.rest.deleteUser(user).then(() => {
                this.getUserList();
            });
        });
    }

    editUser(user: UserObject) {
        let modal = this.modalService.open(UserDetailsModalComponent);
        modal.componentInstance.userObj = user;
        modal.result.then(() => {
            this.getUserList();
        })
    }
}
