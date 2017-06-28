import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
import {LessonPage} from "../lesson/lesson";
import {UserData} from "../../providers/user-data";
import {NativeService} from "../../providers/mapUtil";

@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})
export class CoursePage {
  actionSheet: ActionSheet;

  myLesson:any={lessonName:"lesson1",
    video:"assets/video/sample.mp4",
    comments:"comments",
    likes:3,
    homework:"homework",
    profile:"assets/img/logos/se.png",
    vocabularyWork:"vocabulary work"}

  // myLesson:Lesson =  new Lesson("lesson1","assets/video/sample.mp4","comments",3,"homework","vocabulary work");

  title;


  myLessonList:any[]=[this.myLesson,this.myLesson];
  private selectedCourse: any;


  constructor(
              public  navCtrl:NavController,
              public  navParams: NavParams,
              public userData: UserData,
              public config: Config,
              public inAppBrowser: InAppBrowser,
              public nativeSevice:NativeService
              ) {

    this.selectedCourse =   this.navParams.get('course');
    this.title = this.selectedCourse.title;
    console.log("Passed params", navParams.data);
    // this.myLesson = new Lesson("lesson1","assets/video/sample.mp4","comments",3,"homework","vocabulary work");
    // this.myLesson = new Lesson();
    // this.myLesson.video = "assets/video/sample.mp4";
    // this.myLesson.comments = "comments";
    // this.myLesson.likes = 3;
    // this.myLesson.homeWork = "homework";
    // this.myLesson.vocabularyWork = "vocabulary work";
    this.myLessonList.push(this.myLesson);
    this.myLessonList.push(this.myLesson);

  }

  ionViewDidEnter(){
    this.nativeSevice.showLoading("正在加载...");

    this.userData.findLessons(this.selectedCourse.book_name).then( result => {
      if(result != null && typeof result != "undefined"){
        this.myLessonList = result;
        console.log("init myLessonList",this.myLessonList);
      }
      this.nativeSevice.hideLoading();
    }).catch( e=> {
      this.nativeSevice.hideLoading();
    })
  }

  gotoLesson(lesson:any){
    this.navCtrl.push(LessonPage,{lesson:lesson,course_id:this.selectedCourse.book_id });
  }


}
