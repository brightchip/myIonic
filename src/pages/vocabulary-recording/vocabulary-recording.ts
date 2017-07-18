import {Component, NgZone, ViewChild} from '@angular/core';
import {NativeService} from "../../providers/mapUtil";
import {UserData} from "../../providers/user-data";
import {MediaObject, MediaPlugin} from "@ionic-native/media";
import { File  } from '@ionic-native/file';
import * as $ from 'jquery'
import * as Enums from "../../providers/globals";
import {Tools} from "../../providers/tools";
import {AlertController, NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'vocabulary-recording',
  templateUrl: 'vocabulary-recording.html'
})
export class VocabularyRecordingPage {

  @ViewChild ("slides") slides:any;
  START_RECORD_ICON: string = "assets/icon/record.png";
  PAUSE_ICON: string = "assets/icon/pause.png";
  PLAY_ICON: string = "assets/icon/testaudio.png";

  dirExist = false;

  private currentIndex: number = 0;
  disableRecordButton:boolean = null;
  // lesson_id:number = 1;
  samplePlayer: MediaObject ;
  playButtonText:string = "Play";
  playButtonIcon:string = this.PLAY_ICON
  recordButtonIcon:string = this.START_RECORD_ICON;
  testButtonIcon:string = this.PLAY_ICON;
  isRecording:boolean = false;
  isPlaying:boolean = null;
  TEXTHOLD = "按住下面按钮录音"
  TEXTCANCEL = "释放手指取消录音"
  TEXTSLIDE = "录音中..."
  TEXT_SUBMIT = "提交作业"
  TEXT_NEXT = "下一个"
  RESUME_RECORD_ICON: string = "assets/icon/rec.png";
  proptText = this.TEXTHOLD;
  disablePlayButton:boolean = true;
  disableArrowButton:boolean = null;
  disableNextButton:boolean = true;
  vacabularys :any = [];
  rootDir;
  audioDir:string = Enums.AUDIO_DIR_NAME;
  recorder: MediaObject;
  testPlayer: MediaObject ;
  btRecorder:any;
  playIndex:number = 0;
  audioPaths:any;

  nextSubmitText = this.TEXT_NEXT


  onStatusUpdate = (status) => console.log(status);
  onSuccess = () => {
    // this.events.publish('play:finish');
    this.ngZone.run(() => {
      this.playButtonText = "Test";
      this.playButtonIcon = this.PLAY_ICON;
      this.disableRecordButton = null;
      console.log('play finish.' + this.testButtonIcon + this.isPlaying + this.disableRecordButton);
    });
  }
  onError = ((error) =>{
    this.disableRecordButton = null;
    this.testButtonIcon = this.PLAY_ICON;
    console.error(error.message);
  });
  onSamplePlaySuccess = () => {
    this.ngZone.run(() => {
      this.disableRecordButton = null;
      console.log('play finish.' + this.testButtonIcon + this.isPlaying + this.disableRecordButton);
    });
  }
  private lesson: any;
  private isStudent: any;
  homeWork:any;
  isReview = true;
  isWork = null;

  constructor(
    public nativeSevice:NativeService,
    public  navParams: NavParams,
    public navCtrl: NavController,
    public userData:UserData,
    public media: MediaPlugin,
    private ngZone: NgZone,
    public tools: Tools,
    public file: File,
    public alertCtrl: AlertController
  ) {
    this.rootDir = this.tools.getRootDir();

    this.lesson =  this.navParams.get('lesson');
    this.isStudent =  this.navParams.get('isStudent');

    this.homeWork =  this.navParams.get('homeWork');

    console.log("rootDir", this.isStudent,this.homeWork);
  }

  ionViewDidEnter(){
    this.nativeSevice.showLoading("正在加载...");


    if(this.isStudent){
      this.initStudentPage();

    }else {
      this.initTeacherPage()
    }

  }

