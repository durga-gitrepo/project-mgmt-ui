import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

export class User{

  public userId:number;
  public firstName:string;
  public lastName:string;
  public employeeId:number;

  constructor(
    userId:number,
    firstName:string,
    lastName:string,
    employeeId:number
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.employeeId = employeeId;
  }

  setUserId(userId:number)
  {
    this.userId = userId;
  }
}

export class AddUser{
  constructor(
    public firstName:string,
    public lastName:string,
    public employeeId:string
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  editeduserId : BehaviorSubject<number>;
  constructor(private httpClient : HttpClient) {
    this.editeduserId = new BehaviorSubject(0);
   }

  getAllUsers(sortBy : String): Observable<User[]> 
  {
    var sortKey:String = sortBy
    let url = "http://localhost:7050/project/user/dashboard";
    if (sortKey = '')
    {
      return this.httpClient.get<User[]>(url);
    }
    else 
    {
      let sortedUrl = url + "?sortBy=" + sortBy;
      return this.httpClient.get<User[]>(sortedUrl);
    }
  }

  getUserById(userId : number)
  {
    return this.httpClient.get<User>("http://localhost:7050/project/user" + "/" + userId);
  }

  addUser(newUser: AddUser)
  {
    return this.httpClient.post<AddUser>("http://localhost:7050/project/user/create", newUser);
  }

  deleteUser(userId: number)
  {
    return this.httpClient.delete("http://localhost:7050/project/user/delete" + "/"+ userId);
  }

  passUserId(userId : number)
  {
    this.editeduserId = new BehaviorSubject(userId)
  }

  updateUser(updatedUser: AddUser, userId : number)
  {
    let editUser =  new User(userId, updatedUser.firstName, updatedUser.lastName, +updatedUser.employeeId)
    return this.httpClient.put<User>("http://localhost:7050/project/user/update" + "/" + userId, editUser);
  }

}
