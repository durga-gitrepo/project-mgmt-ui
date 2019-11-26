import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  userReferenceId : string;
  
  constructor(
    private httpClientService:HttpClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
   
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userReferenceId=params.get('userId');      
      console.log('Passed userId '+ this.userReferenceId);
      this.httpClientService.passUserId(+this.userReferenceId);
    });
  }
}
