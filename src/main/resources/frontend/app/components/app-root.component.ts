import { Component } from '@angular/core';
import {LoginModalComponent} from "./login-modal.component";
import {UserService} from "../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RegistrationModalComponent} from "./registration-modal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent {

  constructor(public user: UserService, public modalService: NgbModal) {

  }

  openLoginDlg() {
    const modalRef = this.modalService.open(LoginModalComponent);
    modalRef.componentInstance.name = 'World';
  }

    openRegDlg() {
      const modalRef = this.modalService.open(RegistrationModalComponent);
      modalRef.componentInstance.name = 'World';
    }

  openPreferences() {
    //todo
  }
}
