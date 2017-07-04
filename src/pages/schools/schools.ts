import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController,  NavController,NavParams } from 'ionic-angular';


import {BookControl} from "../../providers/book-control";

import {UserData} from "../../providers/user-data";
import {SchoolDetailPage} from "../school-detail/school-detail";


@Component({
  selector: 'page-schools',
  templateUrl: 'schools.html'
})
export class SchoolListPage {
  actionSheet: ActionSheet;
  school:any  = {school_id:1,school_profile:"assets/img/th.jpg",school_name:"s1",distance:"300m",school_content:"school 1 error TS2688: Cannot find type definition file for 'node'. · Issue #213 ",courses:[],activities:[]}
  school2:any  = {school_id:2,school_profile:"assets/img/nonobiyori.jpg",school_name:"s2",distance:"15m",school_content:"school 2",courses:[],activities:[]}
  arrSchool:any = [this.school,this.school2]

  provinceList:any = [{name:"A"},{name:"B"},{name:"C"}];
  cityList:any = [];
  subCityList:any = [];
  selectedCity:any = 0;
  selectedSubCity:any = 0

  province:any

  CITY_JSON:string = "assets/data/china-city-master/city-code.json";
  private subcity: any;
  private city: any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public bookControl: BookControl,
    public userData: UserData
  ) {
    console.log("Passed params", navParams.data);

  }

  viewSchool(schoolInfo){
    console.log("viewSchool",schoolInfo)
    this.navCtrl.push(SchoolDetailPage,{school:schoolInfo})
  }

  onProvinceChange(){
    console.log("onProvinceChange",this.province)
    this.cityList = this.province.cities;
    this.subCityList = [];

  }

  onCityChange(){
    console.log("onCityChange",this.city)
    this.subCityList = this.city.cities;
    // console.log("init",this.provinceList,this.cityList,this.subCityList)
  }

  onSubCityChange(){
    console.log("onSubCityChange",this.subcity)
  }

  ionViewDidEnter(){
    this.userData.findCity(this.CITY_JSON).then( data=>{
      this.provinceList = data;

    })
    // this.bookControl.loadCityList();
  }

}
