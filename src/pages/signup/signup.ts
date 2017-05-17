import {Component, Directive, forwardRef,Attribute} from '@angular/core';
import {NgForm, Validator, NG_VALIDATORS, FormControl} from '@angular/forms';
import {Events, NavController, NavParams} from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import * as Enums from "../../providers/globals";
import { SMS } from '@ionic-native/sms';
import { Storage } from '@ionic/storage';
// import {isUndefined} from "@ionic-angular/umd/util/util";


@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage  {
  signup: {tel?:number,username?: string, password?: string,repassword?:string,captcha?:any,captchaMismatch?:boolean} = {};
  submitted = false;
  private userType: any ;
  private smsBody:number = 1234;

  errorMsg:string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public userData: UserData,
    private sms: SMS,
    public storage: Storage)
  {

    this.listenToErrorEvents();
    this.userType =   this.navParams.get('userType');
    // if(this.userType == undefiend){
    //   this.userType = 1
    // }
    console.log("SignupPage::userType",this.userType);
  }

  sendSMS(){
    // Send a text message using default options
    this.sms.send('13318264247', 'Hello world!');
  }

  checkCaptcha():boolean {
    // console.log("checkCaptcha");
    //  if(this.smsBody == this.signup.captcha){
       this.signup.captchaMismatch = true;
    //    return true;
    //  }
    // this.signup.captchaMismatch = false;
    //  return false;

    return true;
  }

  onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid && this.signup.password===this.signup.repassword && this.checkCaptcha()) {
      var userInfo = { phone:this.signup.tel ,user_name: this.signup.username, password: this.signup.password,identity:this.userType}
      this.userData.signup(userInfo);
      this.errorMsg = "";
      // this.storage.set('hasIdentified', 'true');
      // this.navCtrl.push(TabsPage);
    }
  }

  listenToErrorEvents(){
    this.events.subscribe('user:signupfailed', (error) => {
      console.log("signupfailed " + error);
      this.errorMsg = error;
    });
  }


}






