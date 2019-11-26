import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddUserComponent } from './user-dashboard/add-user/add-user.component';
import { ViewUserComponent } from './user-dashboard/view-user/view-user.component';

const routes: Routes = [
  {
    path: 'userDashboard',
    component: UserDashboardComponent
 },
 {
    path: 'userDashboard/editUser/:userId',
    component: UserDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

