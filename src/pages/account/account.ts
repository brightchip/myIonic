import { Component } from '@angular/core';

import {ActionSheetController, AlertController, Events, NavController, Platform, ToastController} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import {Camera, CameraOptions} from "@ionic-native/camera";

import { File  } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import {Tools} from "../../providers/tools";


@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  ROOT_DIR;
  IMAGE_DIR;
  IMAGE_DIR_NAME;

  // userInfo: {user_name?: string, checkinCount?: string,avatar?:string,phone?:string} = {};


  constructor(public alertCtrl: AlertController, public nav: NavController, public platform:Platform,  public events: Events,public actionSheetCtrl: ActionSheetController,
              public camera: Camera,public toastCtrl :ToastController, public file: File,private filePath: FilePath,public userData: UserData,public tools:Tools) {
    // this.listenToErrorEvents();

    //initialize platform root directory
      this.ROOT_DIR = tools.ROOT_DIR;
    this.IMAGE_DIR = tools.IMAGE_DIR;
    this.IMAGE_DIR_NAME = tools.IMAGE_DIR_NAME;
      // console.log("account page externalDataDirectory ",this.file.externalDataDirectory + " externalRootDirectory " + this.file.externalRootDirectory)
    // }
    // console.log("account page",this.IMAGE_DIR);
  }

  ionViewDidEnter() {
    this.init();
  }

  init(){
    // this.userInfo = this.userData.userInfo;
    // this.userData.getDefaultUserData().then( _ => {
    //
    // }).catch( err => {
    //   // this.checkin();
    // })
    console.log("init account",this.userData.userInfo)
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
      title: '修改用户名',
      buttons: [
        '取消'
      ]
    });
    alert.addInput({
      name: 'user_name',
      value: this.userData.userInfo.user_name,
      placeholder: '用户名'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        // this.userData.setuser_name(data.user_name);
        // let temp = this.userData.userInfo.user_name;
        // this.userData.userInfo.user_name = data.user_name;

        let reqUserInfo = {user_name:data.user_name,user_id:this.userData.userInfo.user_id};

        this.userData.updateUserInfo(reqUserInfo).then( (results => {
          // this.userData.userInfo.user_name = data.user_name;

        })).catch(err => {
          // this.userData.userInfo.user_name = temp;
        } )



      }
    });

    alert.present();
  }


  listenToErrorEvents(){
    // this.events.subscribe('user:checkinCount', (checkinCount) => {
    //   console.log("account:checkinCount ", checkinCount);
    //   this.userData.userInfo.checkinCount = checkinCount;
    //
    // });
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
      title: '选择图片来源',
      buttons: [
        {
          text: '从图库中选择',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: '拍照',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: '取消',
          role: '取消'
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
      this.presentToast('错误.' + err);
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
      prefeix = this.userData.userInfo.user_id + "_",
      newFileName = prefeix +  n + ".jpg";
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
      var temp = this.userData.userInfo.avatar;
      this.userData.userInfo.avatar = this.pathForImage(newFileName);

      console.log('the image src path:', this.userData.userInfo.avatar);
      this.userData.saveProfile(this.pathForImage(newFileName),newFileName,temp).then( (success) =>{
        console.log("copyImage:saveProfile",success)
        if(!success){//set image back when failed upload
          this.userData.userInfo.avatar = temp;
        }
        this.init();
      })
      // this.presentToast('the image src path:'+ this.avatar)
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
