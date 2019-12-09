import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClientService, Project, TaskResult } from '../service/http-client.service';
import { Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  allTaskResults:TaskResult[];
  allProjects:Project[]
  selectedProjectId : number
  searchTaskForm: FormGroup;

  constructor(
    private httpClientService : HttpClientService,
    private router : Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.searchTaskForm = this.formBuilder.group({        
      projectId:['']
    });

    this.httpClientService.getAllTasks('').subscribe(
      response => this.handleSuccessfulResponse(response),
    );

    this.httpClientService.getAllProjects('').subscribe(
      response => this.handleProjectSuccessfulResponse(response),
    );
  }

  handleSuccessfulResponse(response)
  {
      this.allTaskResults=response;
  }

  handleProjectSuccessfulResponse(response)
  {
      this.allProjects=response;
  }

  searchTask(sortBy : String)
  {
    console.log("selectedProjectId --"+ this.selectedProjectId)
    console.log("sortKey --"+ sortBy)

    if(this.selectedProjectId != null && this.selectedProjectId > 0)
    {
      this.httpClientService.getAllTasksForSelectProject(this.selectedProjectId, '').subscribe(
        response => this.handleSuccessfulResponse(response),
      );
    }
    else {
      this.httpClientService.getAllTasks(sortBy).subscribe(
        response => this.handleSuccessfulResponse(response),
      );
    }
  }

  onProjectSelected(val : any)
  {
    this.selectedProjectId = val;
    console.log('Selected projected --> '+ val);
  }

  endTask(taskId: number) {
    if (confirm('Are you sure to End Task ??'))
    {
      this.httpClientService.endTask(taskId).subscribe(
      (res) => {
        alert("Task ended and status updated as 'Completed' successfully !!!");
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['viewTaskDashboard']))
      },
    (err : any) =>{
        console.error(err);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['viewTaskDashboard']))    
      }); 
    } 
  }

  editTask(taskId: number) {
    this.router.navigate(['addTaskDashboard/editTask',taskId]);
  }

}
