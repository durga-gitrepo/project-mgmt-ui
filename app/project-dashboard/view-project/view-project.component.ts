import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { HttpClientService, Project } from '../../service/http-client.service';
import { Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

 
  allProjects:Project[];
  constructor(
    private httpClientService : HttpClientService,
    private router : Router
  ) { }

  ngOnInit() {
    this.httpClientService.getAllProjects('').subscribe(
      response => this.handleSuccessfulResponse(response),
    );
  }
  

  handleSuccessfulResponse(response)
  {
      this.allProjects=response;
  }

  getAllProjects(sortBy : String)
  {
    console.log("sortKey --"+ sortBy)
    this.httpClientService.getAllProjects(sortBy).subscribe(
      response => this.handleSuccessfulResponse(response),
    );
  }

  deleteProject(projectId: number) {
    if (confirm('Are you sure do delete Project information'))
    {
      this.httpClientService.deleteProject(projectId).subscribe(
      (res) => {
        alert("Project deleted successfully !!!");
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['projectDashboard']))
      },
    (err : any) =>{
        console.error(err);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['projectDashboard']))    
      }); 
    } 
  }

  editProject(projectId: number) {
    this.router.navigate(['projectDashboard/editProject',projectId]);
  }
}
