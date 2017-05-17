import {Component,NgZone, ViewChild} from '@angular/core';
import {ActionSheet, ActionSheetController, Config, NavController, NavParams, AlertController, Slides,Events} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";
import { File  } from '@ionic-native/file';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import * as Enums from "../../providers/globals";
import {isSuccess} from "@angular/http/src/http_utils";
import {isUndefined} from "ionic-angular/umd/util/util";
import {timeInterval} from "rxjs/operator/timeInterval";
import {ViewAccountPage} from "../view-account/view-account";


@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',

})
export class LessonPage {
  MyUserType = Enums.UserType;
  actionSheet: ActionSheet;

  @ViewChild ("slides") slides:any;

  lesson_parts: string = "book";

  lesson_id:number = 1;
  playIndex:number = 0;
  audioPaths:any;

  isLoadingComment = false;
  isPosting = false;

  toggled:boolean = false;//post comment toggle

  @ViewChild ("btRecorder") btRecorder:any;
  // @ViewChild ("textAreaComment") textAreaComment:any;
  // @ViewChild ("textAreaComment1") textAreaComment1:any;

  textArea1:string = "";
  textArea2:string = "";

  // @ViewChild ("backArrow") backArrow:any;
  // @ViewChild ("forwardArrow") forwardArrow:any;

  arrComments = [];

