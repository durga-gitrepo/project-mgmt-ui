import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { FormsModule,ReactiveFormsModule, AbstractControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientService, Project, User, Task, TaskResult } from '../service/http-client.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  taskReferenceId : string;
  taskForm: FormGroup;
  allTasks:Task[];
  allParentTasks:Task[];
  allProjects:Project[];
  allTasksResults:TaskResult[];
  allUsers:User[];
  task: Task = new Task(+"","", "", +"", +"", "","","","Active","");
  editedTaskId : number;
  action : string;
  editTask : Task;

  constructor(
    private httpClientService:HttpClientService,
    private router:Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private datePipe : DatePipe
  ) { }

  ngOnInit() {  

    this.route.paramMap.subscribe(params => {
      this.taskReferenceId=params.get('taskId');      
      console.log('Passed taskId '+ this.taskReferenceId);
      this.httpClientService.passTaskId(+this.taskReferenceId);
    });
  
     console.log('Inside ngInit')
    
      this.taskForm = this.formBuilder.group({        
        taskId:[''],
        taskName: ['', [Validators.required]],
        isParentTask:[''],
        parentTaskId:[''],
        projectId:[''],
        startDate:[''],
        endDate:[''],
        priority:[''],
        status:[''],
        userName:[''],
      },{validator : this.compareDate});

      this.httpClientService.editedTaskId.subscribe( val =>
      {
        this.editedTaskId = val;
        console.log('task id received for edit >>'+this.editedTaskId)
      })

      this.taskForm.valueChanges.subscribe((data) => {
        this.validateFormFields(this.taskForm);
      })
    
      if(this.editedTaskId != null && this.editedTaskId > 0)
      {
        var taskIdForEdit = this.editedTaskId+'';
        this.getTaskById(this.editedTaskId)
        this.action = 'edit'
        document.getElementById('taskName').setAttribute('disabled', 'true');
        document.getElementById('enableParentCheckbox').hidden = true;
        document.getElementById('addEditTaskBtn').innerHTML = 'Edit';
        document.getElementById('taskId').setAttribute('value', taskIdForEdit);

        console.log("----"+this.task.parentTaskId);
        if( this.task.parentTaskId != null && this.task.parentTaskId > 0)
        {
          document.getElementById('priority').setAttribute('disabled', 'true');
          document.getElementById('parentTaskId').setAttribute('disabled', 'true');
          document.getElementById('userName').setAttribute('disabled', 'true');
          document.getElementById('startDate').setAttribute('disabled', 'true');
          document.getElementById('endDate').setAttribute('disabled', 'true');
          document.getElementById('projectId').setAttribute('disabled', 'true');
    
          this.taskForm.get('priority').setValue('');
          this.taskForm.get('parentTaskId').setValue('');
          this.taskForm.get('projectId').setValue('');
          this.taskForm.get('userName').setValue('');
          this.taskForm.get('startDate').setValue('');
          this.taskForm.get('endDate').setValue('');
    
        }
      }
      else
      {
        document.getElementById('addEditTaskBtn').innerHTML = 'Add';
      }

      this.httpClientService.getAllUsers('').subscribe(
        response => this.handleUserSuccessfulResponse(response),
      );

      this.httpClientService.getAllProjects('').subscribe(
        response => this.handleProjectSuccessfulResponse(response),
      );

      this.httpClientService.getAllTasks('').subscribe(
        response => this.handleDashboardSuccessfulResponse(response),
      );

      this.httpClientService.getAllParentTasks().subscribe(
        response => this.handleParentTaskSuccessfulResponse(response),
      );
  }

  compareDate (control : AbstractControl) : {[key: string]: any} | null 
  {
    const startDate = control.get('startDate');
    const endDate = control.get('endDate');
    if( startDate > endDate)
    {
      console.log('------Date fields error --' )
      return {'dateGroupError' : true}
    }
    else{
      return null;
    }
  }

  formErrors = {
    'taskName' : '',
    'startDate' : '',
    'endDate' : '',
    'dateGroupError' : ''
  }

  validationMessages = {
    'taskName' : 
     {
       'required' : "Task Name is required"
     },
     'startDate' :
     {
       'required' : 'Date Field is Invalid'
     },
     'endDate' :
     {
       'required' : 'Date Field is Invalid',
       'dateGroupError'  : 'Start Date should be less than End date'
     }
  }

  isParentTaskSelected():void {
    console.log ('->'+this.taskForm.get('isParentTask').value)
    if( this.taskForm.get('isParentTask').value == true)
    {
      document.getElementById('priority').setAttribute('disabled', 'true');
      document.getElementById('parentTaskId').setAttribute('disabled', 'true');
      document.getElementById('userName').setAttribute('disabled', 'true');
      document.getElementById('startDate').setAttribute('disabled', 'true');
      document.getElementById('endDate').setAttribute('disabled', 'true');
      document.getElementById('projectId').setAttribute('disabled', 'true');

      document.getElementById('priority').setAttribute('value', '');
      document.getElementById('parentTaskId').setAttribute('value', '');
      document.getElementById('userName').setAttribute('value', '');
      document.getElementById('startDate').setAttribute('value', '');
      document.getElementById('endDate').setAttribute('value', '');
      document.getElementById('projectId').setAttribute('value', '');

      this.taskForm.get('priority').setValue('');
      this.taskForm.get('parentTaskId').setValue('');
      this.taskForm.get('projectId').setValue('');
      this.taskForm.get('userName').setValue('');
      this.taskForm.get('startDate').setValue('');
      this.taskForm.get('endDate').setValue('');

    }
    else {
      document.getElementById('priority').setAttribute('disabled', 'false');
      document.getElementById('parentTaskId').setAttribute('disabled', 'false');
      document.getElementById('userName').setAttribute('disabled', 'false');
      document.getElementById('startDate').setAttribute('disabled', 'false');
      document.getElementById('endDate').setAttribute('disabled', 'false');
      document.getElementById('projectId').setAttribute('disabled', 'false');
    }
  }

  addEditTask():void {
    var buttonAction = document.getElementById('addEditTaskBtn').innerHTML;
    console.log('Data>>'+ buttonAction);
    console.log('Data>>'+ this.taskForm.get('isParentTask').value);

    if( this.taskForm.get('isParentTask').value == true)
    {
      this.task.isParentTask = 'Y';
    }
    else
    {
      this.task.isParentTask = 'N';
    }

    if(buttonAction == 'Add')
    {
      this.httpClientService.addTask(this.task)
      .subscribe( data => {
        this.httpClientService.getAllTasks('').subscribe(
          response => this.handleDashboardSuccessfulResponse(response),
        );
        alert('New task added successfully');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['addTaskDashboard']))
      });
   }
   else
   {
    var taskId = document.getElementById('taskId').getAttribute('value');
    this.httpClientService.updateTask(this.task, +taskId)
    .subscribe( data => {
      this.httpClientService.getAllTasks('').subscribe(
        response => this.handleDashboardSuccessfulResponse(response),
      );
      alert('Task updated successfully');
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['addTaskDashboard']))
    });
   }
  };

  validateFormFields(group : FormGroup) : any {
    var hasValidationError = false;
    Object.keys(group.controls).forEach( (key : string) => {
      const abstControl = group.get(key);

      this.formErrors[key] = '';
      if(abstControl && !abstControl.valid &&
        (abstControl.touched || abstControl.dirty))
      {
        const errorMsg = this.validationMessages[key];
        for(const errorKey in abstControl.errors)
        {
          if(errorKey)
          {
            this.formErrors[key] += errorMsg[errorKey] + ' ';
            hasValidationError = true;
          }
        }
      }

      if(abstControl instanceof FormGroup)
      {
        this.validateFormFields(abstControl);
      }
    });
    if(hasValidationError)
    {
      document.getElementById('addEditTaskBtn').setAttribute('disable', "true");
    }
  }

  cancel():void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['addTaskDashboard']))
  };

  handleSuccessfulResponse(response)
  {
      this.allTasks=response;
  }

  handleDashboardSuccessfulResponse(response)
  {
      this.allTasksResults=response;
  }

  handleParentTaskSuccessfulResponse(response)
  {
      this.allParentTasks=response;
  }

  handleSuccessfullTaskResponse(response)
  {
      this.task=response;
      let isParent = this.task.isParentTask;
      if(isParent == 'Y')
      {
        this.taskForm.get('isParentTask').setValue(true)
      }
      else {
        this.taskForm.get('isParentTask').setValue(false)
      }
  }

  handleUserSuccessfulResponse(response)
  {
      this.allUsers=response;
  }

  handleProjectSuccessfulResponse(response)
  {
      this.allProjects=response;
  }
  

  getTaskById(taskId : number)
  {
    this.httpClientService.getTaskById(taskId).subscribe(
      response => this.handleSuccessfullTaskResponse(response),
    );
  }

  onUserSelected(val : any)
  {
    console.log('Selected user --> '+ val);
  }

  onTaskSelected(val : any)
  {
    console.log('Selected task --> '+ val);
  }

  onProjectSelected(val : any)
  {
    console.log('Selected projected --> '+ val);
  }

}
