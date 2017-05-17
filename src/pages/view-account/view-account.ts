import { Component } from '@angular/core';

import {
  ActionSheetController, AlertController, Events, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import {Camera, CameraOptions} from "@ionic-native/camera";

import { File  } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';


@Component({
  selector: 'page-view-account',
  templateUrl: 'view-account.html'
})
export class ViewAccountPage {
  ROOT_DIR;
  IMAGE_DIR;
  IMAGE_DIR_NAME = 'user_data';

  selectedUser: {user_name?: string, phone?: string, avatar?:string} = {};


  constructor(public alertCtrl: AlertController, public nav: NavController,     public navParams: NavParams,public platform:Platform,  public events: Events,public actionSheetCtrl: ActionSheetController, public camera: Camera,public toastCtrl :ToastController, public file: File,private filePath: FilePath,public userData: UserData) {
    // this.listenToErrorEvents();

    // let user_id =   this.navParams.get('user_id');
    // userData.retriveUserInfo(user_id).then( (userinfo) => {
    //   this.selectedUser.user_name = userinfo.user_name;
    //   this.selectedUser.checkinCount = userinfo.checkin_count;
    //   this.selectedUser.userAvatar = userinfo.checkin_count;
    // })
    this.selectedUser =   this.navParams.get('userinfo');

    //initialize platform root directory
    if (this.platform.is('android')){
      this.ROOT_DIR = this.file.externalDataDirectory;
      this.IMAGE_DIR =  this.ROOT_DIR  + this.IMAGE_DIR_NAME;
      // console.log("account page externalDataDirectory ",this.file.externalDataDirectory + " externalRootDirectory " + this.file.externalRootDirectory)
    }
  }

  ngAfterViewInit() {

  }


  listenToErrorEvents(){
    // this.events.subscribe('user:checkinCount', (checkinCount) => {
    //   console.log("account:checkinCount ", checkinCount);
    //
    //
    // });
  }

  call(){

  }

  sendMsg(){
    console.log("sendMsg")
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}
