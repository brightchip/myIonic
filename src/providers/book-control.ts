/**
 * Created by Winjoy on 5/19/2017.
 */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import * as Enums from "./globals";
import {UserData} from "./user-data";

import {NativeService} from "./mapUtil";
import {httpEntity} from "./httpEntity";
import {DBHelper} from "./dbhelper";
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {Events} from "ionic-angular";
@Injectable()
export class BookControl {

  // BASE_URL = Enums.baseUrl + "/userRouter/";

  specialCourses:any = [];
  CITY_JSON:string = "assets/data/china-city-master/city-code.json"

  // specialCourses: any[] = [
  //   {book_id:1,title:"动感音标",courseTimeSpan:9,content:"this is 动感音标",logo:"assets/img/logos/se.png",videoIntroduction:"assets/video/sample.mp4"},
  //   {book_id:2,title:"酷玩单词",courseTimeSpan:9,content:"this is 酷玩单词",logo:"assets/img/th.jpg",videoIntroduction:"assets/video/sample.mp4"},
  //   {book_id:3,title:"魅力语法",courseTimeSpan:9,content:"this is 魅力语法",logo:"assets/img/nonnonbiyori.jpg",videoIntroduction:"assets/video/sample1.mp4"},
  //   {book_id:4,title:"嘻哈语法",courseTimeSpan:9,content:"this is 嘻哈语法",logo:"assets/img/nonobiyori.jpg",videoIntroduction:"assets/video/sample2.mp4"}];
  constructor(
    public nativeSevice:NativeService,
    public userData: UserData,
    public httpTools:httpEntity,
    public dbHelper : DBHelper,
    public events: Events,
    public  http:Http
  ) {
    // this.loadCourses();
    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.events.subscribe('db:init', () => {
      // this.enableMenu(true);
      this.loadCourses();
      // this.loadCourses().then( (data) => {
      //   this.MyRecommedCourses = this.bookControl.specialCourses;
      // })


      console.log("app component", "login")
    });
  }

  loadCourses() : Promise<any>{
    return new Promise(resolve => {
      if(this.specialCourses.length < 1){
        console.log("loadCourses initlize courses")
        this.nativeSevice.showLoading("正在加载...");
        // this.specialCourses = this.userData.findCourses();
       return this.userData.findCourses().then( result => {
          this.nativeSevice.hideLoading();
          if(result != null && typeof result != "undefined"){
             this.specialCourses = result;

            console.log("init specialCourses",result);
            resolve(result);
          }
        })
      }else {
           console.log("loadCourse load history courses")
           resolve(this.specialCourses);

      }
    })
  }


  loadCityList(){
    console.log("loadCityList...")

    this.http.get('location/of/data').subscribe(data => {
      console.log("loadCityList",data);
    });

    // return this.httpTools.sendGet(this.CITY_JSON,{})
    //   .then(resData => {
    //     console.log("loadCityList res data ?", resData);
    //     console.log("loadCityList province 1", resData[0]);
    //     return true;
    //   }, error => {
    //     console.error("loadCityList",error)
    //     return [];
    //     // return;
    //   });
  }

/*  loadCityList(){
    console.log("loadCityList...")
    return this.dbHelper.getAllProvinces()
      .then(resData => {
        console.log("loadCityList res data ?", resData);
        return true;
      }, error => {
        console.error("loadCityList",error)
        return [];
        // return;
      });
  }*/

}
