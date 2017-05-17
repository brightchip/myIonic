import {Component, ViewChild} from '@angular/core';

import {Events, NavController, Slides, Tabs} from 'ionic-angular';
import {startAutoplay} from "ionic-angular/components/slides/swiper/swiper";
import * as Enums from "../../providers/globals";
import {UserData} from "../../providers/user-data";
import {SpecialEnglishPage} from "../special-english/special-english";
import {VacationEducationPage} from "../vacation-education/vacation-education";
import {OnlineCoursesPage} from "../online-courses/online-courses";
import {ImagePicker} from "@ionic-native/image-picker";
import {isSuccess} from "@angular/http/src/http_utils";


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
  public userData: UserData)
  {
    // this.content.addCssClass("scroll");,private app: App
    console.log("home","constructor created")

  }


  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    console.log("home","ionViewDidEnter");
    this.slides.startAutoplay();
    this.init();
  }


  slideChanged(slider: Slides){
   console.log("HomePage::slideChanged" + slider.loop);
   slider.startAutoplay();
  }


  gotoCardsPage(page_id:any){
    switch (page_id){
      case 1:
        // this.navCtrl.push(SpecialEnglishPage);
        this.selectTab(1);
        break;
      case 2:
        this.navCtrl.push(VacationEducationPage);
        this.selectTab(3);
        break;
      case 3:
        //i-u education
        break;
      case 4:
        //i-u community
        break;
      case 5:
        this.navCtrl.push(OnlineCoursesPage);
        this.selectTab(2);
        break;
      case 6:
        //market
        this.userData.retriveCourses();
        break;
      case 7:
        //schools recommending
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


  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.slides.update();

    this.userData.testVar = "home";

    this.userData.retriveHomework(1);
  }

  checkin(){
    console.log("checkin");
    this.checkedin = true;
    this.userData.dailyCheckin().then( (isSuccess) => {
      this.updateUI(isSuccess);
    })
    // this.btCheckin.backgroundColor = "#8f8f8f"
  }

  init(){
    // console.log("init:getDefaultUserData")
    this.userData.getDefaultUserData().then( (userInfo) =>{
      console.log("homeinit:userInfo", userInfo)
      if(typeof userInfo != "undefined"){
        this.updateUI(userInfo.hasChecin);
      }else {
        console.log("init", "userInfo undefined")
      }
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
