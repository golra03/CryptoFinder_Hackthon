import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { RestCallsComponent } from '../services/httpServices';
import { ApplicationComponents } from '../services/applicationComponents';
import { Router } from '@angular/router';
import { NotificationService } from "../services/NotificationService";
import { DataService } from "../services/DataService";
import { NavigationItems } from "../services/sideNavigation";

import * as Web3 from "web3";
const wa = window as any;


@Component({
  selector: 'app-login',
  templateUrl: '../login/login.html'
})

export class LoginComponent {

  public customerLoginPage:Boolean = true;
  public customerRegistrationPage:Boolean = false;
  public userLoginPage:Boolean = false;
  public loginData:any = {};
  public info:any;
  public web3:any;

  public data:Object;
  public login:any = {};
  public otpFieldFlag:Boolean = true;
  public otpEntered:any = "";
  public userInfo:any={};
  public token:any={};
  public passCheck:number = 0;
  public customer:any = {};

  constructor(
    private appCompo:AppComponent,
    private appConstants:ApplicationComponents,
    private http:RestCallsComponent,
    private route:Router,
    private notify:NotificationService,
    private dispData:DataService,
    private nav:NavigationItems){
      var metaMaskAddress;
      var localAddress;
        if(typeof wa.web3 === "undefined"){
          console.log("undefined");
          wa.web3 = new wa.Web3(wa.web3.currentProvider);
          console.log(wa.web3);
        }else if(wa.web3.currentProvider.isMetaMask === true){
            console.log("Metamask activated");
            console.log(wa.web3);
            console.log(wa.web3.eth.accounts[0]);
            this.customer.address = wa.web3.eth.accounts[0];
            console.log(this.customer.address);
          }else{
            console.log("Meta Mask not activated");
          }
  }
  customerLogin(){
    this.customerLoginPage = true;
    this.customerRegistrationPage = false;
    this.userLoginPage = false;
  }
  customerRegistration(){
    this.customerLoginPage = false;
    this.customerRegistrationPage = true;
    this.userLoginPage = false;
        if(typeof wa.web3 === "undefined"){
          console.log("undefined");
          wa.web3 = new wa.Web3(wa.web3.currentProvider);
          console.log(wa.web3);
        }else if(wa.web3.currentProvider.isMetaMask === true){
            console.log("Metamask activated");
            console.log(wa.web3);
            console.log(wa.web3.eth.accounts[0]);
            this.customer.address = wa.web3.eth.accounts[0];
            console.log(this.customer.address);
          }else{
            console.log("Meta Mask not activated");
          }
  }
  userLogin(){
    this.customerLoginPage = false;
    this.customerRegistrationPage = false;
    this.userLoginPage = true;
  }
  registerCustomer(customer){
    console.log(customer);
    this.http.customerRegistrationCall(customer).subscribe(
      (response)=>{
        console.log(response.json());
        if(response.json().status === 1){
          this.customer = {};
          this.customerLoginPage = true;
          this.customerRegistrationPage = false;
          this.userLoginPage = false;
        }
      },(error)=>{
        console.log(error);
      })
  }
  submitCustomerLogin(loginData){
   console.log(loginData);
   console.log("_________________")
    this.http.customerLogin(loginData).subscribe(
      (response)=>{
        console.log("LoginComponent,response");
        this.token = response.json();
        console.log("__()")
        console.log(this.token);
        console.log("__()")
        if(this.token.status){
          console.log(this.token.role);
          this.nav.setRole(this.token.role);
          this.appCompo.login = true;                      
          console.log(this.token);
          this.token.role = 1;
          this.token.token = response.json().token;
          this.token.name = response.json().firstname +" "+ response.json().lastname;
          this.token.region = response.json().region;
          this.token.country = response.json().country;

          localStorage.setItem("login",JSON.stringify(this.token));
          this.http.setTokenAndUrl();
          this.dispData.setUser();
        }
        else{
          this.passCheck = -2;
          this.notify.invalidLogin();
        }
      },
      (error)=>{console.log("ERROR:");console.log(error)},
    );
  }
  submitUserLogin(login){
    if(login.user === "admin" && login.password === "password"){
      this.appCompo.login = true;
      this.token.role = 2;
      this.token.firstname = "Admin";
      this.token.lastname = "";
      this.token.region = "Bengaluru";
      this.token.country = "India";
      localStorage.setItem("login",JSON.stringify(this.token));
    }
  }
}