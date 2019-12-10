import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit {

  projectReferenceId : string;
  
  constructor(
    private httpClientService:HttpClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
   
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectReferenceId=params.get('projectId');      
      console.log('Passed projectId '+ this.projectReferenceId);
      this.httpClientService.passProjectId(+this.projectReferenceId);
    });
  }

}
