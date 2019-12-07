import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

export class User{

  public userId:number;
  public firstName:string;
  public lastName:string;
  public employeeId:number;
  public fullName:string;

  constructor(
    userId:number,
    firstName:string,
    lastName:string,
    employeeId:number,
    fullName : string
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.employeeId = employeeId;
    this.fullName = fullName;
  }

  setUserId(userId:number)
  {
    this.userId = userId;
  }
}

export class Project {
  
    public projectId:number;
    public projectName:string;
    public startDate:string;
    public endDate:string;
    public priority: string;
    public managerName:string;
  
    constructor(
      projectId:number,
      projectName:string,
      startDate:string,
      endDate:string,
      priority: string,
      managerName:string
    ) {
      this.projectId = projectId;
      this.projectName = projectName;
      this.startDate = startDate;
      this.endDate = endDate;
      this.priority = priority;
      this.managerName = managerName;
    }
  
    setProjectId(projectId:number)
    {
      this.projectId = projectId;
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
  editedProjectId : BehaviorSubject<number>;

  constructor(private httpClient : HttpClient) {
    this.editeduserId = new BehaviorSubject(0);
    this.editedProjectId = new BehaviorSubject(0);
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

  updateUser(updatedUser: AddUser, userId : number)
  {
    let editUser =  new User(userId, updatedUser.firstName, updatedUser.lastName, +updatedUser.employeeId, '')
    return this.httpClient.put<User>("http://localhost:7050/project/user/update" + "/" + userId, editUser);
  }

  passUserId(userId : number)
  {
    this.editeduserId = new BehaviorSubject(userId)
  }

  passProjectId(projectId : number)
  {
    this.editedProjectId = new BehaviorSubject(projectId)
  }

  getAllProjects(sortBy : String): Observable<Project[]> 
  {
    var sortKey:String = sortBy
    let url = "http://localhost:7050/project/project/dashboard";
    if (sortKey = '')
    {
      return this.httpClient.get<Project[]>(url);
    }
    else 
    {
      let sortedUrl = url + "?sortBy=" + sortBy;
      return this.httpClient.get<Project[]>(sortedUrl);
    }
  }

  getProjectById(projectId : number)
  {
    return this.httpClient.get<Project>("http://localhost:7050/project/project" + "/" + projectId);
  }

  addProject(newProject: Project)
  {
    newProject.projectId = null;
    return this.httpClient.post<Project>("http://localhost:7050/project/project/create", newProject);
  }

  deleteProject(projectId : number)
  {
    return this.httpClient.delete("http://localhost:7050/project/project/delete" + "/"+ projectId);
  }

  updateProject(updatedProject : Project, projectId : number)
  {
    return this.httpClient.put<Project>("http://localhost:7050/project/project/update" + "/" + projectId, updatedProject);
  }
}
