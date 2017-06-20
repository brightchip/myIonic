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
import {ChattingPage} from "../chatting/chatting";
import {ChatData} from "../../providers/chat-data";
import {find} from "rxjs/operator/find";


@Component({
  selector: 'page-view-account',
  templateUrl: 'view-account.html'
})
export class ViewAccountPage {
  selectedUser: {user_id?:any,user_name?: string, phone?: string, avatar?:string} = {};

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public platform:Platform,
              public events: Events,
              public actionSheetCtrl: ActionSheetController,
              public chatData:ChatData,
              public file: File,
              public userData: UserData) {
    this.selectedUser =   this.navParams.get('userinfo');
  }


  call(){

  }

  sendMsg(){
    let room = this.chatData.getRoom(this.selectedUser.user_id);
    console.log("goto Chatting page",room)
    this.navCtrl.push(ChattingPage,{isFromViewAccountPage:true,room: room});
  }


}
