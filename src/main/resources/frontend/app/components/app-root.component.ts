import { Component } from '@angular/core';
import {LoginModalComponent} from "./modals/login-modal.component";
import {SessionService} from "../services/session.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserDetailsModalComponent} from "./modals/user-details-modal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent {

  constructor(public user: SessionService, public modalService: NgbModal) {

  }

  openLoginDlg() {
    const modalRef = this.modalService.open(LoginModalComponent);
    modalRef.componentInstance.name = 'World';
  }

  openRegDlg() {
    const modalRef = this.modalService.open(UserDetailsModalComponent);
    modalRef.componentInstance.name = 'World';
  }
}
