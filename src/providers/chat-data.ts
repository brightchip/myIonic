/**
 * Created by Winjoy on 5/25/2017.
 */
import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';
import {WebsocketEntity} from "./websocketEntity";
import {SQLite, StatusBar} from "ionic-native";
import {DBHelper} from "./dbhelper";
import {UserData} from "./user-data";
import {find} from "rxjs/operator/find";
import { Storage } from '@ionic/storage';


@Injectable()
export class ChatData {

  arrRooms?:any = [];
  public testVar: string;
  hasInitialized = false;

  selectedUser?:any;
  chatDatas?:any = [
    // {isSender:false,
    // isSending:true,
    // sendFailed:false,
    // content:"hihihi!i am robot!"},{
    // isSender:true,
    // isSending:true,
    // sendFailed:false,
    // content:"dufaq!robot"}
  ];

  constructor(public events: Events,
              // public dbHelper: DBHelper,
              public userData:UserData,
              public storage: Storage,
              public websocket: WebsocketEntity) {

    console.log("ChatData construction")
    this.listenToEvents();
    // this.retriveAllChatDatas(this.userData.userInfo.user_id)
  }

  public  init()  {
    console.log("init chat room list from remote server")
    this.userData.getDefaultUserData().then( () => {
      this.retriveAllChatDatas(this.userData.userInfo.user_id);
    }).catch(err => {
      console.error("init chat room list from remote server",err);
    })

  }

  sendChatMessage(client_id,chatData) : Promise<any>{
    // if(chatData.hasContent){
    //
    // }
    let meessageObj = {eventType:"chat",
      eventData:chatData,
      client_id:client_id
    }
    console.log("sendChatMessage",meessageObj);

   return this.websocket.sendData(meessageObj).then( ()=> {
      console.log("sendChatMessage finished")
     this.handleLocalChatLog(chatData)
     return true
    }).catch( err => {
      console.log("sendChatMessage err",err)
     this.handleLocalChatLog(chatData)
     throw err;
    })


  }

  sendWebsocketMessage(client_id,eventType,eventData) : Promise<any>{
    return this.websocket.sendWebsocketMessage(client_id,eventType,eventData).then( ()=> {
      return true
    }).catch( err => {

      throw err;
    })
    // let meessageObj = {eventType:eventType,
    //   eventData:eventData,
    //   client_id:client_id
    // }
    // console.log("sendWebsocketMessage",meessageObj);
    //
    // return this.websocket.sendData(meessageObj).then( ()=> {
    //   console.log("sendWebsocketMessage finished")
    //
    //   return true
    // }).catch( err => {
    //   console.log("sendWebsocketMessage err",err)
    //
    //   throw err;
    // })
  }

  // login(user_id){
  //   this.sendWebsocketMessage("login",user_id).then( () => {
  //     console.log("login websocket success");
  //     this.init(user_id,"*");
  //   }).catch( err => {
  //     console.log("login websocket failed");
  //   })
  // }

  saveChatLog(){
    if(typeof this.userData.userInfo.user_id != "undefined"){
      this.storage.set("chatlogs" + this.userData.userInfo.user_id, this.arrRooms);
    }
  }

  getChatLog() :Promise<any>{
    if(typeof this.userData.userInfo.user_id != "undefined"){
     return   this.storage.get("chatlogs" + this.userData.userInfo.user_id).then((chatlogs) => {
        if(chatlogs != null && typeof chatlogs != "undefined"){
          this.arrRooms = chatlogs;
          console.log("init chatlog from local storage")
        }
        this.init();
      }).catch( err => {
        console.error("chat-data page get local chatlogs",err);
        this.init();
      })
  }else {
      return;
  }
}

  retriveAllChatDatas(user_id){
    console.log("retriveAllChatDatas",user_id)
    this.sendChatMessage(user_id,{send_id:user_id,init_list:true}).then( () => {
      console.log("retriveAllChatDatas finished")
    }).catch( err => {
      console.log("retriveAllChatDatas err",err)
    })
  }



  private listenToEvents() {
    this.events.subscribe("ws-connected", (connected) => {
      console.log("chat-data page lisenEvents:ws-connected",connected);
      if(connected){
        this.getChatLog();
      }
    });

    this.events.subscribe("initChatList", (data) => {
      if (typeof data != "undefined") {
        if(data.length > 0){
          console.log("chat-data  lisenEvents:initChatList",data,"length",data.length)
          for(let j=0;j<=data.length - 1 ;j++){
            this.handleRoomData(data[j]);
          }
          this.saveChatLog();
          //tell server offline messages sync success
          this.sendWebsocketMessage(this.userData.userInfo.user_id,"chat",{send_id:this.userData.userInfo.user_id,syncOfflineMsg:true })
          this.hasInitialized = true;
        }
      }else {
        console.log("chat-data  lisenEvents:initChatList undefined data")
      }

    });

    this.events.subscribe("chat", (data) => {
      if(data.hasContent){
        if (typeof data.content != "undefined") {
          console.log("chat-data lisenEvents:chat new data", data)
          var room = this.getRoom(data.send_id)
          room.chatDatas.push(data);
          room.lastMessage = data.content;
          // this.updateChatUI();
          this.saveChatLog();
          console.log("lisenEvents:chat new data", this.arrRooms)
        }
      }
    })
  }

  handleRoomData(data){
    try {
      if(typeof data != "undefined"){
        let remoteUserId = data.send_id;
        var room = this.getRoom(remoteUserId);
        (room.chatDatas).concat(data);
        room.lastMessage = data[data.length - 1].content;
        console.error("handleRoomData sync chat logs use",data);
        this.saveChatLog();
      }
    }catch (err){
      console.error("handleRoomData",err);　
    }

      // console.log("handleRoomData add offline messages",messages,room);


  }

  getRoom(user_id):any{
    let room = this.findRoom(user_id);
    if(!room){
     room = this.createRoom(user_id,[])
    }
    console.log("getRoomChatDatas return",room);
    return room;
  }

  findRoom(user_id){
    console.log("findRoom",user_id,this.arrRooms)
    for(let i =0;i<this.arrRooms.length;i++){
      // console.log("findRoom",this.arrRooms[i].user_id ,"compare to",user_id)
      if(this.arrRooms[i].userInfo.user_id == user_id){
        // console.log("findRoom:chatDatas",this.arrRooms[i].chatDatas)
        return this.arrRooms[i];
      }
    }
    return false;
  }

  private handleLocalChatLog(chatData: any) {
    this.saveChatLog();
  }

  private createRoom(user_id: any,messages) {
    // var room = {user_id:user_id ,chatDatas:[],user_name:"",avatar:"",lastMessage:"",lastDate:""};
    // var room = {userInfo:{} ,chatDatas:[],lastMessage:"",lastDate:""};
    // console.log("createRoom",room)
    console.log("createRoom generate room",user_id,messages)
    let lastMsg = "";
    if(typeof messages[messages.length - 1] != "undefined"){
      lastMsg = messages[messages.length - 1].content;
    }
    var room = {userInfo:this.userData.findUserInfo(user_id),chatDatas:messages,lastMessage:lastMsg,lastDate:""};
    // this.userData.findUserInfo(remoteUserId).then( (userInfo) => {
    //   console.log("handleRoomData update room userInfo",userInfo)
    //   room.userInfo = userInfo
    //   // room.user_name = userInfo.user_name
    //   // room.avatar = userInfo.avatar
    // })
    // room.userInfo =  this.userData.findUserInfo(user_id)
    this.arrRooms.push(room);
    console.log("handleRoomData add new room",room);

    return room;
  }

}
