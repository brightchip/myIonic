import {Component, ViewChild} from '@angular/core';
import { ActionSheet, ActionSheetController, Config, NavController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { VideoPlayer } from '@ionic-native/video-player';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";
import { File  } from '@ionic-native/file';
import {AngularInview} from 'ionicInView';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import * as $ from 'jquery'
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import {MediaObject, MediaPlugin} from "@ionic-native/media";
import {NativeService} from "../../providers/mapUtil";
import {Tools} from "../../providers/tools";

@Component({
  selector: 'page-video-dubbing',
  templateUrl: 'video-dubbing.html'
})
export class VideoDubbingPage {
  @ViewChild ("itroVideoPlayer") itroVideoPlayer: any[];

  actionSheet: ActionSheet;

  videoEditingSrc:"assets/video/sample2.mp4"
  videoDuration:any = 0;
  currentTime:any = 0;
  videoProgress: any = 0;
  currentPlayingVideo : any;
  RECORDER_ICON:any = "assets/icon/record.png";
  PAUSE_ICON: string = "assets/icon/pause.png";
  STOP_ICON: string = "assets/icon/stopaudio.png";
  TEST_PLAY_ICON: string = "assets/icon/testaudio.png";
  btRecorderIcon = this.RECORDER_ICON;
  remnantTime = 4;
  TIME_TICKER = 4;

  recorder: MediaObject;

  isDubbing = null;
  isRecording = null;
  isCountingDown = null;
  isPlayingVideo:boolean = null;
  customAudio = null;
  timer:any
  showRecordRange = null;

  hasRecorded = false;

  videoIsPaused = true;

  currentStartTime :any ;
  currentStopTime: any ;

  arrAudioFragments = []
  private currentAudioPath: string = ""// = "assets/video/test.mp3";
  isPlayingTest:boolean = false;
  testAudioIcon = this.TEST_PLAY_ICON
  showNextButton: boolean = false;

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
    public file:File,
    public tools:Tools,
    public media: MediaPlugin,
    // private videoPlayer: VideoPlayer
  ) {
    // console.log("Passed params", navParams.data);
    // this.listenVideo();
  }

  startDub(){
    console.log("start dub...")
    this.videoIsPaused = null;
    this.isDubbing = true;
    this.remnantTime = this.TIME_TICKER;
    this.btRecorderIcon = this.PAUSE_ICON;
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

        self.recordAudio();
      }
    });
  }

  recordAudio(){
    let fileName = this.createFileName();

    // console.log("lesson:stopRecord", this.recordButtonIcon);
    this.file.checkDir(this.tools.ROOT_DIR, this.tools.AUDIO_DIR_NAME).then((exist) =>{
      console.log('Directory exists');
      this.startRecord(this.tools.ROOT_DIR,this.tools.AUDIO_DIR_NAME,fileName)
    }).catch( err => {
      console.log("directory not exist",err)
      console.log("lesson:createDir",this.tools.ROOT_DIR + this.tools.AUDIO_DIR_NAME)
      this.file.createDir(this.tools.ROOT_DIR, this.tools.AUDIO_DIR_NAME, true).then(() => {
        this.startRecord(this.tools.ROOT_DIR,this.tools.AUDIO_DIR_NAME,fileName)
      }).catch((err) => {
        console.error("error during creating directory", err)
        this.nativeSevice.showToast(err,2000);
      });
    })
  }

  startRecord(rootDir,audioDir,fileName){
    // console.log("lesson:startPauseRecord",rootDir  + audioDir  + "/" + fileName);
    try {

      $('#videoEditing').prop('muted', true)
      this.currentAudioPath = rootDir + audioDir + "/" + fileName;
      this.recorder = this.media.create(this.currentAudioPath);
      $('#videoEditing')[0].play();
      this.currentStartTime = this.currentTime;
      console.log("ready to recordAudio",fileName,"start at",this.currentStartTime,this.currentAudioPath);
      this.isPlayingTest = false;
      this.recorder.startRecord();
      this.isRecording = true;
      this.showRecordRange = true;


    }
    catch (e) {
      this.nativeSevice.showToast('Error on recording start.' );
      console.log("startRecord:Error",e)
      this.endDub();
    }
  }

  listenVideo(){

  }

  endDub(){
    try{

      this.isCountingDown = null;
      this.timer.unsubscribe();
      this.stopRecording();
      this.isDubbing = null;
      this.btRecorderIcon = this.RECORDER_ICON;
      this.videoIsPaused = true;
      this.showRecordRange = true;
      this.hasRecorded = true;
      console.log("end Dub")

    }catch (e){
      console.error("eendsub",e);
    }

  }

  startDubbing(){
    if(this.isDubbing){
      this.endDub();
      return;
    }
   this.startDub();
  }


  videoEnd() {
    console.log("videoEnd...");
    this.videoIsPaused = true;
    if(typeof $(' #audioTest')[0] != "undefined" && $(' #audioTest')[0] != null){
      $(' #audioTest')[0].pause();
    }


    if(this.isDubbing){
      this.isDubbing = null;
      this.isRecording = null;
      this.showNextButton = true;
      this.customAudio = true;
      this.currentStopTime =  this.videoDuration;
      // this.showRecordRange = null;
      this.customAudio = true;
      this.btRecorderIcon = this.RECORDER_ICON;
      this.generateAudioFragment(this.currentStartTime,this.currentStopTime,this.currentAudioPath);
    }

    if(this.recorder == null || typeof this.recorder == "undefined"){
      this.isRecording = null;
      return;
    }
    this.isPlayingTest = false;
    this.recorder.stopRecord();
    console.log("videoEnd...stopRecord");
  }

  private stopRecording() {
    console.log("stopRecording...");
    if(this.recorder == null || typeof this.recorder == "undefined"){
      this.isRecording = null;
      return;
    }

    this.recorder.stopRecord();
    console.log("stopRecording...stopRecord");
    $('#videoEditing')[0].pause();
    this.currentStopTime =  this.currentTime;
    this.isRecording = null;
    this.customAudio = true;
    this.btRecorderIcon = this.RECORDER_ICON;
    this.generateAudioFragment(this.currentStartTime,this.currentStopTime,this.currentAudioPath);
  }

  generateAudioFragment(recordStartTime,recordStopTime,audioPath){
    this.arrAudioFragments.push({startAt:recordStartTime,stopAt:recordStopTime,audioPath:audioPath})
    console.log("generateAudioFragment",this.arrAudioFragments);
  }


  testCustomRecord(){
    let video =   $(' #videoEditing')[0];
    let audio =   $(' #audioTest')[0];

    if(this.isPlayingTest){
      video.pause();
      audio.pause();

      this.endPlayDub()
      // this.isPlayingTest = false
      video.currentTime = this.currentTime = this.currentStopTime;
      console.log("pause test dubbing")
      // audio.currentTime = 0;
      return;
    }


    $(' #videoEditing').prop('muted', true);
    video.currentTime = this.currentTime = this.currentStartTime;
    audio.setAttribute('src',this.currentAudioPath);

    video.play();
    audio.play();
    this.isPlayingTest = true;
    this.videoIsPaused = null;
    this.testAudioIcon = this.STOP_ICON;
    console.log("testCustomRecord",this.currentTime,video.currentTime, this.currentStopTime,audio);
  }


  addVideoControl(){
    var self = this;

    // $(document).ready(function(){
      var video =  $(' #videoEditing');
      console.log("addVideoControl",video)

    this.videoDuration =  (video[0].duration).toFixed(2);
      video.on(
        "timeupdate",
        function(event){
          onTrackedVideoFrame(this.currentTime,this.duration);
        });

    video.on("pause", function (e) {
      console.log("Video paused. Current time of videoplay: " + e.target.currentTime );
      // self.isPlayingTest = false;
      this.videoIsPaused = true;
    });

    video.on('ended',function myHandler(e) {
      self.videoEnd();

      // What you want to do after the event
    });

    $(' #audioTest').bind('ended',function myHandler(e) {
      self.testAudioIcon = self.TEST_PLAY_ICON;
      self.isPlayingTest = false;
      self.endPlayDub();
    });

    $(' #audioTest').on("pause", function (e) {
      self.testAudioIcon = self.TEST_PLAY_ICON;
      self.isPlayingTest = false;
      self.endPlayDub();
    });


    // });

    function onTrackedVideoFrame(currentTime,duration){
      // console.log("onTrackedVideoFrame",currentTime,duration)
      if( self.isRecording || self.isPlayingTest){
        self.currentTime = currentTime.toFixed(2);
        if(self.isPlayingTest){
          if(parseFloat(self.currentTime) >=  parseFloat(self.currentStopTime)){
            self.endPlayDub();
          }

        }
        console.log("on dubbing or playing test...", self.currentTime );
      }

      self.videoDuration = duration.toFixed(2);
      self.videoProgress = (currentTime/duration*100).toFixed(2);


    }

  }

  endPlayDub(){
      $(' #videoEditing')[0].pause();
      $(' #audioTest')[0].pause();
      this.isPlayingTest = false;
      this.testAudioIcon = this.TEST_PLAY_ICON;
      this.videoIsPaused = true;
      console.log("on playing test finish...", this.currentTime,this.currentStopTime);
  }


  generateDubVideo(){
    console.log("generateDubVideo")
  }

  rangChange(event){
    if(this.videoDuration <= 0){
      return;
    }

    if(this.isDubbing || this.isPlayingTest){
     return;
    }
    console.log("rangChange",event.value);

    let video =  $(' #videoEditing');
    video[0].currentTime = event.value
    // this.currentStartTime = event.value

  }

  toggleVideo(){
    if(this.isDubbing || this.isPlayingTest){
      return;
    }
    let video =  $(' #videoEditing');
    let isPlaying =  !video[0].paused;
    if( !isPlaying ){
      video.prop('muted', false);
      video[0].play();
      this.isPlayingVideo = true;
      this.customAudio = null;
      this.videoIsPaused = null;
      this.showRecordRange = null;
      console.log("play video");
    }else {
      video[0].pause();
      this.videoIsPaused = true;
      this.isPlayingVideo = null;
      this.customAudio = true;
      if(this.hasRecorded){
        this.showRecordRange = true;
      }
      console.log("pause video");
    }
  }

  playVideo(){
    console.log("playVideo");
  }

  ionViewDidEnter(){
    this.addVideoControl();
  }

  ionViewDidLeave() {

  }

  private createFileName()  {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  this.userData.userInfo.phone + "_" + n + ".mp3";
    return newFileName;//this.vacabularys[this.currentIndex].word;
  }


}
