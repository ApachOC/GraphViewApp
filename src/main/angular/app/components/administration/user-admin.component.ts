import {Component, OnInit} from "@angular/core";
import {RestUsersService} from "../../services/rest-users.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "./modals/confirm-modal.component";
import {UserDetailsModalComponent} from "../generic/user-details-modal.component";
import {UserModel} from "../../models/user-model";

@Component({
    templateUrl: './user-admin.component.html'
})
export class UserAdministrationComponent implements OnInit {

    users: UserModel[] = [];

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
        let modal = this.modalService.open(UserDetailsModalComponent);
        modal.result.then(() => {
            this.getUserList();
        });
    }

    deleteUser(user: UserModel) {
        let modal = this.modalService.open(ConfirmModalComponent);
        modal.componentInstance.title = "Confirm deletion";
        modal.componentInstance.message = "Warning!\nThis action is irreversible!\n";
        modal.componentInstance.withInput = "DELETE";
        modal.result.then(() => {
            this.rest.deleteUser(user).then(() => {
                this.getUserList();
            });
        });
    }

    editUser(user: UserModel) {
        let modal = this.modalService.open(UserDetailsModalComponent);
        modal.componentInstance.update = true;
        modal.componentInstance.title = "Update user info";
        modal.componentInstance.userObj = { ...user };
        modal.componentInstance.userObj.roles = Object.assign([], user.roles);
        modal.result.then(() => {
            this.getUserList();
        });
    }
}
