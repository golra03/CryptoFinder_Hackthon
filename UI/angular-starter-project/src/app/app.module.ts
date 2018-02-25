import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DropzoneModule } from 'angular2-dropzone-wrapper';
import {TranslateModule} from 'ng2-translate';

import { AppComponent } from './app.component';
import { BackdropsComponent } from './elements/backdrops';
import { Jumbotron1Component } from './elements/jumbotron-1';
import { Jumbotron2Component } from './elements/jumbotron-2';
import { LeftSidebar1Component } from './elements/left-sidebar-1';
import { Navbar1Component } from './elements/navbar-1';
import { RightSidebar1Component } from './elements/right-sidebar-1';
import { TopNavigation1Component } from './elements/top-navigation-1';
import { TopNavigation2Component } from './elements/top-navigation-2';
import { SidebarHeadingComponent } from './elements/sidebar-heading';

import { CustomerKYCComponent } from "./customerKYC/customerKYC";
import { LoginComponent } from './login/login';
import { ApplicationComponents } from './services/applicationComponents';
import { RestCallsComponent } from './services/httpServices';
import { NavigationItems } from './services/sideNavigation';
import { NotificationService } from "./services/NotificationService";
import { DataService } from "./services/DataService";
import { DataTransferService } from "./services/DataTransferService";
import { CustomerLoansComponent } from "./customerLoans/customerLoans";
import { GetLoansComponent } from "./getLoans/getLoans";
import { RepayLoansComponent } from "./repayLoans/repayLoans";
@NgModule({
  declarations: [
    AppComponent,
    BackdropsComponent,
    Jumbotron1Component,
    Jumbotron2Component,
    LeftSidebar1Component,
    Navbar1Component,
    RightSidebar1Component,
    TopNavigation1Component,
    TopNavigation2Component,
    LoginComponent,
    CustomerLoansComponent,
    CustomerKYCComponent,
    GetLoansComponent,
    RepayLoansComponent,
    SidebarHeadingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component:CustomerKYCComponent, pathMatch:'full'},
      { path: 'login',component:LoginComponent, pathMatch:'full'},
      { path: 'customer/Registration',component:CustomerKYCComponent,pathMatch:'full'},
      { path: 'loans/RequestPage', component:CustomerLoansComponent, pathMatch:'full'},
      { path: 'get/loans', component:GetLoansComponent, pathMatch:'full'},
      { path: "repay/loans", component:RepayLoansComponent, pathMatch:'full'},
      { path: '**', component: CustomerKYCComponent , pathMatch:'full'}
    ]),
  ],
  providers: [ApplicationComponents,
              NavigationItems,
              RestCallsComponent,
              NotificationService,
              DataService,
              DataTransferService],
  bootstrap: [AppComponent]
})

export class AppModule { }