import {Component, ViewChild} from '@angular/core';
import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { VideoPlayer } from '@ionic-native/video-player';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";

import {AngularInview} from 'ionicInView';


@Component({
  selector: 'page-senglish',
  templateUrl: 'special-english.html'
})
export class SpecialEnglishPage {
  @ViewChild ("itroVideoPlayer") itroVideoPlayer: any[];

  actionSheet: ActionSheet;
  specialEnglishBooks: any[] = [{book_id:1,title:"book1",courseTimeSpan:9,content:"this is book1",logo:"assets/img/logos/se.png",videoIntroduction:"assets/video/sample.mp4"},
    {book_id:2,title:"book2",courseTimeSpan:9,content:"this is book2",logo:"assets/img/th.jpg",videoIntroduction:"assets/video/sample.mp4"},
    {book_id:2,title:"book3",courseTimeSpan:9,content:"this is book3",logo:"assets/img/nonnonbiyori.jpg",videoIntroduction:"assets/video/sample1.mp4"},
    {book_id:2,title:"book4",courseTimeSpan:9,content:"this is book4",logo:"assets/img/nonobiyori.jpg",videoIntroduction:"assets/video/sample2.mp4"}];

currentPlayingVideo : any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    // private videoPlayer: VideoPlayer
  ) {
    // console.log("Passed params", navParams.data);

  }

  gotoOnlineCourse(_specialEnglishBooks){
    console.log("gotoOnlineCourse");
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
