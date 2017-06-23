import {Component,NgZone, ViewChild} from '@angular/core';
import {ActionSheet, ActionSheetController, Config, NavController, NavParams, AlertController, Slides,Events} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";
import { File  } from '@ionic-native/file';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import * as Enums from "../../providers/globals";
import {ViewAccountPage} from "../view-account/view-account";
import {Tools} from "../../providers/tools";
import {WebsocketEntity} from "../../providers/websocketEntity";
import {NativeService} from "../../providers/mapUtil";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import * as $ from 'jquery'
import {DBHelper} from "../../providers/dbhelper";
import {timeout} from "rxjs/operator/timeout";
import {VideoDubbingPage} from "../video-dubbing/video-dubbing";

@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',

})
export class LessonPage {
  MyUserType = Enums.UserType;
  actionSheet: ActionSheet;

  swiper:any;
  @ViewChild ("slides") slides:any;

  lesson_parts: string = "book";

  lesson_id:number = 1;
  playIndex:number = 0;
  audioPaths:any;

  isLoadingComment = false;
  isPosting = false;
  noComments = false;

  toggled:boolean = false;//post comment toggle

  // @ViewChild ("btRecorder") btRecorder:any;
  btRecorder:any;
  textArea1:string = "";
  textArea2:string = "";


  arrComments = [];

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

  onSamplePlaySuccess = () => {
    this.ngZone.run(() => {
      this.disableRecordButton = null;
      console.log('play finish.' + this.testButtonIcon + this.isPlaying + this.disableRecordButton);
    });
  }

  onError = ((error) =>{
  this.disableRecordButton = null;
  this.testButtonIcon = this.PLAY_ICON;
  console.error(error.message);
});
  lesson:any;
  comments:any;

  // vacabularys:any[]=[
  //   {pronunciation:"a-in-z",word:"Anz",mean:"安银子",audio:"",sampleAudio:"http://api.wordnik.com/v4/audioFile.mp3/3e7145666db9d2ddd47fb6402d26bb263abaf8b4c98ed5337bf0b16ed4d35cb1"},
  //   {pronunciation:"bi-sho-jo",word:"Bishojo",mean:"美少女",audio:"",sampleAudio:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee"},
  //   {pronunciation:"cat",word:"Cat",mean:"猫",audio:"",sampleAudio:""}]
  // userInfo: {user_id?:number,user_name?: string, checkinCount?: string,userAvatar?:string,phone?:string,identity?:number} = {};
  vacabularys :any;
  arrHomework:{};
  arrCurrentComments:any = [];//original comments array
  // currentUser:any={pessonFrofile:"assets/img/logos/se.png"}
  private currentIndex: number = 0;
  recorder: MediaObject;

  START_RECORD_ICON: string = "assets/icon/record.png";
  PAUSE_ICON: string = "assets/icon/pause.png";
  PLAY_ICON: string = "assets/icon/play.png";


  RESUME_RECORD_ICON: string = "assets/icon/rec.png";

  TEXTHOLD = "按住下面按钮录音"
  TEXTCANCEL = "释放手指取消录音"
  TEXTSLIDE = "向上/下滑动取消录音"
  proptText = this.TEXTHOLD;

  ARROW_DOWN:string = "ios-arrow-down";
  ARROW_UP:string = "ios-arrow-up";

  isRecording:boolean = false;
  isPlaying:boolean = null;
  disablePlayButton:boolean = true;
  disableArrowButton:boolean = null;
  disableRecordButton:boolean = null;
  rootDir;
  audioDir:string = Enums.AUDIO_DIR_NAME;

  recordButtonIcon:string = this.START_RECORD_ICON;
  testButtonIcon:string = this.PLAY_ICON;
  playButtonText:string = "Play";
  playButtonIcon:string = this.PLAY_ICON

  SELECT_RIGHT_AUDIO = "assets/audio/right.mp3";
  SELECT_WRONG_AUDIO = "assets/audio/wrong.mp3";

  testPlayer: MediaObject ;
  samplePlayer: MediaObject ;
  private showHidenText: string = "Show Reply";
  private showHidenIcon: string = this.ARROW_DOWN;
  isHasInit = false;
  private course_id: any;

