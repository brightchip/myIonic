import {Component, ViewChild} from '@angular/core';
import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { VideoPlayer } from '@ionic-native/video-player';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";

import {AngularInview} from 'ionicInView';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import * as $ from 'jquery'
import {CoursePage} from "../course/course";

@Component({
  selector: 'page-senglish',
  templateUrl: 'special-english.html'
})
export class SpecialEnglishPage {
  @ViewChild ("itroVideoPlayer") itroVideoPlayer: any[];

  actionSheet: ActionSheet;


  specialCourses: any[] = [
    {book_id:1,title:"动感音标",courseTimeSpan:9,content:"this is 动感音标",logo:"assets/img/logos/se.png",videoIntroduction:"assets/video/sample.mp4"},
    {book_id:2,title:"酷玩单词",courseTimeSpan:9,content:"this is 酷玩单词",logo:"assets/img/th.jpg",videoIntroduction:"assets/video/sample.mp4"},
    {book_id:3,title:"魅力语法",courseTimeSpan:9,content:"this is 魅力语法",logo:"assets/img/nonnonbiyori.jpg",videoIntroduction:"assets/video/sample1.mp4"},
    {book_id:4,title:"嘻哈语法",courseTimeSpan:9,content:"this is 嘻哈语法",logo:"assets/img/nonobiyori.jpg",videoIntroduction:"assets/video/sample2.mp4"}];


currentPlayingVideo : any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    private screenOrientation: ScreenOrientation,
    // private videoPlayer: VideoPlayer
  ) {
    // console.log("Passed params", navParams.data);

  }

  onFullScreen(state) {
      // get current
      // console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'
      if(state){
        // Disable orientation lock
        this.screenOrientation.unlock();
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }else {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
      console.log("fullScreen has end!",this.screenOrientation.type);
    }

  addVideoControl(){
    var self = this;
    var video =  $(' #specengVideo');
    console.log("addVideoControl",video)
    video.bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
      var state =  document.webkitIsFullScreen;
      var event = state ? 'FullscreenOn' : 'FullscreenOff';
      // Now do something interesting
      console.log('Event: ' + event);
      self.onFullScreen(state);
    });
  }

  gotoSpecialCourse(_specialEnglishBooks){
    console.log("gotoOnlineCourse");
    this.navCtrl.push(CoursePage,{course:_specialEnglishBooks });
  }

  findLocation(_specialEnglishBooks){
    console.log("findLocation");
  }


  playVideo(){
    console.log("playVideo");
  }

  lineInView(index:number,inview:boolean, inviewpart:any){
    console.log("lineInView",index);
  }

  ionViewDidEnter(){
    this.addVideoControl();
  }

  ionViewDidLeave() {
    this.pauseVideo();

  }

  videoPlayed(specialEnglishBooks:any){

    // if( this.currentPlayingVideo != specialEnglishBooks.index && specialEnglishBooks.index){
    //   let videoPlayer = this.itroVideoPlayer[this.currentPlayingVideo].nativeElement;
    //   videoPlayer.pause();
    // }
    //
    // this.currentPlayingVideo = specialEnglishBooks.index;
    console.log("videoPlayed",specialEnglishBooks);

  }


  pauseVideo(){
    // this.itroVideoPlayer.pause();
    // for(var i=0;i<this.itroVideoPlayer.length;i++){
    //   let videoPlayer = this.itroVideoPlayer[i].nativeElement;
    //   videoPlayer.pause();
    // }
    console.log("pauseVideo");
  }

  toggleVideo(index) {
    // let videoPlayer = this.itroVideoPlayer[index].nativeElement;
    // videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
  }


}
