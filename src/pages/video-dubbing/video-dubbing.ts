import {Component, ViewChild} from '@angular/core';
import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { VideoPlayer } from '@ionic-native/video-player';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";

import {AngularInview} from 'ionicInView';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import * as $ from 'jquery'
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import {MediaObject} from "@ionic-native/media";
import {NativeService} from "../../providers/mapUtil";

@Component({
  selector: 'page-video-dubbing',
  templateUrl: 'video-dubbing.html'
})
export class VideoDubbingPage {
  @ViewChild ("itroVideoPlayer") itroVideoPlayer: any[];

  actionSheet: ActionSheet;

  videoEditingSrc:"assets/video/sample2.mp4"
  videoDuration:any = 100;
  currentTime:any = 0;
  currentPlayingVideo : any;
  RECORDER_ICON:any = "assets/icon/record.png";
  PAUSE_ICON: string = "assets/icon/pause.png";
  btRecorderIcon = this.RECORDER_ICON;
  remnantTime = 4;
  TIME_TICKER = 4;

  recorder: MediaObject;

  isDubbing = null;
  isRecording = null;
  isCountingDown = null;
  disableRecordButton:boolean = null;
  customAudio = null;
  timer:any

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    private screenOrientation: ScreenOrientation,
    public nativeSevice:NativeService,
    // private videoPlayer: VideoPlayer
  ) {
    // console.log("Passed params", navParams.data);

  }

  startDub(){
    console.log("currentTime",this.currentTime)
    if(this.recorder == null || typeof this.recorder == "undefined"){
      this.nativeSevice.showToast("不能启动录音");
      return;
    }

    this.isDubbing = true;
    this.remnantTime = this.TIME_TICKER;

    let self = this;
    this.isCountingDown = true;
    this.timer = TimerObservable.create(0, 1000).subscribe(t => {
      console.log("count down",t);
      self.remnantTime -- ;
      if(self.remnantTime <= 0){
        this.isCountingDown = null;
        if(self.timer != null){
          self.timer.unsubscribe();
        }

        self.startRecording();
      }
    });
  }

  endDub(){
    this.stopRecording();
    this.isDubbing = null;
  }

  startDubbing(){
    if(this.isDubbing){
      this.endDub();
      return;
    }
   this.startDub();
  }

  startRecording(){
    console.log("startRecording...");
    if(this.recorder == null || typeof this.recorder == "undefined"){
      this.isRecording = null;
      return;
    }

    this.recorder.startRecord();
    this.isRecording = true;
    this.btRecorderIcon = this.PAUSE_ICON;
  }

  private stopRecording() {
    console.log("stopRecording...");
    if(this.recorder == null || typeof this.recorder == "undefined"){
      this.isRecording = null;
      return;
    }

    this.recorder.stopRecord();
    this.isRecording = null;
    this.customAudio = true;
    this.btRecorderIcon = this.RECORDER_ICON;
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
    var video =  $(' #videoEditing');
    console.log("addVideoControl",video)
    video.bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
      var state =  document.webkitIsFullScreen;
      var event = state ? 'FullscreenOn' : 'FullscreenOff';
      // Now do something interesting
      console.log('Event: ' + event);
      self.onFullScreen(state);
    });
  }

  findLocation(_specialEnglishBooks){
    console.log("findLocation");
  }


  playVideo(){
    console.log("playVideo");
  }

  ionViewDidEnter(){
    this.addVideoControl();
  }

  ionViewDidLeave() {

  }



}