  // randomVocabulary:any;

  readedWordList = [];

  loadingCoolPlay = true;

  isPickWrong = null;
  private showTestingPage: boolean;
  private showResultPage: boolean;
  private totalWrongTimes: number | any;
  wrongWordList = [];
  lastRandom = 0;

  constructor(
    public events:Events,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    private ngZone: NgZone,
    public media: MediaPlugin,
    public file: File,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData:UserData,
  public webSocket:WebsocketEntity,
  public nativeSevice:NativeService,
  public tools: Tools,
    public dbHelper:DBHelper,
    private screenOrientation: ScreenOrientation,

    public alertCtrl:AlertController
  ) {
    this.lesson =   this.navParams.get('lesson');
    this.course_id =   this.navParams.get('course_id');
    this.rootDir = this.tools.getRootDir();

    console.log("Passed params", navParams.data,this.course_id);
    console.log("rootDir", this.rootDir);
  }

  ionViewDidEnter(){
  console.log("lesson:ionViewDidEnter")
    if(this.arrCurrentComments.length <= 0){
      this.getComments();
    }
    this.addVideoControl();


  }

  ionViewDidLoad() {
    console.log("lesson:ionViewDidLoad")
    this.init();
  }

  init(){
    this.userData.getDefaultUserData().then( (userInfo) =>{
      console.log("lesson: init", this.userData.userInfo);
      this.userData.getHomeworkData().then( (homeworkData) => {
        this.arrHomework = homeworkData;
        console.log("init:homeworkData", this.arrHomework);
      });

    });

    this.isLoadingComment = true;

    this.lisenEvents();
  }

  getComments(){
    if(typeof this.lesson_id == "undefined"){
      console.log("getcommets","lesson unknow")
    }else {
      this.userData.retriveComments(this.userData.userInfo.phone,this.lesson_id).then( (data) =>{
        this.arrCurrentComments = this.tools.deepClone(data);

        console.log("init arrCurrentComments",this.arrCurrentComments);

        this.comments =  this.handleComments(data);
        this.isLoadingComment = false;
        this.isPosting = false;

        // this.ngZone.run( () => {
          this.lesson.comments = this.comments.length
        // });


        console.log("lesson:getComments this.comments", this.comments);
      }).catch( err => {
        this.comments =  this.handleComments([]);
        this.isLoadingComment = false;
        this.isPosting = false;
      })
    }
  }

  private handleComments(comments: any) {

    this.noComments = false;

    if(comments.length <= 0){
      console.log("handleComments no comments")
      this.noComments = true;
    }
    console.log("handleComments",comments)
    let arrHeadComments = [];
    let arrSubComments = [];
    let i;
    //seperate two types of comments
    let self = this;
    for (i = 0; i < comments.length ; i++) {
      let tempComment = comments[i];

      tempComment.isReplying = false;
      // console.log("lesson:handleComments tempComment.likes",tempComment.likes)

      tempComment.comment_date = this.timestampToDate(comments[i].comment_date)

      tempComment.showHidenText = tempComment.showReply ? "Hide Reply" : "Show Reply"
      tempComment.showHidenIcon = tempComment.showReply ? self.ARROW_UP : self.ARROW_DOWN

      tempComment.likeButtonColor = "badge";
      tempComment.likeClicked = false;

      // tempComment.emojitext: string;

      let arrLikes = tempComment.likes;

      if(arrLikes != null){
        // console.log("handleComments",tempComment.likes,this.userInfo.user_id,arrLikes.contains(this.userInfo.user_id))
        let userId = (this.userData.userInfo.user_id).toString();

        if(arrLikes.indexOf(parseInt(userId)) > -1 )  {
          tempComment.likeButtonColor = "danger";
          tempComment.likeClicked = true;
          // console.log("handleComments likeClicked comment",tempComment)
        }
      }else {
        // console.log("handleComments like Inclicked comment",tempComment)
      }

      if (tempComment.reply_which_comment < 0) {
        arrHeadComments.push(tempComment);
      } else {
        arrSubComments.push(tempComment);
      }
    }
    // console.log("handleComments arrHeadComments",arrHeadComments)
    // console.log("handleComments arrSubComments",arrSubComments)
    for (i = 0; i < arrHeadComments.length ; i++) {
      // console.log("lesson:handleComments:comment_id", arrHeadComments[i].comment_id)
      //combine sub one into head one
      let subCommentsArray = [];
      for(let j = 0;j < arrSubComments.length;j++){
        // console.log("lesson:handleComments.reply_which_comment", arrSubComments[j].reply_which_comment)
        if(arrSubComments[j].reply_which_comment + "" == "" + arrHeadComments[i].comment_id){
          subCommentsArray.push(arrSubComments[j]);
        }
      }
      arrHeadComments[i].subComments = subCommentsArray;
    }

    return arrHeadComments;
  }

