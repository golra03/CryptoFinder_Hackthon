import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { RestCallsComponent } from '../services/httpServices';
import { ApplicationComponents } from '../services/applicationComponents';
import { Router } from '@angular/router';
import { NotificationService } from "../services/NotificationService";
import { DataService } from "../services/DataService";
import { NavigationItems } from "../services/sideNavigation";

@Component({
  selector: 'repay-loans',
  templateUrl: './repayLoans.html'
})

export class RepayLoansComponent {

  public loan:any = {};
  public loanLists:any = [];
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
    this.http.getAllApprovedLoans({token:this.loan.token}).subscribe(
      (response)=>{
        this.loanLists = response.json();
        console.log(response);
      },
      (error)=>{console.log(error)})
  }

  repay(data){
    this.http.repayLoans(data).subscribe(
      (response)=>{
        console.log(response);
        if(response.json().status === true){
          window.alert("Loan Repayed");
        }
      },(error)=>{
        console.log(error);
      })
  }

}