import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { RestCallsComponent } from '../services/httpServices';
import { ApplicationComponents } from '../services/applicationComponents';
import { Router } from '@angular/router';
import { NotificationService } from "../services/NotificationService";
import { DataService } from "../services/DataService";
import { NavigationItems } from "../services/sideNavigation";

@Component({
  selector: 'customer-loans',
  templateUrl: './customerLoans.html'
})

export class CustomerLoansComponent {

  public loan:any = {};

  constructor(
    private appCompo:AppComponent,
    private appConstants:ApplicationComponents,
    private http:RestCallsComponent,
    private route:Router,
    private notify:NotificationService,
    private dispData:DataService,
    private nav:NavigationItems){
    console.log("Request for Loans");
    console.log(JSON.parse(localStorage.getItem("login")));
    this.loan.customerName = JSON.parse(localStorage.getItem("login")).firstname+" "+JSON.parse(localStorage.getItem("login")).lastname;
    this.loan.token = JSON.parse(localStorage.getItem("login")).token;
    console.log(this.loan.token)
  }

sendLoanRequest(data){
	console.log(data);
  this.http.RequestForLoans(data).subscribe(
    (response)=>{
      console.log(response.json());
    },
    (error)=>{
      console.log(error);
    })
  }
}