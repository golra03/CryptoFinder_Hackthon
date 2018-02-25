import { Component, OnInit } from '@angular/core';
import { NavigationItems } from '../services/sideNavigation';

@Component({
  selector: 'left-sidebar-1',
  templateUrl: '../elements/left-sidebar-1.html',
  providers:[NavigationItems]
})

export class LeftSidebar1Component implements OnInit {

  navigation: Array<Object>;
  constructor(private navigationItems: NavigationItems) {
  	this.navigation = navigationItems.getItems();
  }
  ngOnInit(){

  }

}