  updateCommentSession(tempComment){

      this.arrCurrentComments.unshift(tempComment);
      let tempComments = this.tools.deepClone(this.arrCurrentComments);

      this.comments = this.handleComments(tempComments);

  }

  thumbUp(){
    console.log("lesson:startRecording","thumbUp")

  }

  updateComments(commentUpdate){
      this.arrCurrentComments.forEach(function (comment) {
        if(comment.comment_id == commentUpdate.comment_id){
          comment.likes = commentUpdate.likes;
          comment.likes_amount = commentUpdate.likes_amount;
          return;
        }
    });
  }

  likeComment(comment){
    // this.ngZone.run(() => {
      console.log("likeComment", comment);

      if (comment.likeClicked) {
        console.log("likeComment click likeClicked");
        this.tools.presentErrorAlert("失败","已经赞过!");
        return;
      }

      this.userData.thumbUp(this.userData.userInfo.user_id, comment.comment_id, "tb_comment").then( (comment) => {
        let eventObj = {eventType:"likeComment",eventData:comment,client_id:this.userData.userInfo.user_id};
        this.webSocket.sendData(eventObj);

      }).catch( err => {
        console.error("likeComment",err)
      })
      comment.likeClicked = true;
      comment.likeButtonColor = "danger";
      comment.likes_amount++;
      comment.likes.push(this.userData.userInfo.user_id);
    // });
  }

  showReply(comment){
    let commentId = comment.comment_id;
    comment.showReply = !comment.showReply
    comment.showHidenText = comment.showReply ? "Hide Reply" : "Show Reply"
    comment.showHidenIcon = comment.showReply ? this.ARROW_UP : this.ARROW_DOWN

    let self = this;

    this.arrCurrentComments.forEach(function (comment) {
      if(comment.comment_id == commentId){
        comment.showReply = !comment.showReply
        comment.showHidenText = comment.showReply ? "Hide Reply" : "Show Reply"
        comment.showHidenIcon = comment.showReply ? self.ARROW_UP : self.ARROW_DOWN
      }
    })
  }

  pickEmoji(isReply,event){
    // comment.toggled =  !comment.toggled;
    if(!isReply) {
      this.textArea1 = this.textArea1 + " " + event.char;
    }else {
      this.textArea2 = this.textArea2 + " " + event.char;
    }
    console.log("pickEmoji",event.char);
  }

  submitHomework(){
    // this.disablePlayButton = true;
    // this.disableArrowButton = true;
    this.disableRecordButton = true;
    this.userData.submitHomework(this.vacabularys,this.userData.userInfo.phone,this.lesson_id).then( (success) => {
      // this.disablePlayButton = null;
      this.disableRecordButton = null;
      console.log("lesson:submitHomework",success);
    })
  }

  segmentChanged(event){
    if(this.lesson_parts == "vocabulary"){
      let self = this;
      console.log("segmentChanged",this.course_id)
      switch(this.course_id){
        case 1:
          this.initVocabularyFiles();
          setTimeout(function() {
            console.log("segmentChanged",self.btRecorder)
            if(self.btRecorder == null || typeof self.btRecorder == "undefined"){
              self.addAudioInput();
              self.playSampleAudio()
              // self.isHasInit = true
            }
          }, 1000);
          break;
        case 2:
          this.initCoolPlayVocabulary();
          setTimeout(function() {
            if(this.slides != null && typeof  this.slides != "undefined"){
              // this.slides.lockSwipes(true);
              this.slides.lockSwipes(true);
              console.log("lockSwipes")
            }

          }, 1000);

          break;
        case 3:

          break;
        case 4:
          break;
        default:
          break
      }

    }
  }

