import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRootComponent } from './components/app-root.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginModalComponent } from "./components/modals/login-modal.component";
import {NgbAlertModule, NgbDropdownModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ProjectCreatorComponent} from "./components/projects/project-creator.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {ProjectManagerComponent} from "./components/projects/project-manager.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SortablejsModule} from "ngx-sortablejs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {EditorComponent} from "./components/projects/editor.component";
import {SessionService} from "./services/session.service";
import {XhrInterceptor} from "./other/interceptors";
import {UserDetailsModalComponent} from "./components/modals/user-details-modal.component";
import {RouterModule, Routes} from "@angular/router";
import {AdministrationComponent} from "./components/administration/administration.component";
import {ProjectManagerService} from "./services/project-manager.service";
import {RestUsersService} from "./services/rest-users.service";
import {ConfirmModalComponent} from "./components/modals/confirm-modal.component";
import {UserAdministrationComponent} from "./components/administration/user-admin.component";
import {LibraryAdministrationComponent} from "./components/administration/libs-admin.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {LibraryDetailsModalComponent} from "./components/modals/library-details-modal.component";
import {RestLibsService} from "./services/rest-libs.service";
import {ProjectData} from "./models/project-models";
import {RestProjectsService} from "./services/rest-projects.service";
import {ProjectSelectionModalComponent} from "./components/modals/project-selection-modal.component";
import {EditorViewportD3Component} from "./components/projects/editor-viewport-d3.component";

const routes: Routes = [
    { path: "projects", component: ProjectManagerComponent },
    { path: "administration", component: AdministrationComponent, children: [
            { path: '', redirectTo: 'users', pathMatch: 'full'},
            { path: "users", component: UserAdministrationComponent },
            { path: "libs", component: LibraryAdministrationComponent },
        ], canActivate: [AuthGuardService], data: { role: 'admin' }
    },
    { path: '', redirectTo: '/projects', pathMatch: 'full'},
];

@NgModule({
    declarations: [
        AppRootComponent,
        LoginModalComponent,
        ProjectCreatorComponent,
        ProjectManagerComponent,
        EditorComponent,
        UserDetailsModalComponent,
        AdministrationComponent,
        ConfirmModalComponent,
        UserDetailsModalComponent,
        UserAdministrationComponent,
        LibraryAdministrationComponent,
        LibraryDetailsModalComponent,
        ProjectSelectionModalComponent,
        EditorViewportD3Component
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
        CommonModule,
        RouterModule.forRoot(routes)
    ],
  providers: [
      SessionService,
      ProjectManagerService,
      RestUsersService,
      AuthGuardService,
      RestLibsService,
      RestProjectsService,
      { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }],
  bootstrap: [ AppRootComponent ]
})
export class AppModule { }
