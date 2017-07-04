import {Component, ViewChild} from '@angular/core';

import {Events, NavController, Slides, Tabs} from 'ionic-angular';

import * as Enums from "../../providers/globals";
import {UserData} from "../../providers/user-data";

import {Tools} from "../../providers/tools";
import {MapPage} from "../map/map";
import {BookControl} from "../../providers/book-control";
import {CoursePage} from "../course/course";
import {SchoolListPage} from "../schools/schools";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild ("btCheckin") btCheckin:any;
  @ViewChild('slides') slides: Slides;

  MyHomeData = Enums.HomeData;
  MyLogos = Enums.Logos;
  MyIU = Enums.iuInfo;
  checkedin:any = null;
  checkingText:string="签到";

  MyRecommedCourses : any []= [
  {title:"动感音标",course_content:"Hip-hop学英语（四年级之前必学）",course_img:"assets/img/logos/se.png",likes:4,comments:1},
  {title:"酷玩单词",course_content:"This is course2",course_img:"assets/img/logos/se.png",likes:4,comments:2},
  {title:"魅力语法",course_content:"This is course3",course_img:"assets/img/logos/se.png",likes:7,comments:3},
  {title:"嘻哈语法",course_content:"This is course4",course_img:"assets/img/logos/se.png",likes:4,comments:4},];


  constructor(
  public navCtrl: NavController,
  public events: Events,
  public tools:Tools,
  public bookControl:BookControl,
  public userData: UserData)
  {
    // this.content.addCssClass("scroll");,private app: App
    console.log("home","constructor created")

  }


  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.init();

    if(typeof this.slides == "undefined"){
      console.log("home","undefined slides");
      return;
    }
    try {
      setTimeout(() => {
        console.log("home","startAutoplay slides");
        // this.slides.slideNext(1000);
        this.slides.slideTo(1, 500);
        console.log("init home recommend courses")

        // this.slides.update();

      }, 3);
    }
    catch(err){
      console.error("home",err);
    }

    // this.userData.retriveHomework(1);
  }

  ionViewWillLeave(){
    this.slides.stopAutoplay();
  }

  slideAuto(){
    // console.log("HomePage::slideAuto" );
  }

  gotoSpecialCourse(_specialEnglishBooks){
    console.log("gotoOnlineCourse");
    this.navCtrl.push(CoursePage,{course:_specialEnglishBooks });
  }

  slideChanged(slider: Slides){
    try {
      console.log("HomePage::slideChanged" + slider.loop);
      if(typeof slider == "undefined"){
        return;
      }
      slider.startAutoplay();

    }
    catch (e){
      console.log("slideChanged",e)
    }

  }

  slideChange(){
    let currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', currentIndex);
  }

  gotoCardsPage(page_id:any){
    switch (page_id){
      case 1:
        // this.navCtrl.push(SpecialEnglishPage);
        this.selectTab(1);
        break;
      case 2:
        // this.navCtrl.push(VacationEducationPage);
        this.selectTab(3);
        break;
      case 3:
        //i-u education
        break;
      case 4:
        //i-u community
        break;
      case 5:
        // this.navCtrl.push(OnlineCoursesPage);
        this.selectTab(2);
        break;
      case 6:
        //market
        this.userData.retriveCourses();
        break;
      case 7:
        //schools recommending
        console.log("goto mappage")
        this.navCtrl.push(SchoolListPage);
        break;
      default:
        break;
    }
    // console.log("HomePage::gotoCardsPage",page_id);
    // this.userData.retriveCourses();
  }

  goinfoPage(page_id:any){
    console.log("HomePage::goinfoPage",page_id);
  }

  showMore(){

  }

  selectTab(index: number) {
    var t: Tabs = this.navCtrl.parent;
    t.select(index);
  }

  thumbUp(selectedCourse:any){
    console.log("HomePage::thumbUp");
    selectedCourse.likes ++;
  }

  showComments(selectedCourse:any){
    // console.log("HomePage::showComments",selectedCourse.course_content);
  }

  gotoCourse(selectedCourse:any){
    console.log("HomePage::gotoCourse",selectedCourse.course_content);
  }


  checkin(){
    console.log("checkin");
    this.checkedin = true;
    this.userData.dailyCheckin().then( (isSuccess) => {
      this.updateUI(true);
      console.log("checkin",isSuccess)
    }).catch( err => {
      console.error("checkin",err)
      this.updateUI(false);
    })

    // this.btCheckin.backgroundColor = "#8f8f8f"
  }

  init(){
    // console.log("init:getDefaultUserData")
    // this.userData.getDefaultUserData().then( (userInfo) =>{
    //   console.log("homeinit:userInfo", userInfo)
    //   if(typeof userInfo != "undefined"){
    //     this.updateUI(userInfo.hasChecin);
    //   }else {
    //     console.log("init", "userInfo undefined")
    //   }
    // })
    this.userData.getDefaultUserData().then( _ => {
      this.updateUI(this.userData.userInfo.hasChecin);
    }).catch( err => {
      // this.checkin();
    })

    this.bookControl.loadCourses().then( (data) => {
      this.MyRecommedCourses = this.bookControl.specialCourses;
    })


  }

updateUI(isSuccess){
    console.log("home:updateUI",isSuccess)
  if(isSuccess){
    this.checkingText ="已签到";
    this.checkedin = true;

  }else {
    this.checkingText ="签到";
    this.checkedin = null;
  }
}


}
