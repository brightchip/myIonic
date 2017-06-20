import { Component } from '@angular/core';

import {ActionSheet, ActionSheetController, Config, NavController, NavParams, Slides} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import {UserData} from "../../providers/user-data";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import * as $ from 'jquery'

@Component({
  selector: 'page-veducation',
  templateUrl: 'vacation-education.html'
})

export class VacationEducationPage {
  actionSheet: ActionSheet;
  speakers: any[] = [];

  MyEducationVacation : any = {
    img:["assets/img/th.jpg",
    "assets/img/nonnonbiyori.jpg",
    "assets/img/nonobiyori.jpg"],
    introVideo: "assets/video/kmb.mp4",
    content:"Wellcome to Vacationing Education! have  nice study days"};

  VacaClasses :any[] = [{ id:0,title:"学前班",img: "assets/img/school.png",subtitle:""},
    { id:1,title:"中期班",img:"assets/img/school.png",subtitle:"（讲不听，打死！）"},
    { id:2,title:"国际版",img:"assets/img/school.png",subtitle:""}];


  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    private screenOrientation: ScreenOrientation,
  ) {
    console.log("Passed params", navParams.data);

  }

  slideChanged(slider: Slides){
    console.log("VacationEducationPage::slideChanged" + slider.loop);
    slider.startAutoplay();
  }

  ionViewDidEnter(){
    $('#vaceduVideo').play();
  }

  ionViewDidLeave(){
    $('#vaceduVideo').pause();
  }

  gotoClasses(id:any){
    console.log("VacationEducationPage::gotoClasses" + id);
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
    var video =  $('#vaceduVideo');
    console.log("addVideoControl",video)
    video.bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
      var state =  document.webkitIsFullScreen;
      var event = state ? 'FullscreenOn' : 'FullscreenOff';
      // Now do something interesting
      console.log('Event: ' + event);
      self.onFullScreen(state);
    });
  }

}