  startDubbing(){
    this.navCtrl.push(VideoDubbingPage);
  }

  initVocabularyFiles(){
    // for(let i=0;i<this.vacabularys.length;i++){
    // }
    this.vacabularys = this.userData.findVocabulary(this.lesson_id);
    console.log("initVocabularyFiles",this.vacabularys);
  }

  initCoolPlayVocabulary(){
    // for(let i=0;i<this.vacabularys.length;i++){
    // }
    // $('#showExplain').hide();
    this.lastRandom = 0;

    this.dbHelper.getTestResult(this.lesson_id).then( (result) => {
      if(result != null && typeof result != "undefined"){
        //show result page
        this.totalWrongTimes = result.wrong_times;
        this.showLastPage();
      }
    }).catch( err => {

    })

    this.nativeSevice.showLoading();
    this.showTestingPage = true;
    this.showResultPage = null;

    this.userData.findCoolPlayVocabulary(this.lesson_id).then( (datas) => {
      this.vacabularys = datas;
      this.nativeSevice.hideLoading();
    })

    console.log("initCoolPlayVocabulary",this.vacabularys);
    this.readedWordList = [];
    // this.randomVocabulary = this.getTestTimes()
    this.isPickWrong = null;
  }

  getTestTimes(){
    let arr;
    for(let i =0;i<this.vacabularys.length;i++){
      arr.push(this.vacabularys.need_recite_count)
    }
    return arr;
    // return this.vacabularys.length;
  }