  handleHomework(){

    if(this.homeWork != null && typeof this.homeWork != "undefined"){
      this.isReview = true;
      this.isWork = null;
      this.nativeSevice.showLoading("正在加载作业...")
      this.tools.downloadHomework(this.homeWork).then( downloadResult=> {
        this.nativeSevice.hideLoading();
      })
      for(let i = 0;i<this.vacabularys.length;i++){
        if(this.homeWork[i] != null &&  typeof this.homeWork[i] != "undefined"){
          this.vacabularys[this.currentIndex].userAudio = this.tools.getAudioUrl(this.homeWork[i]);
        }
      }

    }
    console.log("handleHomework",this.homeWork.length,this.vacabularys);
  }

  initTeacherPage(){

  }

  initStudentPage(){
    if(this.btRecorder == null || typeof this.btRecorder == "undefined") {
      this.addAudioInput();
      this.playSampleAudio()
      // self.isHasInit = true
    }
    this.disableNextButton = true;
    if(typeof this.slides != "undefined" && this.slides != null){
      this.slides.lockSwipes(true);
    }

    if(this.vacabularys == null || typeof this.vacabularys == "undefined" || this.vacabularys.length < 1){
      this.initVocabularyFiles().then( _ => {
        this.nativeSevice.hideLoading();
      })
    }else {
      this.nativeSevice.hideLoading();
    }
  }


  slideChanged() {
    if(typeof this.slides != "undefined"){
      this.currentIndex = this.slides.getActiveIndex();
      console.log("vacabularyUpdated", this.currentIndex);
      this.playSampleAudio();
    }
    if(this.currentIndex >= this.vacabularys.length- 1 ){
      this.readyForSubmit();
    }

  }

  readyForSubmit(){
    console.log("readyForSubmit")
    this.nextSubmitText = this.TEXT_SUBMIT;
    this.disableNextButton = null;
  }

  initVocabularyFiles() : Promise<any>{
    return this.userData.findVocabulary(this.lesson.lesson_id).then( result => {
      if(result != null && typeof result != "undefined"){
        this.vacabularys = result;
        this.handleHomework()
        console.log("initVocabularyFiles",this.vacabularys);
      }
      return
    })

  }

  playSampleAudio(){
    if(this.isReview){
      return;
    }
    try {
      if(this.vacabularys.length < 1 ){
        return;
      }
      this.disableRecordButton = true;
      console.log("lesson:playSampleAudio", this.vacabularys[this.currentIndex].sampleAudio);

      this.samplePlayer = this.media.create(this.vacabularys[this.currentIndex].sampleAudio, this.onStatusUpdate, this.onSamplePlaySuccess, this.onError);
      if (this.samplePlayer) {
        console.log("lesson:playSampleAudio", "playing");
        // this.testButtonIcon = this.PAUSE_ICON;
        this.samplePlayer.play();
        this.isPlaying = true;
      }
    }
    catch (e){
      this.disableRecordButton = null;
      console.error("playSampleAudio:Error",e)
    }

  }



  nextStep(){
    // this.disableNextButton = true;
    if(this.currentIndex < this.vacabularys.length - 1){//go to next
      this.disableNextButton = true;
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
      console.log("go to next word")
    }else {
      // this.disablePlayButton = true;
      // this.disableArrowButton = true;
      this.disableRecordButton = true;
      this.userData.submitHomework(this.vacabularys,this.userData.userInfo.user_id,this.lesson.lesson_id).then( (success) => {
        // this.disablePlayButton = null;
        this.disableRecordButton = null;
        console.log("lesson:submitHomework",success);
      })
    }
  }

