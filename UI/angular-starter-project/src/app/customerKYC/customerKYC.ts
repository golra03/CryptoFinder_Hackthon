import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { RestCallsComponent } from '../services/httpServices';
import { ApplicationComponents } from '../services/applicationComponents';
import { Router } from '@angular/router';
import { NotificationService } from "../services/NotificationService";
import { DataService } from "../services/DataService";
import { NavigationItems } from "../services/sideNavigation";

@Component({
  selector: 'customer-registration',
  templateUrl: './customerKYC.html'
})

export class CustomerKYCComponent {

  public kyc:any = {};

  constructor(
    private appCompo:AppComponent,
    private appConstants:ApplicationComponents,
    private http:RestCallsComponent,
    private route:Router,
    private notify:NotificationService,
    private dispData:DataService,
    private nav:NavigationItems){
    this.kyc.customerName = JSON.parse(localStorage.getItem("login")).firstname+" "+JSON.parse(localStorage.getItem("login")).lastname;
  }

sendDocumentForKYC(data){
	console.log(data);
}
}