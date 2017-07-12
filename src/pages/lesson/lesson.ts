import {Component,NgZone, ViewChild} from '@angular/core';
import {ActionSheet, ActionSheetController, Config, NavController, NavParams, AlertController, Slides,Events} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConferenceData } from '../../providers/conference-data';
import {UserData} from "../../providers/user-data";

import { MediaPlugin, MediaObject } from '@ionic-native/media';
import * as Enums from "../../providers/globals";
import {ViewAccountPage} from "../view-account/view-account";
import {Tools} from "../../providers/tools";
import {WebsocketEntity} from "../../providers/websocketEntity";
import {NativeService} from "../../providers/mapUtil";
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import {DBHelper} from "../../providers/dbhelper";
import {timeout} from "rxjs/operator/timeout";
import {VideoDubbingPage} from "../video-dubbing/video-dubbing";
import * as $ from 'jquery'
import {VocabularyRecordingPage} from "../vocabulary-recording/vocabulary-recording";
import {VocabularySelectingPage} from "../vocabulary-selecting/vocabulary-selecting";

@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',

})
export class LessonPage {
  MyUserType = Enums.UserType;

  TEXTBOOK = 0;
  WORDBOOK = 1;

  actionSheet: ActionSheet;
  swiper:any;
  lesson_parts: string = "book";
  lesson_id:number = 1;
  isLoadingComment = false;
  isPosting = false;
  noComments = false;
  toggled:boolean = false;//post comment toggle
  // @ViewChild ("btRecorder") btRecorder:any;
  textArea1:string = "";
  textArea2:string = "";
  arrComments = [[],[]];
  lesson:any;
  rtLessonInfo :any = [{likes:[],views:0,likeButtonColor:"badge",likeClicked:false},{likes:[],views:0,likeButtonColor:"badge",likeClicked:false}];
  comments:any = [[],[]];

  // vacabularys:any[]=[
  //   {pronunciation:"a-in-z",word:"Anz",mean:"安银子",audio:"",sampleAudio:"http://api.wordnik.com/v4/audioFile.mp3/3e7145666db9d2ddd47fb6402d26bb263abaf8b4c98ed5337bf0b16ed4d35cb1"},
  //   {pronunciation:"bi-sho-jo",word:"Bishojo",mean:"美少女",audio:"",sampleAudio:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee"},
  //   {pronunciation:"cat",word:"Cat",mean:"猫",audio:"",sampleAudio:""}]
  // userInfo: {user_id?:number,user_name?: string, checkinCount?: string,userAvatar?:string,phone?:string,identity?:number} = {};

  arrHomework:{};
  // arrCurrentTextbookComments:any = [];//original comments array
  // arrCurrentWordbookComments:any = [];//original comments array
  arrCurrentComments:any = [[],[]];//original comments array
  // currentUser:any={pessonFrofile:"assets/img/logos/se.png"}

  ARROW_DOWN:string = "ios-arrow-down";
  ARROW_UP:string = "ios-arrow-up";

  private showHidenText: string = "Show Reply";
  private showHidenIcon: string = this.ARROW_DOWN;
  isHasInit = false;
  private course_id: any;
  private currentCourse: any;
  private part_id = this.TEXTBOOK;
  private submittedHomework: any = {};
  private testResults: any = [];
  dubVideos: any =[];
  viewState = 0;
  // randomVocabulary:any;

  constructor(
    public events:Events,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public  navParams: NavParams,
    public ngZong:NgZone,
    public tools: Tools,

    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public userData:UserData,
  public webSocket:WebsocketEntity,
  public nativeSevice:NativeService,


    private screenOrientation: ScreenOrientation,

    public alertCtrl:AlertController
  ) {

    this.lesson =  this.navParams.get('lesson');
    this.lesson_id = this.lesson.lesson_id;
    this.currentCourse =   this.navParams.get('course');

    switch(this.currentCourse.book_name) {
      case "动感音标":
        this.course_id = 1;
        console.log("segmentChanged 1")
        break;
      case "酷玩单词":
        this.course_id = 2;
        console.log("segmentChanged 2")
        break;
      case "魅力语音":
        this.course_id = 3;
        break;
      case "嘻哈语法":
        this.course_id = 4;
        break;
      default:
        break;
    }
    console.log("Passed params", navParams.data,this.course_id);
  }

  ionViewDidEnter(){
    console.log("lesson:ionViewDidEnter")
    this.viewState = 0;
    this.updateLessonInfo();
    this.initCurrentPage();

    this.addVideoControl();
  }

