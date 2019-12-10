import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectDashboardComponent} from './project-dashboard/project-dashboard.component';
import {AddTaskComponent} from './add-task/add-task.component';
import {ViewTaskComponent} from './view-task/view-task.component';

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
  },
  {
     path: 'addTaskDashboard',
     component: AddTaskComponent
   },
   {
      path: 'viewTaskDashboard',
      component: ViewTaskComponent
    },
    {
       path: 'addTaskDashboard/editTask/:taskId',
       component: AddTaskComponent
     }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

