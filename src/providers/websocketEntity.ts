/**
 * Created by Winjoy on 5/3/2017.
 */
import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import {Injectable} from '@angular/core';
import {Events}  from 'ionic-angular';

@Injectable()
export class WebsocketEntity {
  ws: any;

  constructor(public events:Events) {

  }

  connect() {
    this.ws = new $WebSocket("ws://192.168.0.102:8080",["echo-protocol"]);

    // set received message callback
    this.ws.onMessage(
      (msg: MessageEvent) => {
        console.log("onMessage ", msg.data);
        this.handle(msg.data);
      },
      {autoApply: false}
    );

    this.ws.onClose( ()=>{
        console.log("websocket:onClose");
        this.ws.reconnect();
    })

// set received message stream
    this.ws.getDataStream().subscribe(
      (msg) => {
        console.log("next", msg.data);
        // this.ws.close(false);
      },
      (msg) => {
        console.log("error", msg);
      },
      () => {
        console.log("complete");
      }
    );

    this.sendData("ionic websocket client");
  }

  sendData(dataSending){
    console.log("websocket:sendData",dataSending)
    // send with default send mode (now default send mode is Observer)
    this.ws.send(dataSending).subscribe(
      (msg) => {
        console.log("websocket:next", msg.data);
      },
      (msg) => {
        console.log("websocket:error", msg);
      },
      () => {
        console.log("websocket:complete");
      }
    );
  }


  closeConnection(){
    console.log("websocket","close connection")
    this.ws.close(false);    // close
    // this.ws.close(true);    // close immediately
  }


  private handle(eventObj: any) {
    // let eventType = eventObj.eventType;
    this.events.publish(eventObj.eventType,eventObj.eventData )//updateComment,
    // switch (eventType){
    //   case "updateComment":
    //     this.events.publish(eventType,updateComment )
    //     break;
    // }

  }
}
