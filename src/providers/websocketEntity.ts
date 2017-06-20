/**
 * Created by Winjoy on 5/3/2017.
 */
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import {Injectable} from '@angular/core';
import {Events}  from 'ionic-angular';
import * as Enums from "./globals";

@Injectable()
export class WebsocketEntity {
  ws: any;
  wsUrl = Enums.wsUrl;
  connected = false;

  constructor(public events:Events) {

  }

  connect(){
    setTimeout(() => {
      this.connectToServer();
    }, 3);
  }

  sendWebsocketMessage(client_id,eventType,eventData) : Promise<any>{
    let meessageObj = {eventType:eventType,
      eventData:eventData,
      client_id:client_id
    }
    console.log("sendWebsocketMessage",meessageObj);
    return this.sendData(meessageObj).then( ()=> {
      console.log("sendWebsocketMessage finished")

      return true
    }).catch( err => {
      console.log("sendWebsocketMessage err",err)
      throw err;
    })
  }

  connectToServer() {
    if(this.connected){
      return;
    }
    console.log("websocket create connection to " + this.wsUrl )
    this.ws = new $WebSocket(this.wsUrl,["echo-protocol"]);
    this.connected = true;
    this.events.publish("ws-connected",true)
    console.log("ws-connected")
    // set received message callback
    this.ws.onMessage(
      (msg: MessageEvent) => {
        console.log("onMessage ", msg.data);
          if(typeof msg.data == "undefined"){
            console.log("onMessage:undefined");
            return
          }
          this.handle(JSON.parse(msg.data));

      },
      {autoApply: false}
    );

    this.ws.onClose( ()=>{
        console.log("websocket:onClose");
        this.ws.reconnect();
      console.log("websocket:reconnected");
    })

// set received message stream
    this.ws.getDataStream().subscribe(
      (msg) => {
        // console.log("websocket:next", msg);
      },
      (msg) => {
        console.log("error", msg);
      },
      () => {
        // console.log("websocket:complete");
        return true;
      }

    );

    // this.sendData("ionic websocket client");
  }

  sendData(dataSending) : Promise<any>{
    console.log("websocket:sendData",dataSending)
    // send with default send mode (now default send mode is Observer)
   return this.ws.send(JSON.stringify(dataSending))
     .toPromise()
     .then(
       () => {
         console.log("websocket:complete");
         return true;
       },
      (err) => {
        console.log("websocket:error", err);
        throw err;
      }

    );
  }

  closeConnection(){
    console.log("websocket","close connection")
    // this.ws.close(false);    // close
    this.ws.close(true);    // close immediately
  }

  private handle(eventObj: any) {
    // let eventType = eventObj.eventType;
    if(typeof eventObj.eventType == "undefined" || typeof eventObj.eventData == "undefined" ){
      console.log("websocketentity:handle unknow data format")
      return;
    }
    console.log("websocketentity:publish",eventObj.eventType)
    this.events.publish(eventObj.eventType,eventObj.eventData )

    // switch (eventType){
    //   case "updateComment":
    //     this.events.publish(eventType,updateComment )
    //     break;
    // }

  }
}