   onStatusUpdate = (status) => console.log(status);
    onSuccess = () => {
      // this.events.publish('play:finish');
      this.ngZone.run(() => {
        this.playButtonText = "Test";
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

// @ViewChild ("lesson_parts") lessonSegement:any;

  comments:any;
  // comment1:any = {personName:"A",personComments:"hi i am A",pessonFrofile:"assets/img/logos/se.png",likes:2,subComments:[this.comment4]}
  // comment2:any = {personName:"B",personComments:"hi i am B",pessonFrofile:"assets/img/logos/se.png",likes:3,subComments:[this.comment4,this.comment5]}
  // comment3:any = {personName:"C",personComments:"hi i am C",pessonFrofile:"assets/img/logos/se.png",likes:1,subComments:[]}
  // comment4:any = {personName:"D",personComments:"hi i am D",pessonFrofile:"assets/img/logos/se.png",likes:2,subComments:[this.comment2]}
  // comment5:any = {personName:"E",personComments:"hi i am E",pessonFrofile:"assets/img/logos/se.png",likes:5,subComments:[]}
  // comments:any[] = [this.comment1,this.comment2,this.comment3];

  vacabularys:any[]=[{pronunciation:"a-in-z",word:"Anz",mean:"安银子",audio:""},{pronunciation:"bi-sho-jo",word:"Bishojo",mean:"美少女",audio:""},{pronunciation:"cat",word:"Cat",mean:"猫",audio:""}]
  userInfo: {user_id?:number,user_name?: string, checkinCount?: string,userAvatar?:string,phone?:string,identity?:number} = {};

  arrHomework:{};
  arrCurrentComments:any = [];
  // currentUser:any={pessonFrofile:"assets/img/logos/se.png"}
  private currentIndex: number = 0;
  recorder: MediaObject;

  START_RESUME_ICON: string = 'mic';
  PAUSE_ICON: string = 'pause';
  PLAY_ICON: string = 'play';


  ARROW_DOWN:string = "ios-arrow-down";
  ARROW_UP:string = "ios-arrow-up";

  isRecording:boolean = false;
  isPlaying:boolean = null;
  disablePlayButton:boolean = true;
  disableArrowButton:boolean = null;
  disableRecordButton:boolean = null;
  rootDir;
  audioDir:string = 'audios';

  recordButtonIcon:string = this.START_RESUME_ICON;
  testButtonIcon:string = this.PLAY_ICON;
  playButtonText:string = "Play"



  testPlayer: MediaObject ;
  private showHidenText: string = "Show Reply";
  private showHidenIcon: string = this.ARROW_DOWN;

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
    public userData: UserData,

    public alertCtrl:AlertController
  ) {
    this.lesson =   this.navParams.get('lesson');
    this.rootDir = userData.getRootDir();

    console.log("Passed params", navParams.data);
    console.log("rootDir", this.rootDir);



  }

  ionViewDidEnter(){
  console.log("lesson:ionViewDidEnter")
    if(this.arrCurrentComments.length <= 0){
      this.getComments();
    }
  }

  ionViewDidLoad() {
    console.log("lesson:ionViewDidLoad")
    this.init();
  }



  init(){
    this.userData.getDefaultUserData().then( (userInfo) =>{
      if(typeof userInfo != "undefined"){
        if(typeof userInfo.user_name != "undefined"){
          this.userInfo.user_name = userInfo.user_name;
          console.log(" init", "userInfo.user_name " + userInfo.user_name + " this.userInfo.user_name " + this.userInfo.user_name  )
        }
        if(typeof userInfo.checkinCount != "undefined"){
          this.userInfo.checkinCount = userInfo.checkinCount;
          console.log(" init", "userInfo.checkinCount " + userInfo.checkinCount + " this.userInfo.checkinCount " + this.userInfo.checkinCount  )

        }
        if(typeof userInfo.userAvatar != "undefined"){
          this.userInfo.userAvatar = userInfo.userAvatar;
        }
        if(typeof userInfo.phone != "undefined"){
          this.userInfo.phone = userInfo.phone;
        }
        if(typeof userInfo.user_id != "undefined"){
          this.userInfo.user_id = userInfo.user_id;
        }
        // if(typeof userInfo.identity != "undefined") {
        //   this.userInfo.identity = userInfo.identity;
        // }
        this.userInfo.identity = this.MyUserType.student
      }else {
        console.log(" init", "userInfo undefined")
      }
      console.log("lesson: init", userInfo);

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

      this.userData.retriveComments(this.userInfo.phone,this.lesson_id).then( (data) =>{
        this.arrCurrentComments = this.deepClone(data);

        console.log("init arrCurrentComments",this.arrCurrentComments);

        this.comments =  this.handleComments(data);
        this.isLoadingComment = false;
        this.isPosting = false;

        // this.ngZone.run( () => {
          this.lesson.comments = this.comments.length
        // });


        console.log("lesson:getComments this.comments", this.comments);
      })
    }
  }

  private handleComments(comments: any) {
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
        let userId = (this.userInfo.user_id).toString();

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
     let tempComments = this.deepClone(this.arrCurrentComments);



      this.comments = this.handleComments(tempComments);

  }



  thumbUp(){

    console.log("lesson:startRecording","thumbUp")
  }

  likeComment(comment){

    // this.ngZone.run(() => {
      console.log("likeComment", comment);

      if (comment.likeClicked) {
        console.log("likeComment click likeClicked");
        return;
      }

      this.userData.thumbUp(this.userInfo.user_id, comment.comment_id, "tb_comment");
      comment.likeClicked = true;
      comment.likeButtonColor = "danger";
      comment.likes_amount++;
      comment.likes.push(this.userInfo.user_id);
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
    this.userData.submitHomework(this.vacabularys,this.userInfo.phone,this.lesson_id).then( (success) => {
      // this.disablePlayButton = null;
      this.disableRecordButton = null;
      console.log("lesson:submitHomework",success);
    })
  }

  startPauseRecord() {
     let fileName = this.createFileName();
      // console.log('startPauseRecord:fileName');
       if(this.isRecording) {
         console.log("lesson:stopRecord");
         this.recorder.stopRecord();
         this.recordButtonIcon = this.START_RESUME_ICON;
         this.isRecording = false;
         this.disablePlayButton = null;
         this.disableArrowButton = null;
       }else {
         this.file.checkDir(this.rootDir, this.audioDir).then((exist) =>{
           if(exist){
             console.log('Directory exists');
             this.startRecord(this.rootDir,this.audioDir,fileName)
           }else {
             console.log("directory not exist")
             console.log("lesson:createDir",this.rootDir + this.audioDir)
             this.file.createDir(this.rootDir, this.audioDir, true).then(() => {
               this.startRecord(this.rootDir,this.audioDir,fileName)
             }).catch((err) => { console.log("error during creating directory", err)  });
           }
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
      this.recordButtonIcon = this.PAUSE_ICON;

      this.recorder = this.media.create(this.vacabularys[this.currentIndex].audio);
      this.recorder.startRecord();

    }
    catch (e) {
      this.recordButtonIcon = this.START_RESUME_ICON;
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

    let tmp = {under_which_user:comment.user_id,reply_which_comment:parentComment.comment_id,user_id:this.userInfo.user_id,comment:commentContent,lesson_id:this.lesson_id,comment_date:new Date()};
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


  postComment(){
    if(this.textArea1.length <1){
      this.showAlert("请输入评论");
      return;
    }

    this.isPosting = true;

    let tmp = {under_which_user:-1,reply_which_comment:-1,user_id:this.userInfo.user_id,comment:this.textArea1,lesson_id:this.lesson_id,comment_date:new Date()};
    console.log("postComment", tmp )

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
      })
    //   .then( _succes => {
    //   this.getComments();
    // })
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    console.log("vacabularyUpdated", this.currentIndex);
  }
  // Create a new name for the image
  private createFileName()  {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  this.userInfo.phone + "_" + n + ".mp3";
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
      this.comments = this.updateCommentSession(data);

    });
  }

  deepClone(oldArray: Object[]) {
    let newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  gotoViewUser(comment){

    let userInfo = {
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

    let  dateLabel = date.getFullYear() + " 年前";
    if(today.getFullYear() >= date.getFullYear()){
      dateLabel = ( date.getMonth() - today.getMonth()) + " 个月前";
      if(today.getMonth() >= date.getMonth()){
        dateLabel = (date.getDay() - today.getDay() )  + " 天前";
        if(today.getDay() >= date.getDay()){
          dateLabel = (date.getHours() - today.getHours() )  + " 小时前";
          if(today.getHours() >= date.getHours()){
            dateLabel = (date.getMinutes() - today.getMinutes() )  + " 分钟前";
            if(today.getMinutes() >= date.getMinutes()){
              dateLabel = (date.getSeconds() - today.getSeconds() )  + " 秒前";
              if(today.getSeconds() >= date.getSeconds()){
                dateLabel = "刚刚";
              }
            }
          }
        }
      }
    }
// Will display time in 10:30:23 format
    return dateLabel;
  }

}
