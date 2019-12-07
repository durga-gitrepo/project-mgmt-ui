import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectDashboardComponent} from './project-dashboard/project-dashboard.component';

const routes: Routes = [
  {
    path: 'userDashboard',
    component: UserDashboardComponent
 },
 {
    path: 'userDashboard/editUser/:userId',
    component: UserDashboardComponent
  },
  {
    path: 'projectDashboard',
    component: ProjectDashboardComponent
 },
 {
    path: 'projectDashboard/editProject/:projectId',
    component: ProjectDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

