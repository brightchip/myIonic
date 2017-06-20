/**
 * Created by Winjoy on 5/19/2017.
 */
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';
import {httpEntity} from "./httpEntity";
import * as Enums from "./globals";
import {Events} from "ionic-angular";
import {Tools} from "./tools";
import {errorObject} from "rxjs/util/errorObject";


@Injectable()
export class Auth{

  BASE_URL = Enums.baseUrl + "/userRouter/";
  public token: any;

  constructor(public httpTools: httpEntity, public storage: Storage,public events:Events,private tools:Tools) {

  }

  checkAuthentication():Promise<any>{

    //Load token if exists
    return this.storage.get('token').then( (value) => {
      console.log("checkAuthentication local token value",value)
      this.token = value;
      let headers = new Headers();
      headers.append('Authorization', this.token);
      console.log("checkAuthentication", this.BASE_URL  + "protected",{headers: headers} );
        return   this.httpTools.sendGet(this.BASE_URL + "protected", {headers: headers})
          .toPromise()
        .then( res => {
          console.log("checkAuthentication success",res)
          return this.token;
      },err => {
        console.log("checkAuthentication err",err)

        throw (err);
      });
    });
  }

  create(userInfo):Promise<any>{
    this.tools.loadingContent = "正在注册..."
    this.tools.presentLoadingText();
        var reqData = JSON.stringify(userInfo);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        console.log("signup", this.BASE_URL  + " data:" + reqData );
    return    this.httpTools.sendPost(this.BASE_URL + "signUp", reqData,{headers: headers})
      .toPromise()
          .then(resData => {

            let  data =  JSON.parse(resData._body);  //1
            // console.log("success" , data);
            console.log("success signup resData",data);

            this.token = data.token;
            this.storage.set('token', data.token);

            return (data.user);
          }, error => {
            throw (error);
          });
      }

  newLogin(userReq):Promise<any>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var reqData = JSON.stringify(userReq);

        console.log("login", this.BASE_URL + "login" + reqData, {headers: headers});
    return  this.httpTools.sendPost(this.BASE_URL + "login", reqData, {headers: headers})
          .toPromise()
          .then( resData=> {
            let  data =  JSON.parse(resData._body);
            console.log("newLogin resData",data);

            this.token = data.token;
            this.storage.set('token', data.token);

            return (data.user);
          },error => {
            throw (error);
          })
      }

}
