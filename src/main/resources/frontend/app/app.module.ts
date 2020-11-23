import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRootComponent } from './components/app-root.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginModalComponent } from "./components/login-modal.component";
import {NgbAlertModule, NgbDropdownModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ProjectCreatorComponent} from "./components/project-creator.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {ProjectManagerComponent} from "./components/project-manager.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SortablejsModule} from "ngx-sortablejs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GraphEditorComponent} from "./components/graph-editor.component";
import {UserService} from "./services/user.service";
import {XhrInterceptor} from "./other/interceptors";
import {RegistrationModalComponent} from "./components/registration-modal.component";

@NgModule({
  declarations: [
      AppRootComponent,
      LoginModalComponent,
      ProjectCreatorComponent,
      ProjectManagerComponent,
      GraphEditorComponent,
      RegistrationModalComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgbAlertModule,
        NgbDropdownModule,
        NgxDropzoneModule,
        BrowserAnimationsModule,
        NgbModule,
        SortablejsModule,
        CommonModule
    ],
  providers: [UserService ,{ provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
