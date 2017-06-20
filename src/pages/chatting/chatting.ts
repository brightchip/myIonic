import {Component, NgZone, ViewChild} from '@angular/core';

import {
  ActionSheetController, AlertController, Events, List, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import {Camera, CameraOptions} from "@ionic-native/camera";

import { File  } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import {ViewAccountPage} from "../view-account/view-account";
import {WebsocketEntity} from "../../providers/websocketEntity";
import {ChatData} from "../../providers/chat-data";
import {Tools} from "../../providers/tools";

@Component({
  selector: 'page-chatting',
  templateUrl: 'chatting.html'
})
export class ChattingPage {
  selectedUser?:any;
  room:any={};
  chatDatas:any = [];
  chatBox?:string = "";
  toggled:boolean = false;
  isTyping = false;
  subTiltleInfo = "";
  btRecorder:any;
  isSpeaking = false;
  inSpeaking = true;
  isHasInit = false;
  TEXTHOLD = "按住说话"
  TEXTCANCEL = "释放手指取消发送"
  TEXTSLIDE = "向上滑动取消发送"
  proptText = this.TEXTHOLD;
  ICON_CANCEL = "assets/icon/cancel.png";
  ICON_RECODER = "assets/icon/recoder.png"
  ICON_KEYBOARD = "assets/icon/keyboard.png"
  iconProptImg = this.ICON_RECODER
  inputIcon = this.ICON_RECODER;
  @ViewChild ("chatList") chatList:any;
  @ViewChild ("list") list:any;
  @ViewChild ("dumpy") dumpy:any;

  // @ViewChild ("iconPropt") iconPropt:any;
  iconPropt :any;
  // @ViewChild ("btRecorder") btRecorder:any;
  scrollHeight:any = 0;
  isFromViewAccountPage:false;

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public platform:Platform,
              public events: Events,
              public actionSheetCtrl: ActionSheetController,
              public camera: Camera,
              public toastCtrl :ToastController,
              public file: File,
              public websocket: WebsocketEntity,
              public tools:Tools,
              public chatData:ChatData,
              public ngZone:NgZone,
              public userData: UserData) {
    // this.listenToErrorEvents();

    this.isFromViewAccountPage = this.navParams.get('isFromViewAccountPage');
    let room =   this.navParams.get('room');
    if(typeof room != "undefined"){
      this.chatDatas = room.chatDatas;
    }
    this.selectedUser =  room.userInfo;// {user_id:room.userInfo.user_id,user_name:room.user_name,avatar:room.avatar}
    console.log("chatting construstor",room,this.chatDatas,this.selectedUser);
  }

  toggleInput(){
    this.isSpeaking = !this.isSpeaking
    if(this.isSpeaking){
      this.inputIcon = this.ICON_KEYBOARD
      if(this.btRecorder != null){
        this.btRecorder.style.display  = "block";
      }
    }else {
      this.inputIcon = this.ICON_RECODER
      if(this.btRecorder != null){
        this.btRecorder.style.display  = "none";
      }
    }

  }

  addAudioInput(){
    console.log("addAudioInput");
    this.btRecorder  = document.getElementById("bt-recorder");
    this.iconPropt = document.getElementById("icon-prompt");
    this.btRecorder.style.display  = "none";
    this.inSpeaking = false;
    console.log("iconPropt",this.iconPropt)

    var self = this;
    var touchStartY = 600;

    var touchStart = function(event) {
      self.ngZone.run( () => {
        self.inSpeaking = true;
        self.proptText = self.TEXTSLIDE;
        if(self.iconPropt != null && typeof self.iconPropt != "undefined"){
          self.iconPropt.src = self.ICON_RECODER;
          self.iconProptImg = self.ICON_RECODER;
          touchStartY =   event.changedTouches[0].pageY
          console.log("touchStart", touchStartY);
        }
      })
    }　

    function touchEnd(event) {
      self.inSpeaking = false;
      self.proptText = self.TEXTHOLD;
      self.ngZone.run( () => {
        console.log("touchEnd", self.proptText,self.iconPropt );
      })
    }

    function  touchMove(event) {
      self.ngZone.run( () => {
        // console.log("touchMove x:", event.changedTouches[0].pageX + ', y: ' + event.changedTouches[0].pageY);
        if(self.iconPropt != null && typeof self.iconPropt != "undefined"){
            if(event.changedTouches[0].pageY < (touchStartY - 50)){
              self.proptText = self.TEXTSLIDE;
              self.iconPropt.src = self.ICON_RECODER;
              self.iconProptImg = self.ICON_RECODER;
              // console.log("touchMove inside button", self.proptText,self.iconPropt,self );
            }else {
              self.proptText = self.TEXTCANCEL;
              self.iconPropt.src = self.ICON_CANCEL;
              self.iconProptImg = self.ICON_CANCEL;
              // console.log("touchMove outside button", self.proptText,self.iconPropt,self );
            }

        }
      })

    }

    function touchCancel(event) {
      console.log("touchCancel");
    }

      this.btRecorder.addEventListener("touchstart", touchStart, false);
      this.btRecorder.addEventListener("touchend", touchEnd, false);
      this.btRecorder.addEventListener("touchmove", touchMove, false);
      this.btRecorder.addEventListener("touchcancel", touchCancel, false);


  }

  ionViewDidEnter() {
    // this.init();
    if(!this.isHasInit){
      this.addAudioInput();
      this.isHasInit = true
    }

    this.listenToEvents();
    this.updateChatUI(-1);
    // this.inSpeaking = false;
    // this.arrMessage = this.chatData.arrMessages;
  }

  private init() {
    // this.chatData.init();
    // let tmp = this.chatData.getRoom(this.selectedUser.user_id);
    // if(typeof tmp != "undefined"){
    this.chatDatas = this.chatData.getRoom(this.selectedUser.user_id);
    // }else {
    //   console.log("chatting init getChatDatas undefined");
    // }
    console.log("chatting init",this.chatDatas);


  }

  pickEmoji(event){
    // comment.toggled =  !comment.toggled;
    this.chatBox = this.chatBox + " " + event.char;
    console.log("pickEmoji",this.chatBox);
  }

  send(){
    // this.tools.getImageUrl(this.userData.userInfo.avatar)
    let message = this.chatBox;
    if(message.length < 1){
      console.log("send chat no message")
      return;
    }
    this.chatBox = "";
    let chatData = {
      send_id:this.userData.userInfo.user_id,
      receive_id:this.selectedUser.user_id,
      isSending:true,
      sendFailed:false,
      hasContent:true,
      content:message}
    this.chatDatas.push(chatData);
    let hei =  message.length
    this.updateChatUI(hei);
    this.chatData.sendChatMessage(this.userData.userInfo.user_id,chatData)
      .then( () => {
        chatData.isSending = false;
        chatData.sendFailed = false;
        console.log("chatting page send success")
        // this.updateChatUI(chatData);
      }).catch( err => {
      chatData.isSending = false;
      chatData.sendFailed = true;
      console.log("chatting page sendFailed")
      // this.updateChatUI(chatData);
    })
  }

  updateChatUI(hei){//new chatData
    // let array = .tools.deepClone(this.chatDatas);
    // array.push(chatData);
    // this.chatDatas = array;
    // console.log("updateChatUI",this.chatDatas);
    // console.log("this.list.getContentDimensions().contentHeight",this.chatList.offsetHeight);
    if(this.scrollHeight <= 0){
      this.scrollHeight = this.calculateHeight(this.chatDatas);
    }else {
      this.scrollHeight += hei
    }
    console.log("updateChatUI",this.chatDatas,this.scrollHeight);
    try {
      if(this.scrollHeight > 0 &&  this.chatList != null) {
        if(this.chatList != null && typeof this.chatList != "undefined"){
          this.chatList.scrollTo(0, this.scrollHeight, 700);
        }

      }
    }catch (err){
      console.error("updateChatUI",err);
    }


  }

  focusChange(isFocusing){
    if(this.isTyping != isFocusing){
      this.toggled = false;
      this.isTyping = isFocusing;
      // let message = {isTyping:isFocusing};
      this.chatData.sendChatMessage(this.userData.userInfo.user_id,{send_id:this.userData.userInfo.user_id,receive_id:this.selectedUser.user_id,isTyping:isFocusing});
    }
  }

  gotoViewUser(comment){
    // console.log("gotoViewUser",this.navCtrl.indexOf(ChattingPage))
    this.navCtrl.pop();
    if(this.isFromViewAccountPage){
      console.log("gotoViewUser",this.isFromViewAccountPage)
        return;
    }else {
      console.log("gotoViewUser",this.isFromViewAccountPage)
     this.navCtrl.push(ViewAccountPage,{userinfo: this.selectedUser});
    }



  }

  listenToEvents() {
    // this.events.subscribe("initChatRoom", (data) => {
    //   console.log("lisenEvents:initChatRoom", data)
    //   if (data.messages.length > 0) {
    //     this.chatDatas = data;
    //     let hei =  data.content.lenth/10
    //     this.updateChatUI();
    //   }
    // });

    this.events.subscribe("chat", (data) => {
      this.subTiltleInfo = "";
      if (data.receiverOffline) {//offline msg
        console.log("lisenEvents:chat oppsite is offline")
        this.subTiltleInfo = "Offline"
        return;
      } else if (data.isTyping) {
        this.subTiltleInfo = "Typing..."
        console.log("lisenEvents:chat oppsite is typing")
      } else if (typeof data.content != "undefined") {
       let hei =  data.content.length
        // this.ngZone.run(() => {
        //   this.chatDatas.push(data);
        this.updateChatUI(hei);
        // })
        // console.log("lisenEvents:chat new data",this.chatDatas,  this.chatData.arrRooms)
      }
    })

  }

  private calculateHeight(chatDatas: any) {
    let height = 2000;
    if(typeof chatDatas != "undefined") {
      for (let i = 0; i < chatDatas.length; i++) {
        console.log("calculateHeight chatDatas[i].content ", chatDatas[i].content)
        if (typeof chatDatas[i].content != "undefined") {
          height += chatDatas[i].content.length;
        }
      }
    }
    console.log("calculateHeight",height)
    return height;
  }

}