  addAudioInput(){
    var self = this;
    // $(document).ready(function() {
      this.btRecorder = document.getElementById("bt-recorder");

      if (this.btRecorder != null && typeof this.btRecorder != "undefined") {
        var touchStart = function (event) {
          // console.log("touchStart",self)
          self.startPauseRecord(true);
          self.proptText = self.TEXTSLIDE;
          console.log("touchStart", self.proptText)

        }
        var touchEnd = function (event) {
          self.startPauseRecord(false);
          self.proptText = self.TEXTHOLD;
          console.log("touchEnd", self.proptText)
        }
        // var touchMove = function (event) {
        //
        //   // console.log("touchMove x:", event.changedTouches[0].pageX + ', y: ' + event.changedTouches[0].pageY);
        //   if (event.changedTouches[0].pageY < 570 ) {
        //     self.proptText = self.TEXTSLIDE;
        //
        //   } else {
        //     self.proptText = self.TEXTCANCEL;
        //   }
        //
        // }
        this.btRecorder.addEventListener("touchstart", touchStart, false);
        this.btRecorder.addEventListener("touchend", touchEnd, false);
        // this.btRecorder.addEventListener("touchmove", touchMove, false);
        console.log("lesson page", "addAudioInput", this.btRecorder,"add events");
      }
    // });
  }

  startPauseRecord(record) {
    let fileName = this.createFileName();
    console.log('startPauseRecord' + record);
    if(!record) {//stop record
     this.stopRecord();
    }
    else {
      console.log("lesson:startRecord");
      if(this.dirExist){
        this.startRecord(this.rootDir,this.audioDir,fileName);
      }else {
        // console.log("lesson:stopRecord", this.recordButtonIcon);
        this.file.checkDir(this.rootDir, this.audioDir).then((exist) =>{
          // console.log('Directory exists');
          this.dirExist = true;
          this.startRecord(this.rootDir,this.audioDir,fileName)
        }).catch( err => {
          // console.log("directory not exist",err)
          console.log("lesson:createDir",this.rootDir + this.audioDir)
          this.file.createDir(this.rootDir, this.audioDir, true).then(() => {
            this.dirExist = true;
            this.startRecord(this.rootDir,this.audioDir,fileName)
          }).catch((err) => {
            console.error("error during creating directory", err)
            this.nativeSevice.showToast(err,2000);
          });
        })
      }

    }
  }

  stopRecord(){
    if(this.recorder == null || typeof this.recorder == "undefined"){
      console.log("recorder is null when try to stop recording")
      return;
    }
    try {
      this.recorder.stopRecord();
      console.log("lesson:stopRecord");
      this.recordButtonIcon = this.START_RECORD_ICON;
      this.isRecording = false;
      this.disablePlayButton = null;
      this.disableArrowButton = null;
      this.disableNextButton = null;
      console.log("lesson:stopRecord", this.recordButtonIcon);
    }catch (e){
      console.error("stopRecord",e)
      this.recordButtonIcon = this.START_RECORD_ICON;
      this.isRecording = false;
      // this.disablePlayButton = null;
      this.disableArrowButton = null;
      this.nativeSevice.showToast("录音发生错误")

    }

  }

  startRecord(rootDir,audioDir,fileName){
    // console.log("lesson:startPauseRecord",rootDir  + audioDir  + "/" + fileName);
    try {
      this.disablePlayButton = true;
      this.disableArrowButton = true;
      this.vacabularys[this.currentIndex].userAudio = rootDir + audioDir + "/" + fileName;
      console.log("lesson:startRecord",this.vacabularys[this.currentIndex].userAudio);
      this.recorder = this.media.create(this.vacabularys[this.currentIndex].userAudio);
      this.recorder.startRecord();
      this.isRecording = true;
      this.recordButtonIcon = this.RESUME_RECORD_ICON;

    }
    catch (e) {
      this.recordButtonIcon = this.START_RECORD_ICON;
      this.isRecording = false;
      this.disablePlayButton = null;
      this.disableArrowButton = null;

      this.nativeSevice.showToast('Error on recording start.' );
      console.error("startRecord:Error",e)
    }
  }

