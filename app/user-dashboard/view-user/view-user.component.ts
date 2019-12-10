import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { HttpClientService, User } from '../../service/http-client.service';
import { Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

 
  allUsers:User[];
  constructor(
    private httpClientService : HttpClientService,
    private router : Router
  ) { }

  ngOnInit() {
    this.httpClientService.getAllUsers('').subscribe(
      response => this.handleSuccessfulResponse(response),
    );
  }
  

  handleSuccessfulResponse(response)
  {
      this.allUsers=response;
  }

  getAllUsers(sortBy : String)
  {
    this.httpClientService.getAllUsers(sortBy).subscribe(
      response => this.handleSuccessfulResponse(response),
    );
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure do delete user information'))
    {
      this.httpClientService.deleteUser(userId).subscribe(
      (res) => {
        alert("User deleted successfully !!!");
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['userDashboard']))
      },
    (err : any) =>{
        console.error(err);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['userDashboard']))    
      }); 
    } 
  }

  editUser(userId: number) {
    this.router.navigate(['userDashboard/editUser',userId]);
  }
}