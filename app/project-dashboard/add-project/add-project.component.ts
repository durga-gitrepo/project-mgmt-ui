import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientService, Project, User } from '../../service/http-client.service';
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  projectForm: FormGroup;
  allProjects:Project[];
  allUsers:User[];
  project: Project = new Project(+"","", "", "", "", "");
  editedProjectId : number;
  action : string;
  editproject : Project;

  constructor(
    private httpClientService:HttpClientService,
    private router:Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private datePipe : DatePipe
  ) { }

  ngOnInit() {  
    console.log('Inside ngInit')
    
      this.projectForm = this.formBuilder.group({        
        projectId:[''],
        projectName: ['', [Validators.required]],
        isDefaultDate:[''],
        startDate:['', [Validators.required]],
        endDate:['', [Validators.required ]],
        priority:[''],
        managerName:[''],
      },{validator : this.compareDate});

      this.httpClientService.editedProjectId.subscribe( val =>
      {
        this.editedProjectId = val;
        console.log('project id received for edit >>'+this.editedProjectId)
      })

      this.projectForm.valueChanges.subscribe((data) => {
        this.validateFormFields(this.projectForm);
      })
    
      if(this.editedProjectId != null && this.editedProjectId > 0)
      {
        var projectIdForEdit = this.editedProjectId+'';
        this.getProjectById(this.editedProjectId)
        this.action = 'edit'
        document.getElementById('projectName').setAttribute('disabled', 'true');
        document.getElementById('addEditProjectBtn').innerHTML = 'Edit';
        document.getElementById('projectId').setAttribute('value', projectIdForEdit);
      }
      else{
        document.getElementById('addEditProjectBtn').innerHTML = 'Add';
      }

      this.httpClientService.getAllUsers('').subscribe(
        response => this.handleUserSuccessfulResponse(response),
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
    'projectName' : '',
    'startDate' : '',
    'endDate' : '',
    'dateGroupError' : ''
  }

  validationMessages = {
    'projectName' : 
     {
       'required' : "Project Name is required"
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

  isDefaultDateSelected():void {
    if( this.projectForm.get('isDefaultDate').value == true)
    {
      let currDate = new Date();
      let tomorrow = currDate.setTime(currDate.getTime() + (24 * 60 * 60 * 1000));   

      let today = this.datePipe.transform(new Date(), "yyyy-MM-dd")
      let nextDay = this.datePipe.transform(tomorrow, "yyyy-MM-dd")

      this.projectForm.get('startDate').setValue(today);
      this.projectForm.get('endDate').setValue(nextDay);
    }
  }

  addEditProject():void {
    var buttonAction = document.getElementById('addEditProjectBtn').innerHTML;
    console.log('Data>>'+ buttonAction);
    if(buttonAction == 'Add')
    {
      this.httpClientService.addProject(this.project)
      .subscribe( data => {
        this.httpClientService.getAllProjects('').subscribe(
          response => this.handleSuccessfulResponse(response),
        );
        alert('New project added successfully');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['projectDashboard']))
      });
   }
   else
   {
    var projectId = document.getElementById('projectId').getAttribute('value');
    this.httpClientService.updateProject(this.project, +projectId)
    .subscribe( data => {
      this.httpClientService.getAllProjects('').subscribe(
        response => this.handleSuccessfulResponse(response),
      );
      alert('Project updated successfully');
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['projectDashboard']))
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
      document.getElementById('addEditProjectBtn').setAttribute('disable', "true");
    }
  }

  cancel():void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['projectDashboard']))
  };

  handleSuccessfulResponse(response)
  {
      this.allProjects=response;
  }

  handleSuccessfulProjectResponse(response)
  {
      this.project=response;
  }

  handleUserSuccessfulResponse(response)
  {
      this.allUsers=response;
  }
  
  getProjectById(projectId : number)
  {
    this.httpClientService.getProjectById(projectId).subscribe(
      response => this.handleSuccessfulProjectResponse(response),
    );
  }

  onManagerSelected(val : any)
  {
    console.log('Select manager --> '+ val);
  }

}
