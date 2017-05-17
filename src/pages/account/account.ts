import { Component } from '@angular/core';

import {ActionSheetController, AlertController, Events, NavController, Platform, ToastController} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import {Camera, CameraOptions} from "@ionic-native/camera";

import { File  } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  ROOT_DIR;
  IMAGE_DIR;
  IMAGE_DIR_NAME = 'user_data';

  userInfo: {user_name?: string, checkinCount?: string,userAvatar?:string,phone?:string} = {};


  constructor(public alertCtrl: AlertController, public nav: NavController, public platform:Platform,  public events: Events,public actionSheetCtrl: ActionSheetController, public camera: Camera,public toastCtrl :ToastController, public file: File,private filePath: FilePath,public userData: UserData) {
    // this.listenToErrorEvents();

    //initialize platform root directory
    if (this.platform.is('android')){
      this.ROOT_DIR = this.file.externalDataDirectory;
      this.IMAGE_DIR =  this.ROOT_DIR  + this.IMAGE_DIR_NAME;
      console.log("account page externalDataDirectory ",this.file.externalDataDirectory + " externalRootDirectory " + this.file.externalRootDirectory)
    }
    console.log("account page",this.IMAGE_DIR);
  }

  ngAfterViewInit() {
    this.init();
  }

  init(){
    this.userData.getDefaultUserData().then( (userInfo) =>{
      if(typeof userInfo != "undefined"){
        if(typeof userInfo.user_name != "undefined"){
          this.userInfo.user_name = userInfo.user_name;
          console.log("AccountPage init", "userInfo.user_name " + userInfo.user_name + " this.userInfo.user_name " + this.userInfo.user_name  )
        }
        if(typeof userInfo.checkinCount != "undefined"){
          this.userInfo.checkinCount = userInfo.checkinCount;
          console.log("AccountPage init", "userInfo.checkinCount " + userInfo.checkinCount + " this.userInfo.checkinCount " + this.userInfo.checkinCount  )

        }
        if(typeof userInfo.userAvatar != "undefined"){
          this.userInfo.userAvatar = userInfo.userAvatar;
        }
        if(typeof userInfo.phone != "undefined"){
          this.userInfo.phone = userInfo.phone;
        }
      }else {
        console.log("AccountPage init", "userInfo undefined")
      }
      console.log("AccountPage init", userInfo)
    })
  }

  updatePicture() {
    this.presentActionSheet();
    console.log('Clicked to update picture');
  }

  // Present an alert with the current user_name populated
  // clicking OK will update the user_name and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change user_name',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'user_name',
      value: this.userInfo.user_name,
      placeholder: 'user_name'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        // this.userData.setuser_name(data.user_name);
        this.userInfo.user_name = data.user_name;


        this.userData.updateUserInfo(this.userInfo)

      }
    });

    alert.present();
  }


  listenToErrorEvents(){
    this.events.subscribe('user:checkinCount', (checkinCount) => {
      console.log("account:checkinCount ", checkinCount);
      this.userInfo.checkinCount = checkinCount;

    });
  }


  logout() {
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }

  support() {
    this.nav.push(SupportPage);
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    // destinationType : Camera.DestinationType.DATA_URL,
    // for destinationType: Camera.DestinationType.FILE_URI (android) or
    // destinationType: Camera.DestinationType.NATIVE_URI (ios)
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, currentName);
      }
    }, (err) => {
      this.presentToast('Error while selecting image.' + err);
    });
  }

  // Create a new name for the image
  private createFileName() {
    // var fileName:string = "default_avatar.jpg"
    // if(typeof this.userInfo.phone != "undefined"){
    //   fileName =   this.userInfo.phone + ".jpg";
    // }
    var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log("copyFileToLocalDir","namePath " + namePath + " currentName " + currentName + "　newFileName "+　newFileName);

    this.file.checkDir(this.ROOT_DIR, this.IMAGE_DIR_NAME).then((exist) =>{
      console.log('Directory exists')
      this.copyImage(namePath,currentName,newFileName);

      }).catch((err) => {
      console.log("directory not exist")
      this.file.createDir(this.ROOT_DIR, this.IMAGE_DIR_NAME, true).then(() => {
        this.copyImage(namePath,currentName,newFileName);

    })
      .catch((err) => { console.log("error during creating directory", err)  });
    });

  }

  copyImage(namePath,currentName,newFileName){
    this.file.copyFile(namePath, currentName, this.IMAGE_DIR, newFileName).then(success => {
      //update image view
      var temp = this.userInfo.userAvatar;
      this.userInfo.userAvatar = this.pathForImage(newFileName);

      console.log('the image src path:', this.userInfo.userAvatar);
      this.userData.saveProfile(this.pathForImage(newFileName),this.userInfo.phone).then( (success) =>{
        console.log("copyImage:saveProfile",success)
        if(!success){//set image back when failed upload
          this.userInfo.userAvatar = temp;
        }
        this.init();
      })

      // this.presentToast('the image src path:'+ this.userAvatar)
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.IMAGE_DIR+ "/" + img;
    }
  }

}
