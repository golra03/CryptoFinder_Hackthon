import { Component,OnInit } from '@angular/core';
import { RestCallsComponent } from '../services/httpServices';
import { AppComponent } from '../app.component';
import { DataService } from "../services/DataService";
import { NotificationService } from "../services/NotificationService";

@Component({
  selector: 'sidebar-heading',
  templateUrl: '../elements/sidebar-heading.html',
})

export class SidebarHeadingComponent implements OnInit{

  public universityData:any = {};

  constructor(
    private http:RestCallsComponent,
    private appCompo:AppComponent, 
    private dataService:DataService,
    private notify:NotificationService) {
      var login = JSON.parse(localStorage.getItem("login"));
      this.universityData.primaryContactName = login.name;
      this.universityData.region = login.region;
      this.universityData.country = login.country;
  }

  ngOnInit(){
  }  
  logout(){
    console.log("Logout");
    console.log(JSON.parse(localStorage.getItem("login")));
    this.http.universityLogout(JSON.parse(localStorage.getItem("login"))).subscribe(
      (response)=>{console.log(response);
        this.appCompo.login = false;
        localStorage.clear();
      },
      (error)=> {console.log("could'nt logout")});
  }
}