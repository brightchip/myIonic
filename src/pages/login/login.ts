import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import {Events, NavController} from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { Storage } from '@ionic/storage';
import {EntryPage} from "../entry/entry";

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: {username?: string, password?: string,savePassword?:boolean,phone?:string} = {};
  submitted = false;

  errorMsg:string = "";


  constructor(public navCtrl: NavController,    public events: Events, public userData: UserData, public storage: Storage) {

    this.listenToLoginEvents();
    this.storage.get('savePassword').then((value) => {
      if(value){
        this.login.savePassword = value;
        this.autoLogin();
      }
    })

  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.errorMsg = "";
      let userInfo = { phone:this.login.phone,password:this.login.password}

      this.userData.login(userInfo);

      this.storage.set('savePassword', this.login.savePassword);
      // this.storage.set('username', this.login.savePassword);  //set in userdata page

    }
  }

  autoLogin(){
    //check whether save-password  had been checked
    return     this.storage.get('username').then((value) => {
      if(value){
        this.userData.login(value);
        // this.storage.get('password');
      }
    });
  }

  listenToLoginEvents(){
    this.events.subscribe('user:loginfailed', (error) => {
      console.log("loginfailed " + error);
      this.errorMsg = error;
    });
  }


  onSignup() {
    this.navCtrl.push(EntryPage);
  }
}
