import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController,  NavController,NavParams } from 'ionic-angular';


import {BookControl} from "../../providers/book-control";

import {UserData} from "../../providers/user-data";
import {SchoolDetailPage} from "../school-detail/school-detail";


@Component({
  selector: 'page-community',
  templateUrl: 'community.html'
})
export class CommunityPage {
  actionSheet: ActionSheet;
  shop1:any = {shop_profile:"assets/img/anime1.jpg",shop_name:"shop1",shop_content:["learn how to write A"]}
  shop2:any = {shop_profile:"assets/img/anime2.jpg",shop_name:"B",shop_content:["learn how to write B"]}
  shop3:any = {shop_profile:"assets/img/anime3.jpg",shop_name:"C",shop_content:["learn how to write C"]}
  arrShop:any = [this.shop1,this.shop2,this.shop3,this.shop2]


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

  ionViewDidEnter(){

    // this.bookControl.loadCityList();
  }

}
