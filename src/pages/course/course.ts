import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
import {LessonPage} from "../lesson/lesson";

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
              public confData: ConferenceData,
              public config: Config,
              public inAppBrowser: InAppBrowser,
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

  gotoLesson(lesson:any){
    this.navCtrl.push(LessonPage,{lesson:lesson,course_id:this.selectedCourse.book_id });
  }


}
