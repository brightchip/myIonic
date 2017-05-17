import { Component } from '@angular/core';
import { MenuController,NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SignupPage} from "../signup/signup";
import * as Enums from "../../providers/globals";



@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html'
})


export class EntryPage {
  MyUserType = Enums.UserType;
  constructor(     public navCtrl: NavController,public menu: MenuController,    public storage: Storage) {

  }

    ionViewDidEnter() {
      // the root left menu should be disabled on the tutorial page
      this.menu.enable(false);
    }

    ionViewDidLeave() {
      // enable the root left menu when leaving the tutorial page
      this.menu.enable(true);
    }

  onSignup(userType:any) {
    console.log("EntryPage::onSignup",userType);
      this.navCtrl.push(SignupPage,{userType: userType});
  }

}
