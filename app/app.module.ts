import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular7-data-table';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AddUserComponent } from './user-dashboard/add-user/add-user.component';
import { ViewUserComponent } from './user-dashboard/view-user/view-user.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ViewProjectComponent } from './project-dashboard/view-project/view-project.component';
import { AddProjectComponent } from './project-dashboard/add-project/add-project.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserDashboardComponent,
    AddUserComponent,
    ViewUserComponent,
    ProjectDashboardComponent,
    ViewProjectComponent,
    AddProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    DataTableModule.forRoot(),
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }