import {Component, NgZone} from '@angular/core';

import { ActionSheet, ActionSheetController,  NavController,NavParams } from 'ionic-angular';


import {BookControl} from "../../providers/book-control";

import {UserData} from "../../providers/user-data";
import {SchoolDetailPage} from "../school-detail/school-detail";
import {httpEntity} from "../../providers/httpEntity";


@Component({
  selector: 'page-schools',
  templateUrl: 'schools.html'
})
export class SchoolListPage {
  actionSheet: ActionSheet;
  course1:any = {course_profile:"assets/img/anime1.jpg",course_name:"A",content:["learn how to write A"]}
  course2:any = {course_profile:"assets/img/anime2.jpg",course_name:"B",content:["learn how to write B"]}
  course3:any = {course_profile:"assets/img/anime3.jpg",course_name:"C",content:["learn how to write C"]}
  school:any  = {school_id:1,school_profile:"assets/img/th.jpg",school_name:"s1",distance:"300m",school_content:"school 1 error TS2688: Cannot find type definition file for 'node'. · Issue #213 ",courses:[],activities:[]}
  school2:any  = {school_id:2,school_profile:"assets/img/nonobiyori.jpg",school_name:"s2",distance:"15m",school_content:"school 2",courses:[this.course1,this.course2,this.course1,this.course3,this.course2,this.course1],activities:[]}
  arrSchool:any = [this.school,this.school2,this.school,this.school2]

  // provinceList:any = [{name:"A"},{name:"B"},{name:"C"}];
  // cityList:any = [];
  // subCityList:any = [];
  // selectedCity:any = 0;
  // selectedSubCity:any = 0

  cityData: any[]; //城市数据
  cityName:string = '北京市 北京市 东城区'; //初始化城市名
  code:string; //城市编码

  province:any

  CITY_JSON:string = "assets/data/china-city-master/city-code.json";
  private subcity: any;
  private city: any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public httpTool: httpEntity,
    public userData: UserData,
  public ngZone:NgZone,
  ) {
    console.log("Passed params", navParams.data);
    this.setCityPickerData();
  }

  viewSchool(schoolInfo){
    console.log("viewSchool",schoolInfo)
    this.navCtrl.push(SchoolDetailPage,{school:schoolInfo})
  }


  /**
   * 获取城市数据
   */
  setCityPickerData(){
    this.httpTool.getCitiesData()
      .then( data => {
        console.log("setCityPickerData")
        this.ngZone.run( () => {
          this.cityData = data;
          if(this.userData.userInfo.location != null && typeof  this.userData.userInfo.location != "undefined"){
            this.cityName = this.userData.userInfo.location;
            console.log("setCityPickerData", this.cityData,this.cityName)
            this.getSchoolList();
          }

        })
      });
  }

  /**
   * 城市选择器被改变时触发的事件
   * @param event
   */
  cityChange(event){
    console.log(event);
    this.ngZone.run( () => {
      this.code = event['region'].value
      console.log("cityChange",this.cityName)
    })
  }

  // onProvinceChange(){
  //   console.log("onProvinceChange",this.province)
  //   this.cityList = this.province.cities;
  //   this.subCityList = [];
  //
  // }
  //
  // onCityChange(){
  //   console.log("onCityChange",this.city)
  //   this.subCityList = this.city.cities;
  //   // console.log("init",this.provinceList,this.cityList,this.subCityList)
  // }
  //
  // onSubCityChange(){
  //   console.log("onSubCityChange",this.subcity)
  // }

  ionViewDidEnter(){
    // this.userData.findCity(this.CITY_JSON).then( data=>{
    //   this.provinceList = data;
    //
    // })
    // this.bookControl.loadCityList();
    this.getSchoolList();
  }

  getSchoolList(){
    this.userData.retriveSchoolList(this.cityName).then(dat =>{
      console.log("getSchoolList",dat);
      this.arrSchool = dat;
    });
  }

}
