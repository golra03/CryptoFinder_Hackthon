import { Component,OnInit } from '@angular/core';
import { RestCallsComponent } from '../services/httpServices';
import { Router } from '@angular/router';
import { ApplicationComponents } from '../services/applicationComponents';
import { AppComponent } from '../app.component';
import { DataService } from "../services/DataService";

declare var $: any;

@Component({
  selector: 'navbar-1',
  templateUrl: '../elements/navbar-1.html'
})

export class Navbar1Component implements OnInit {
  public name:any = {};

  constructor(
    private http:RestCallsComponent,
    private appCompo:AppComponent,
    private dataService:DataService) {

    this.name = JSON.parse(localStorage.getItem("login")).firstname+" "+JSON.parse(localStorage.getItem("login")).lastname;
  }
  ngOnInit(){

  }
  toggleLayout(): void {
    const body = $('body');
    const collapsed = body.attr('data-collapsed') === 'true' ? true : false;
    body.attr('data-collapsed', !collapsed);
    const layout = body.attr('data-layout');
		if(layout === 'sidebar-over-1') {
				var backdrop = $('.left-sidebar-backdrop');
				if(backdrop.hasClass('in')) {
					backdrop.removeClass('fade');
					backdrop.removeClass('in');
				} else {
					backdrop.toggleClass('fade in');
				}
		}
  }

  toggleFullscreen(): void {
    const body = $('body');
    const value = body.attr('data-fullscreen') === 'true' ? true : false;
    body.attr('data-fullscreen', !value);
  }
  
  logout(){
    this.http.universityLogout(JSON.parse(localStorage.getItem("login"))).subscribe(
      (response)=>{console.log(response);
                    this.appCompo.login = false;
                    localStorage.clear();
                  },
      (error)=> {console.log("could'nt logout")});
  }

}

