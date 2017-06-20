/**
 * Created by Winjoy on 5/19/2017.
 */
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {httpEntity} from "./httpEntity";
import * as Enums from "./globals";
import {UserData} from "./user-data";
import {Events} from "ionic-angular";
import {Tools} from "./tools";
import {Auth} from "./auth";


@Injectable()
export class UserControl {
  BASE_URL = Enums.baseUrl + "/userRouter/";

  constructor(public httpTools: httpEntity, public storage: Storage,public events:Events,private tools:Tools,public auth:Auth) {

  }

  updateUserInfo(userInfo):Promise<any>{
    var reqData = JSON.stringify(userInfo);
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    console.log("updateUserInfo", this.BASE_URL  + "updateUserInfo" , reqData, {headers: headers});
   return this.httpTools.sendPost(this.BASE_URL + "updateUserInfo", reqData, {headers: headers})
      .then(resData => {
        let  data =  JSON.parse(resData._body);  //1
          console.log("success updateUserInfo",data);
          return data;
      }, error => {
        console.log("user:updateUserInfo failed",error);
        this.tools.presentToast(" 更新失败！");
        // this.presentToast(" 更新失败！");
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }

  retriveUserInfo(user_id: any): Promise<any>{
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    console.log("retriveUserInfo", this.BASE_URL  + "retriveUserInfo" + "?user_id=" + user_id ,{headers:headers});
    return this.httpTools.sendGet(this.BASE_URL + "retriveUserInfo" + "?user_id=" + user_id ,{headers:headers})
      .then( resData=> {
        console.log("retriveUserInfo res data ?", resData);
        let  data =  resData;

        return data;
      }, error => {
        console.log("Oooops!" + error);
        console.log("retriveUserInfo failed");
        return ;

      });
  }



  postComment(tmp):Promise<any> {
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    var reqData = JSON.stringify(tmp);
    console.log("postComment", this.BASE_URL + " Comment:" + reqData,{headers:headers});
    return   this.httpTools.sendPost(this.BASE_URL + "postComment", reqData,{headers:headers})
      .toPromise()
      .then( resData=> {
        let  data =  JSON.parse(resData._body);
        console.log("success ? ", data);
        if(data.success){
          let comment = this.tools.handleResCommentData(data)
          let eventObj = {eventType:"updateComment",eventData:comment};
          this.tools.notifyUpdate(eventObj);
          return comment[0]
        } else {
          return null;
        }

      }, error => {
        console.log("Oooops!" + error);
        return null;
      });
  }



  retriveComments(phone,lesson_id) : Promise<any>{
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    console.log("getComments", this.BASE_URL  + "getComments" + "?lesson_id=" + lesson_id + "&phone=" + phone,{headers:headers});
    return this.httpTools.sendGet(this.BASE_URL + "getComments" + "?lesson_id=" + lesson_id + "&phone=" + phone,{headers:headers})
      .then( resData=> {
        console.log("getComments res data ?", resData);
        let  data =  resData;

          return this.tools.handleResCommentData(data);

      }, error => {
        console.log("Oooops!" + error);
        console.log("getComments failed");
        return ;

      });
  }

  thumbUp(user_id,liked_id,table_name) {
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    let likeData = {user_id:user_id,liked_id:liked_id,table_name:table_name}
    var reqData = JSON.stringify(likeData);
    console.log("thumbUp", this.BASE_URL  + "thumbUp" , reqData ,{headers:headers});
    this.httpTools.sendPost(this.BASE_URL + "thumbUp", reqData,{headers:headers})
      .then(resData => {
        let  data =  JSON.parse(resData._body);  //1
        console.log("success thumbUp",data);

      }, error => {

        this.tools.presentToast(" 更新失败！");
        console.log("user:thumbUp failed",error);
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }

}
