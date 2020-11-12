import { Component } from '@angular/core';
import {LoginModalComponent} from "../login-modal/login-modal.component";
import {UserService} from "../../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent {

  constructor(public user: UserService, public modalService: NgbModal) {

  }

  authenticated() {
    return this.user.authenticated;
  }

  logout() {
    this.user.logout();
  }

  openLoginDlg() {
    const modalRef = this.modalService.open(LoginModalComponent);
    modalRef.componentInstance.name = 'World';
  }
}