  onIonDrag(event){
    this.swiper = event;
    this.swiper.lockSwipes();
    console.log("onIonDrag")
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
    var video =  $('video');
    console.log("addVideoControl",video)
    video.bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
      var state =  document.webkitIsFullScreen;
      var event = state ? 'FullscreenOn' : 'FullscreenOff';
      // Now do something interesting
      console.log('Event: ' + event);
      self.onFullScreen(state);
    });
  }

  addAudioInput(){
    this.btRecorder  = document.getElementById("bt-recorder");
    console.log("lesson page","addAudioInput",this,this.btRecorder,document.getElementById("bt-recorder"));
    if(this.btRecorder != null && typeof this.btRecorder != "undefined"){
      var self = this;

      var touchStart = function(event) {
        self.ngZone.run( () => {
          self.startPauseRecord(true);
          self.proptText = self.TEXTSLIDE;
          console.log("touchStart",self.proptText)
        })
      }

       var touchEnd = function(event) {
         self.startPauseRecord(false);
        self.proptText = self.TEXTHOLD;
         console.log("touchEnd",self.proptText)
      }

      var touchMove = function(event) {
        self.ngZone.run( () => {
          // console.log("touchMove x:", event.changedTouches[0].pageX + ', y: ' + event.changedTouches[0].pageY);
          if(event.changedTouches[0].pageY < 570 && event.changedTouches[0].pageY > 470){
            self.proptText = self.TEXTSLIDE;

          }else {
            self.proptText = self.TEXTCANCEL;
          }
        })

      }

      var touchCancel = function(event) {
        console.log("touchCancel");
      }

      this.btRecorder.addEventListener("touchstart", touchStart, false);
      this.btRecorder.addEventListener("touchend", touchEnd, false);
      this.btRecorder.addEventListener("touchmove", touchMove, false);
      this.btRecorder.addEventListener("touchcancel", touchCancel, false);
    }
  }

  startPauseRecord(record) {
     let fileName = this.createFileName();
      // console.log('startPauseRecord:fileName');
       if(!record) {
         if(this.recorder == null || typeof this.recorder == "undefined"){
           return;
         }
         this.recorder.stopRecord();
         console.log("lesson:stopRecord");
         this.recordButtonIcon = this.START_RECORD_ICON;
         this.isRecording = false;
         this.disablePlayButton = null;
         this.disableArrowButton = null;
         console.log("lesson:stopRecord", this.recordButtonIcon);
       }else {
         console.log("lesson:startRecord");
         // console.log("lesson:stopRecord", this.recordButtonIcon);
         this.file.checkDir(this.rootDir, this.audioDir).then((exist) =>{
           console.log('Directory exists');
           this.startRecord(this.rootDir,this.audioDir,fileName)
         }).catch( err => {
           console.log("directory not exist",err)
           console.log("lesson:createDir",this.rootDir + this.audioDir)
           this.file.createDir(this.rootDir, this.audioDir, true).then(() => {
             this.startRecord(this.rootDir,this.audioDir,fileName)
           }).catch((err) => {
             console.error("error during creating directory", err)
             this.nativeSevice.showToast(err,2000);
           });
         })
       }
  }

  startRecord(rootDir,audioDir,fileName){
    // console.log("lesson:startPauseRecord",rootDir  + audioDir  + "/" + fileName);
    try {
      this.vacabularys[this.currentIndex].audio = rootDir + audioDir + "/" + fileName;
      console.log("lesson:startRecord",this.vacabularys[this.currentIndex].audio);
      this.isRecording = true;
      this.disablePlayButton = true;
      this.disableArrowButton = true;
      this.recordButtonIcon = this.RESUME_RECORD_ICON;
      this.recorder = this.media.create(this.vacabularys[this.currentIndex].audio);
      this.recorder.startRecord();
    }
    catch (e) {
      this.recordButtonIcon = this.START_RECORD_ICON;
      this.isRecording = false;
      this.disablePlayButton = null;
      this.disableArrowButton = null;

      this.showAlert('Error on recording start.' );
      console.log("startRecord:Error",e)
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
      this.playButtonText = "Playing...";
      this.playButtonIcon = this.PAUSE_ICON;
        this.disableRecordButton = true;
        console.log("lesson:testAudio", this.vacabularys[this.currentIndex].audio);


        this.testPlayer = this.media.create(this.vacabularys[this.currentIndex].audio, this.onStatusUpdate, this.onSuccess, this.onError);
        if (this.testPlayer) {
          console.log("lesson:testAudio", "playing");
          this.testButtonIcon = this.PAUSE_ICON;
          this.testPlayer.play();
          this.isPlaying = true;
        }
      // }
    }
    catch (e){
      this.disableRecordButton = null;
      this.testButtonIcon = this.PLAY_ICON;
      console.log("testAudio:Error",e)
    }
  }

  onSuccessAndContinuePlaying = () => {
    // this.events.publish('play:finish');
    this.ngZone.run(() => {
      this.playIndex ++;
      if(this.playIndex >  this.audioPaths.length - 1){
        console.log("lesson","onSuccessAndContinuePlaying finish playing")
        this.playIndex = 0;
      }else {
        console.log("lesson","continue playing..." + this.audioPaths[this.playIndex])
        this.testPlayer = this.media.create(this.audioPaths[this.playIndex], this.onStatusUpdate, this.onSuccessAndContinuePlaying, this.onError);
        if (this.testPlayer) {
          this.testPlayer.play();
          this.isPlaying = true;
        }
      }
    });
  }

  playAll(audios){
    this.audioPaths = audios;
    console.log("lesson:playAll",this.audioPaths);
    if(!this.isPlaying){
      console.log("lesson","start playing..." + this.audioPaths[this.playIndex])
      this.testPlayer = this.media.create(this.audioPaths[this.playIndex], this.onStatusUpdate, this.onSuccessAndContinuePlaying, this.onError);
      if (this.testPlayer) {
        this.testPlayer.play();
        this.isPlaying = true;
      }
    }else {
      this.isPlaying = false;
      this.testPlayer.stop()
    }
  }

  replyComment(comment){
    comment.isReplying = !comment.isReplying;
  }

  cancel(comment){
    comment.isReplying = false;
  }

  postCommentUnderComment(comment,parentComment){
    if(this.textArea2.length <1){
      this.showAlert("请输入评论");
      return;
    }

    comment.isReplying = true;

    let commentContent = "@ " + comment.user_name + " " + this.textArea2;

    let tmp = {under_which_user:comment.user_id,reply_which_comment:parentComment.comment_id,user_id:this.userData.userInfo.user_id,comment:commentContent,lesson_id:this.lesson_id,comment_date:new Date()};
    console.log("postCommentUnderComment", tmp )

    this.userData.postComment(tmp)
      .then( (comment) => {
        console.log("postCommentUnderComment:result",comment);
        if(comment != null){
          this.textArea2 = "";

          this.updateCommentSession(comment);
          comment.isReplying = false;
        }
      }).catch( (err) => {
      comment.isReplying = false;
    })
  }

  clicking = false;
  pickAnswer(_random){
    if(!this.clicking){
      // console.log("pickAnswer")
      this.clicking = true
      let gotoNext = false;
      _random.correctAnswer = null;
      _random.wrongAnswer = null;
      _random.recite_count ++;
      if(_random.vocabulary_id == this.vacabularys[this.currentIndex].vocabulary_id){
        _random.correctAnswer = true;
        gotoNext = true;
        this.vacabularys[this.currentIndex].need_recite_count --;
        // this.randomVocabulary[this.currentIndex] --;
        // if(this.randomVocabulary[this.currentIndex] < 1){
        //
        //   this.randomVocabulary.slice(this.currentIndex,1);
        //   console.log("remove",this.currentIndex,"from array")
        // }
      }else {
        this.vacabularys[this.currentIndex].need_recite_count ++;
        // this.randomVocabulary ++;
        this.vacabularys[this.currentIndex].recite_wrong_times ++;
        this.readedWordList.concat(_random);
        this.isPickWrong = true;
        // $('#showExplain').show();
        _random.wrongAnswer = true;
        console.log("pickAnswer wrong")
      }
      this.playPickSound(gotoNext);

      setTimeout(() => {
        _random.correctAnswer = null;
        _random.wrongAnswer = null;
        this.clicking = false;
        if(gotoNext){
          //correct
          console.log("pickAnswer right")
          if(this.slides != null && typeof this.slides != "undefined"){
            this.isPickWrong = null;
            // $('#showExplain').hide();

            let nextIndex = this.getNextTestVocabulary();
            if(!nextIndex){
              return
            }
            console.log("slideTo",this.vacabularys[nextIndex],nextIndex)
            this.slides.lockSwipes(false)
            this.slides.slideTo(nextIndex);
            this.slides.lockSwipes(true)

          }
        }
      }, 1000);

    }

  }

  checkArray(){
    let indexArr = [];
    for(let i=0;i< this.vacabularys.length;i++){
      if(this.vacabularys[i].need_recite_count > 0){
        // console.log("checkArray",this.vacabularys[i])
        indexArr.push(i);
      }
    }
    // if(indexArr.indexOf(this.currentIndex) > -1 && indexArr.length > 1){
    //   indexArr.slice(this.currentIndex,1);
    // }
   return indexArr;
  }

  showLastPage(){
    this.showTestingPage = null;
    this.showResultPage = true;
  }

  getNextTestVocabulary(){
    let temArr = this.checkArray();
    console.log("getNextTestVocabulary",temArr);
    if(temArr.length < 1){
      console.log("getNextTestVocabulary show results")
      this.totalWrongTimes = 0;
      for(let i = 0;i<this.vacabularys.length;i++){
        this.totalWrongTimes += this.vacabularys[i].recite_wrong_times;
        //save into database
        // if(this.vacabularys[i].recite_wrong_times > 0){
        //   this.wrongWordList
        // }
      }
      this.showLastPage();

      let time = new Date();
      let result = {lesson_id:this.lesson_id,created_date:time,wrong_times:this.totalWrongTimes}
      this.dbHelper.addTestResult(result);

      return false;
    }
    // console.log("getNextTestVocabulary",temArr);
    let length = temArr.length;
    if(length <= 1){
      return temArr[0];
    }

    let random =  Math.floor(Math.random() * length);
    console.log("getNextTestVocabulary",temArr,random,this.lastRandom);
    if(random == this.lastRandom){
      console.log("repeat and re-check")
     return this.getNextTestVocabulary()
    }
    this.lastRandom = temArr[random];
    return temArr[random];
      // if(this.vacabularys[temArr[random]].need_recite_count < 1){
      //   return this.getNextTestVocabulary();
      // }else {
      //   return random;
      // }
  }

  playPickSound(selectRight){
    // console.log("playPickSound", $('#audio')[0]);
    if(selectRight){
      $('#audio')[0].setAttribute('src',this.SELECT_RIGHT_AUDIO);
    }else {
      $('#audio')[0].setAttribute('src',this.SELECT_WRONG_AUDIO);
    }
    $('#audio')[0].play();
  }

  postComment(){
    if(this.textArea1.length <1){
      this.showAlert("请输入评论");
      return;
    }

    this.isPosting = true;

    let tmp = {under_which_user:-1,reply_which_comment:-1,user_id:this.userData.userInfo.user_id,comment:this.textArea1,lesson_id:this.lesson_id,comment_date:new Date()};
    console.log("postComment", tmp,this.userData.userInfo )

    this.userData.postComment(tmp)
      .then( (comment) => {
        console.log("postComment:result",comment);
        if(comment != null){
          this.textArea1 = "";

          this.updateCommentSession(comment);
          this.isPosting = false;
        }

        // this.ngZone.run( () => {
        //   this.comments = this.updateCommentSession(comment);
        // })
        // this.comments =  this.handleComments(arrComments);
      }).catch( err => {
      this.isPosting = false;
    })
    //   .then( _succes => {
    //   this.getComments();
    // })
  }

  slideOnHead(){
    console.log("slideOnHead");
    this.slides.lockSwipes(true);
  }

  slidesFinish(){
    console.log("slidesFinish");
    // this.slides.lockSwipes(true);
  }

  slideChanged() {
    if(typeof this.slides != "undefined"){

      this.currentIndex = this.slides.getActiveIndex();
      console.log("vacabularyUpdated", this.currentIndex);
      this.playSampleAudio();
      this.isPickWrong = null;
    }

  }

  playSampleAudio(){
    try {
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
      console.log("playSampleAudio:Error",e)
    }

  }
  // Create a new name for the image
  private createFileName()  {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  this.userData.userInfo.phone + "_" + n + ".mp3";
    return newFileName;//this.vacabularys[this.currentIndex].word;
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  private lisenEvents() {
    this.events.subscribe("updateComment", (data) => {
      console.log("lisenEvents:updateComment",data)
      if(data != null){
        this.updateCommentSession(data);
      }
    });

    this.events.subscribe("likeComment", (comment) => {
      console.log("lisenEvents:likeComment",comment)
      if(comment != null){
        this.updateComments(comment);
        let tempComments = this.tools.deepClone(this.arrCurrentComments);
        this.comments = this.handleComments(tempComments);
      }
    });

  }

  gotoViewUser(comment){
    let userInfo = {
      user_id:comment.user_id,
      user_name:comment.user_name,
      phone:comment.phone,
      avatar:comment.avatar
    };

    this.navCtrl.push(ViewAccountPage,{userinfo: userInfo});
  }

  public timestampToDate(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    // console.log("timestampToDate",unix_timestamp.getTime());
    let date = new Date(unix_timestamp);
    let today = new Date();
    let  dateLabel = this.tools.dateDiff(date,today);
    // let  dateLabel = date;
    // if(date.getFullYear() >= today.getFullYear()){
    //   dateLabel = ( date.getMonth() - today.getMonth()) + " 个月前";
    //   if(today.getMonth() >= date.getMonth()){
    //     dateLabel = (date.getDay() - today.getDay() )  + " 天前";
    //     if(today.getDay() >= date.getDay()){
    //       dateLabel = (date.getHours() - today.getHours() )  + " 小时前";
    //       if(today.getHours() >= date.getHours()){
    //         dateLabel = (date.getMinutes() - today.getMinutes() )  + " 分钟前";
    //         if(today.getMinutes() >= date.getMinutes()){
    //           dateLabel = (date.getSeconds() - today.getSeconds() )  + " 秒前";
    //           if(today.getSeconds() >= date.getSeconds()){
    //             dateLabel = "刚刚";
    //           }
    //         }
    //       }
    //     }
    //   }
    // }else {
    //   dateLabel  = date.getFullYear() + " 年前"
    // }
// Will display time in 10:30:23 format
    return dateLabel;
  }

}