  private initCurrentPage() {
    // for(let i = 0;i< 2;i++){

    // }
    if(this.lesson_parts == "book"){
      console.log("initCurrentPage",this.lesson_parts);
        if(this.arrCurrentComments[this.TEXTBOOK].length <= 0){
          this.getComments(this.TEXTBOOK);
        }
    }else if(this.lesson_parts == "exercise"){
      console.log("initCurrentPage",this.lesson_parts);
      if(this.arrCurrentComments[this.WORDBOOK].length <= 0){
        this.getComments(this.WORDBOOK);
      }
    }

  }

  ionViewDidLoad() {
    console.log("lesson:ionViewDidLoad")
    this.init();
  }

  init(){
    this.userData.getDefaultUserData().then( (userInfo) =>{
      console.log("lesson: init", this.userData.userInfo);
      this.userData.getHomeworkData().then( (homeworkData) => {
        if(homeworkData != null){
          this.arrHomework = homeworkData;
          console.log("init:homeworkData", this.arrHomework);
        }

      });

    });
    this.isLoadingComment = true;
    this.lisenEvents();
  }

  getComments(part_id){
    if(typeof this.lesson_id == "undefined"){
      console.log("getcommets","lesson unknow")
    }else {
      this.userData.retriveComments(this.userData.userInfo.phone,this.lesson_id,part_id).then( (data) =>{
        this.arrCurrentComments[part_id] = this.tools.deepClone(data);

        console.log("init arrCurrentComments",part_id,this.arrCurrentComments[part_id] );

        this.comments[part_id] =  this.handleComments(data);
        this.isLoadingComment = false;
        this.isPosting = false;

        // this.ngZone.run( () => {
        // this.rtLessonInfo[part_id].comments_acount = this.comments[part_id].length;
        // });
        console.log("lesson:getComments ",part_id, this.comments[part_id]);
      }).catch( err => {
        this.comments[part_id] =  this.handleComments([]);
        this.isLoadingComment = false;
        this.isPosting = false;
      })
    }
  }

  updateLessonInfo(){
    this.userData.updateLessonInfo(this.lesson_id).then( (lesson) =>{
      if(typeof lesson != "undefined" && lesson != null){
        if(lesson.textbook_likes != null){
          this.rtLessonInfo[this.TEXTBOOK].likes = lesson.textbook_likes;
        }
        if(lesson.wordbook_likes != null){
          this.rtLessonInfo[this.WORDBOOK].likes = lesson.wordbook_likes;
        }
        if(lesson.textbook_views != null){
          this.rtLessonInfo[this.TEXTBOOK].views = lesson.textbook_views;
        }
        if(lesson.wordbook_views != null){
          this.rtLessonInfo[this.WORDBOOK].views = lesson.wordbook_views;
        }

        for(let i =0;i<2;i++){
          if(this.rtLessonInfo[i].likes != null){
            if( this.rtLessonInfo[i].likes.indexOf(parseInt(this.userData.userInfo.user_id)) > -1 )  {
              this.rtLessonInfo[i].likeButtonColor = "danger";
              this.rtLessonInfo[i].likeClicked = true;
            }
          }

        }
        console.log("updateLessonInfo",lesson, this.rtLessonInfo);
        // this.lesson = lesson;
      }

    })
  }

  updateCommentSession(tempComment,part_id){
      this.arrCurrentComments[part_id].unshift(tempComment);
      let tempComments = this.tools.deepClone(this.arrCurrentComments[part_id]);
      this.comments[part_id] = this.handleComments(tempComments);
  }

  thumbUp(){
    console.log("lesson","thumbUp")
  }

  updateComments(commentUpdate,part_id){
      this.arrCurrentComments[part_id].forEach(function (comment) {
        if(comment.comment_id == commentUpdate.comment_id){
          comment.likes = commentUpdate.likes;
          comment.likes_amount = commentUpdate.likes_amount;
          return;
        }
    });
  }

  viewCourse(part_id){
    console.log("viewCourse", part_id);

    // if (this.rtLessonInfo[part_id].likeClicked) {
    //   console.log("likeComment click likeClicked");
    //   this.tools.presentErrorAlert("失败","已经赞过!");
    //   return;
    // }

    this.userData.viewCourse(this.userData.userInfo.user_id,this.lesson.lesson_id, part_id).then( () => {
      // let eventObj = {eventType:"likeCourse",eventData:{lesson:lesson,part_id:this.part_id},client_id:this.userData.userInfo.user_id};
      // this.webSocket.sendData(eventObj);
      console.log("viewCourse success")
    }).catch( err => {
      console.error("viewCourse",err)
    })
  }

