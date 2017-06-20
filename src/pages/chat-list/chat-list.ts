import {Component, NgZone} from '@angular/core';
import { Events, NavController, NavParams} from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import {ChatData} from "../../providers/chat-data";
import {ChattingPage} from "../chatting/chatting";



@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html'
})
export class ChatListPage {

  arrMessage?:any = [];

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public chatData:ChatData,
              private ngZone:NgZone,
              public userData: UserData) {

              console.log("chat-list page ");
  }

  ionViewDidEnter() {

    this.chatData.getChatLog().then(() =>{
      this.arrMessage = this.chatData.arrRooms;
    })

    console.log("chat-list",this.arrMessage);
    // this.listenToEvents();
  }


  listenToEvents(){
    this.events.subscribe("initChatList", (data) => {
      let arrRoom = [];
      console.log("chat-list page lisenEvents:initChatList",data,"length",data.length)
      for(let j=0;j<=data.length - 1 ;j++){
        let arrUse = data[j].users;
        let messages = data[j].messages;
        console.log("process",arrUse,arrUse.length)

        if(arrUse.length >= 2){
          let remoteUserId = arrUse[0] == this.userData.userInfo.user_id ? arrUse[1]:arrUse[0];
          //   console.log("process",arrUse[i],"compare to",this.userData.userInfo.user_id)
              var room = {user_id:remoteUserId ,chatDatas:messages,user_name:"",avatar:"",lastMessage:messages[messages.length - 1],lastDate:""};
              console.log("chat-list page lisenEvents:initChatList generate room",room)
              this.userData.findUserInfo(remoteUserId).then( (userInfo) => {
                room.user_name = userInfo.user_name
                room.avatar = userInfo.avatar
              })
          arrRoom.push(room);
        }
      }
      this.arrMessage = arrRoom;

    });
  }

  gotoChatting(room){
    this.navCtrl.push(ChattingPage,{room: room});
  }

}
