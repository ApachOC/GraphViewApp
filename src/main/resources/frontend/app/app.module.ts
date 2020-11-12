import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './components/app-root/app-root.component';
import { HttpClientModule } from "@angular/common/http";
import { LoginModalComponent } from "./components/login-modal/login-modal.component";
import {NgbAlertModule, NgbDropdownModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ProjectCreatorComponent} from "./components/project-manager/project-creator.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {ProjectManagerComponent} from "./components/project-manager/project-manager.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SortablejsModule} from "ngx-sortablejs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GraphEditorComponent} from "./components/project-manager/graph-editor.component";

@NgModule({
  declarations: [
      AppRootComponent,
      LoginModalComponent,
      ProjectCreatorComponent,
      ProjectManagerComponent,
      GraphEditorComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
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
  providers: [],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