  likeCourse(part_id){
    console.log("likeVideo", part_id);

    if (this.rtLessonInfo[part_id].likeClicked) {
      console.log("likeComment click likeClicked");
      this.tools.presentErrorAlert("失败","已经赞过!");
      return;
    }

    this.userData.thumbUpCourse(this.userData.userInfo.user_id,this.lesson.lesson_id, part_id, "tb_lesson").then( (lesson) => {
      let eventObj = {eventType:"likeCourse",eventData:{lesson:lesson,part_id:this.part_id},client_id:this.userData.userInfo.user_id};
      this.webSocket.sendData(eventObj);

    }).catch( err => {
      console.error("likeCourse",err)
    })
    this.rtLessonInfo[part_id].likeClicked = true;
    this.rtLessonInfo[part_id].likeButtonColor = "danger";
    // this.rtLessonInfo[part_id].likes_amount++;
    this.rtLessonInfo[part_id].likes.push(this.userData.userInfo.user_id);
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
        let eventObj = {eventType:"likeComment",eventData:{comment:comment,part_id:this.part_id},client_id:this.userData.userInfo.user_id};
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

    this.arrCurrentComments[this.part_id].forEach(function (comment) {
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

  segmentChanged(event){
    if(this.lesson_parts == "book"){
      this.part_id = this.TEXTBOOK;
    } else if(this.lesson_parts == "exercise"){
      this.part_id = this.WORDBOOK;
      this.initCurrentPage();
    } else  if(this.lesson_parts == "vocabulary"){
      let self = this;
      console.log("segmentChanged",this.course_id)
      switch(this.course_id){
        case 1:
          console.log("segmentChanged 1")
          this.getHomeworks();

          break;
        case 2:
          console.log("segmentChanged 2")
          this.getTestResult();

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
    this.navCtrl.push(VideoDubbingPage,{lesson:this.lesson });
  }

  startVocabularyRecording(){
    this.navCtrl.push(VocabularyRecordingPage,{lesson:this.lesson });
  }

  startImgSelectiong(){
    this.navCtrl.push(VocabularySelectingPage,{lesson:this.lesson });
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

    let tmp = {under_which_user:comment.user_id,reply_which_comment:parentComment.comment_id,user_id:this.userData.userInfo.user_id,comment:commentContent,lesson_id:this.lesson_id,comment_date:new Date(),part_id:this.part_id};
    console.log("postCommentUnderComment", tmp )

    this.userData.postComment(tmp)
      .then( (comment) => {
        console.log("postCommentUnderComment:result",comment);
        if(comment != null){
          this.textArea2 = "";

          this.updateCommentSession(comment,this.part_id);
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

    let tmp = {under_which_user:-1,reply_which_comment:-1,user_id:this.userData.userInfo.user_id,comment:this.textArea1,lesson_id:this.lesson_id,comment_date:new Date(),part_id:this.part_id};
    console.log("postComment", tmp,this.userData.userInfo)

    this.userData.postComment(tmp)
      .then( (comment) => {
        console.log("postComment:result",comment);
        if(comment != null){
          this.textArea1 = "";

          this.updateCommentSession(comment,this.part_id);
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
      // data.comments
      if(data != null){
        this.updateCommentSession(data.comment,data.part_id);
      }
    });

    this.events.subscribe("likeComment", (data) => {
      console.log("lisenEvents:likeComment",data)
      if(data.comment != null && data.part_id >= 0 && data.part_id <= 1){
        this.updateComments(data.comment,data.part_id);
        let tempComments = this.tools.deepClone(this.arrCurrentComments);
        this.comments[data.part_id] = this.handleComments(tempComments);
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

  //get useable comments structure
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

  getHomeworks(){
    this.userData.retriveStudentHomework(this.lesson_id,this.userData.userInfo.user_id).then(homeworkData => {
      console.log("getHomeworks",homeworkData);
      if(typeof  homeworkData != "undefined" && homeworkData != null ) {

        this.ngZong.run( ()=>{
          this.submittedHomework = homeworkData;

          let date = new Date(homeworkData.created_date);
          let today = new Date();
          this.submittedHomework .created_date = this.tools.dateDiff(date,today);
          this.viewState = 1;
          console.log("getHomeworks available",this.submittedHomework,this.viewState);
        })
      }
    })
  }

  getTestResult(){
    this.userData.findTestResult(this.lesson_id).then(testResults => {
      console.log("getTestResult",testResults);
      if(typeof  testResults != "undefined" && testResults != null && testResults.length > 0) {
        this.testResults = testResults;
        this.viewState = 1;
      }
      // this.submitState = 1;
    })
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