  testAudio(){
    try {
      // if (this.isPlaying) {
      // this.testPlayer.stop();
      // this.testButtonIcon = this.START_RESUME_ICON;
      // this.isPlaying = null;
      // this.disableRecordButton = null;
      // } else {
      if(typeof this.vacabularys[this.currentIndex].userAudio != "undefined"){
        return;
      }

      this.playButtonText = "Playing...";
      this.playButtonIcon = this.PAUSE_ICON;
      this.disableRecordButton = true;
      console.log("lesson:testAudio", this.vacabularys[this.currentIndex].userAudio);

      this.testPlayer = this.media.create(this.vacabularys[this.currentIndex].userAudio, this.onStatusUpdate, this.onSuccess, this.onError);
      if (this.testPlayer) {
        console.log("lesson:testAudio", "playing");
        this.testPlayer.play();
        this.testButtonIcon = this.PAUSE_ICON;
        this.isPlaying = true;
      }
      // }
    }
    catch (e){
      this.disableRecordButton = null;
      // this.testButtonIcon = this.PLAY_ICON;
      console.error("testAudio:Error",e)
    }
  }

  onSuccessAndContinuePlaying = () => {
    // this.events.publish('play:finish');
    this.ngZone.run(() => {
      this.playIndex ++;
      if(this.playIndex >  this.audioPaths.length - 1){
        console.log("lesson","onSuccessAndContinuePlaying finish playing")
        this.showFinishPlayAll();
        // this.playIndex = 0;
      }else {
        try {
        this.slides.lockSwipes(false);
        this.slides.slideTo(this.playIndex);
        this.slides.lockSwipes(true);
        }catch (err){
          console.error("slides Swipes",err);
        }
        console.log("lesson","continue playing..." + this.tools.pathForAudio(this.audioPaths[this.playIndex]))
        this.testPlayer = this.media.create(this.tools.pathForAudio(this.audioPaths[this.playIndex]), this.onStatusUpdate, this.onSuccessAndContinuePlaying, this.onError);
        if (this.testPlayer) {
          this.testPlayer.play();
          this.isPlaying = true;
        }
      }
    });
  }

  playAll(){

      this.audioPaths = this.homeWork.vacabulary_pronunciation;
      console.log("lesson:playAll",this.audioPaths);

      if(!this.isPlaying){
        this.playIndex = 0;
        console.log("lesson","start playing..." + this.tools.pathForAudio(this.audioPaths[this.playIndex]))

        this.testPlayer = this.media.create(this.tools.pathForAudio(this.audioPaths[this.playIndex]), this.onStatusUpdate, this.onSuccessAndContinuePlaying, this.onError);
        if (this.testPlayer) {
          this.testPlayer.play();
          this.isPlaying = true;
        }
      }else {
        this.isPlaying = false;
        this.testPlayer.stop()
      }


  }


  // Create a new name for the image
  private createFileName()  {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  this.userData.userInfo.phone + "_" + n + ".mp3";
    return newFileName;//this.vacabularys[this.currentIndex].word;
  }

  private showFinishPlayAll() {
    console.log("showFinishPlayAll")
    let today = new Date();
    if( this.isStudent) {
      let alert = this.alertCtrl.create({
        title: '回放结束',
        subTitle: '回放结束',
        buttons: [
          {
            text: '返回',
            handler: () => {
              console.log('close clicked');
              this.navCtrl.pop();
            }
          }]
      });
      alert.present();
    }else {
      let alert = this.alertCtrl.create({
        title: '浏览结束',
        message: '再看一遍',
        buttons: [
          {
            text: '返回上一级',
            handler: () => {
              console.log('Cancel clicked');
              this.navCtrl.pop();
            }
          },
          {
            text: '再看一遍',
            handler: () => {
              console.log('再看一遍 clicked');
              this.playAll()
            }
          }
        ]
      });
      alert.present();
    }


  }
}
