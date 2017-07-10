import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController,  NavController,NavParams } from 'ionic-angular';


import {BookControl} from "../../providers/book-control";

import {UserData} from "../../providers/user-data";


@Component({
  selector: 'page-school-detail',
  templateUrl: 'school-detail.html'
})
export class SchoolDetailPage {
  actionSheet: ActionSheet;

  school:any = {};
  schoolCourseList:any = [];

  school_parts: string = "preview";


  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public bookControl: BookControl,
    public userData: UserData
  ) {
    console.log("Passed params", navParams.data);
    this.school =   this.navParams.get('school');
  }


  ionViewDidEnter(){

  }

  segmentChanged(){

  }

}
