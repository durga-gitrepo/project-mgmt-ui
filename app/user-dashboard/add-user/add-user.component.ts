import { Component, ViewChild , OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientService, AddUser,  User } from '../../service/http-client.service';
import {ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  allUsers:User[];
  user: AddUser = new AddUser("","", "");
  editeduserId : number;
  action : string;
  editUser : User;

  constructor(
    private httpClientService:HttpClientService,
    private router:Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
      console.log('Inside ngInit')

      this.userForm = this.formBuilder.group({        
        firstName: ['', [Validators.required, Validators.maxLength(15)]],
        lastName: ['', Validators.required],
        employeeId:['', Validators.required]
      });

      this.httpClientService.editeduserId.subscribe( val =>
      {
        this.editeduserId = val;
        console.log('user id received for edit >>'+this.editeduserId)
      })

      this.userForm.valueChanges.subscribe((data) => {
        this.validateFormFields(this.userForm);
      })
    
      if(this.editeduserId != null && this.editeduserId > 0)
      {
        var userIdForEdit = this.editeduserId;
        this.getUserById(this.editeduserId)
        this.action = 'edit'
        document.getElementById('addEditUserBtn').innerHTML = 'Edit User';
        document.getElementById('userId').setAttribute('value', userIdForEdit);   
        //document.getElementById('formKey').style.display = 'Show';
      }
      else{
        document.getElementById('addEditUserBtn').innerHTML = 'Add User';
        //document.getElementById('formKey').style.display = 'Hide';
      }
    

  }

  formErrors = {
    'firstName' : '',
    'lastName' : '',
    'employeeId' : ''    
  }

  validationMessages = {
    'firstName' : 
     {
       'required' : "First Name is required",
       'maxlength' : "First Name must be less than 15 characters"
     },
     'lastName' : 
     {
       'required' : "Last Name is required"
     },
     'employeeId' : 
     {
       'required' : "Employee id is required"
     },
  }

  addEditUser():void {
    var buttonAction = document.getElementById('addEditUserBtn').innerHTML;
    console.log('Data>>'+ buttonAction);
    if(buttonAction == 'Add User')
    {
      this.httpClientService.addUser(this.user)
      .subscribe( data => {
        this.httpClientService.getAllUsers('').subscribe(
          response => this.handleSuccessfulResponse(response),
        );
        alert('New user added successfully');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['userDashboard']))
      });
   }
   else
   {
    var userId = document.getElementById('userId').getAttribute('value');
    this.httpClientService.updateUser(this.user, +userId)
    .subscribe( data => {
      this.httpClientService.getAllUsers('').subscribe(
        response => this.handleSuccessfulResponse(response),
      );
      alert('User updated successfully');
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['userDashboard']))
    });
   }
  };

  validateFormFields(group : FormGroup) : any {
    var hasValidationError = false;
    Object.keys(group.controls).forEach( (key : string) => {
      const abstControl = group.get(key);
      if(abstControl instanceof FormGroup)
      {
        this.validateFormFields(abstControl);
      }
      else
      {
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
      }
    });
    if(hasValidationError)
    {
      document.getElementById('addEditUserBtn').setAttribute('disable', "true");
    }
  }

  cancel():void {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['userDashboard']))
  };

  handleSuccessfulResponse(response)
  {
      this.allUsers=response;
  }

  handleSuccessfulUserResponse(response)
  {
      this.user=response;
  }

  
  getUserById(userId : number)
  {
    this.httpClientService.getUserById(userId).subscribe(
      response => this.handleSuccessfulUserResponse(response),
    );
  }

}
