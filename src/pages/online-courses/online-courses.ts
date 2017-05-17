import {Component, ViewChild} from '@angular/core';
import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";
import {CoursePage} from "../course/course";



@Component({
  selector: 'page-online-courses',
  templateUrl: 'online-courses.html'
})
export class OnlineCoursesPage {
  actionSheet: ActionSheet;


  studentCourses: any[] = [
    {book_id:1,title:"动感音标",courseTimeSpan:9,content:"this is 动感音标",logo:"assets/img/logos/se.png",videoIntroduction:"assets/video/sample.mp4"},
    {book_id:2,title:"酷玩单词",courseTimeSpan:9,content:"this is 酷玩单词",logo:"assets/img/th.jpg",videoIntroduction:"assets/video/sample.mp4"},
    {book_id:2,title:"魅力语法",courseTimeSpan:9,content:"this is 魅力语法",logo:"assets/img/nonnonbiyori.jpg",videoIntroduction:"assets/video/sample1.mp4"},
    {book_id:2,title:"嘻哈语法",courseTimeSpan:9,content:"this is 嘻哈语法",logo:"assets/img/nonobiyori.jpg",videoIntroduction:"assets/video/sample2.mp4"}];

  course :string = "student";


  // @ViewChild ("segement") course:any;
  @ViewChild('tab') myTab: any;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
  ) {
    // console.log("Passed params", navParams.data);
    // test this.mySelectedIndex = navParams.data.tabIndex || 0;

  }

  gotoCourse(promo:any){
    console.log("gotoCourse", promo);

    this.navCtrl.push(CoursePage,{title:promo.title });


  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page

  }



}
