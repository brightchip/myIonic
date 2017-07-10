import { Component } from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {UserData} from "../../providers/user-data";
import {AccountPage} from "../account/account";
import * as Enums from "../../providers/globals";
import {SchoolSettingsPage} from "../school-settings/school-setting";


@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  MyUserType = Enums.UserType;
  // userInfo: {user_name?: string, checkinCount?: string,userAvatar?:string,phone?:string} = {};

  constructor(public navCtrl: NavController,public events: Events,public userData:UserData) {

  }

  ionViewDidEnter() {
    this.init();
  }

  init(){
    this.userData.getDefaultUserData().then( _ => {
      console.log("init setting",this.userData.userInfo)
    }).catch( err => {
      // this.checkin();
    })

    // this.userData.getDefaultUserData().then( (userInfo) =>{
    //   if(typeof userInfo != "undefined"){
    //     if(typeof userInfo.user_name != "undefined"){
    //       this.userInfo.user_name = userInfo.user_name;
    //       console.log("SettingsPage init", "userInfo.user_name " + userInfo.user_name + " this.userInfo.user_name " + this.userInfo.user_name  )
    //     }
    //     if(typeof userInfo.checkinCount != "undefined"){
    //       this.userInfo.checkinCount = userInfo.checkinCount;
    //       console.log("SettingsPage init", "userInfo.checkinCount " + userInfo.checkinCount + " this.userInfo.checkinCount " + this.userInfo.checkinCount  )
    //
    //     }
    //     if(typeof userInfo.userAvatar != "undefined"){
    //       this.userInfo.userAvatar = userInfo.userAvatar;
    //     }
    //     if(typeof userInfo.phone != "undefined"){
    //       this.userInfo.phone = userInfo.phone;
    //     }
    //   }else {
    //     console.log("SettingsPage init", "userInfo undefined")
    //   }
    //   console.log("SettingsPage init", userInfo)
    // })

  }


  showMyCourses(){

  }

  showHistory(){

  }

  findOrder(){

  }

  showSetting(){
    this.navCtrl.push(AccountPage);
  }

  showSchoolSetting(){
    this.navCtrl.push(SchoolSettingsPage);
  }



}
