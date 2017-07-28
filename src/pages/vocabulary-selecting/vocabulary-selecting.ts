import {Component, NgZone, ViewChild} from '@angular/core';
import {NativeService} from "../../providers/mapUtil";
import {UserData} from "../../providers/user-data";
import {MediaObject, MediaPlugin} from "@ionic-native/media";
import { File  } from '@ionic-native/file';
import * as $ from 'jquery'
import * as Enums from "../../providers/globals";
import {Tools} from "../../providers/tools";
import {DBHelper} from "../../providers/dbhelper";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'vocabulary-selecting',
  templateUrl: 'vocabulary-selecting.html'
})
export class VocabularySelectingPage {

  @ViewChild ("slides") slides:any;

  lastRandom = 0;
  clicking = false;
  private showTestingPage: boolean;
  private showResultPage: boolean;
  private totalWrongTimes: number | any;
  PLAY_ICON: string = "assets/icon/testaudio.png";
  private currentIndex: number = 0;
  disableRecordButton:boolean = null;
  lesson_id:number = 1;
  samplePlayer: MediaObject ;
  playButtonText:string = "Play";
  playButtonIcon:string = this.PLAY_ICON
  testButtonIcon:string = this.PLAY_ICON;
  isPlaying:boolean = null;
  SELECT_RIGHT_AUDIO = "assets/audio/right.mp3";
  SELECT_WRONG_AUDIO = "assets/audio/wrong.mp3";
  vacabularys :any = [];
  isPickWrong = null;
  recorder: MediaObject;
  btRecorder:any;
  readedWordList = [];

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

  constructor(
    public nativeSevice:NativeService,
    private ngZone: NgZone,
    public tools: Tools,
    public  navParams: NavParams,
    public dbHelper:DBHelper,
    public media: MediaPlugin,
    public userData:UserData,
    public file: File) {
    let lesson =  this.navParams.get('lesson');

    this.lesson_id = lesson.lesson_id;
    console.log("vocabulary-selecting.ts", this.lesson_id);
  }

  slideChanged() {
    if(typeof this.slides != "undefined"){

      this.currentIndex = this.slides.getActiveIndex();
      console.log("vacabularyUpdated", this.currentIndex);
      this.playSampleAudio();
      this.isPickWrong = null;
    }
  }


  slideOnHead(){
    console.log("slideOnHead");
    this.slides.lockSwipes(true);
  }

  slidesFinish(){
    console.log("slidesFinish");
    // this.slides.lockSwipes(true);
  }


  initCoolPlayVocabulary() : Promise<any>{
    // for(let i=0;i<this.vacabularys.length;i++){
    // }
    // $('#showExplain').hide();
    this.lastRandom = 0;

    this.dbHelper.getTestResult(this.lesson_id).then( (result) => {
      console.log("getTestResult",result);
      if(result != null && typeof result != "undefined"){
        //show result page
        this.totalWrongTimes = result.wrong_times;
        this.showLastPage();
      }
    }).catch( err => {
      console.error("getTestResult",err);
    })


    this.showTestingPage = true;
    this.showResultPage = null;

    console.log(".",this.vacabularys);
    this.readedWordList = [];
    // this.randomVocabulary = this.getTestTimes()
    this.isPickWrong = null;

    return  this.userData.findCoolPlayVocabulary(this.lesson_id).then( (datas) => {
      this.vacabularys = datas;
      console.log("findCoolPlayVocabulary",this.vacabularys)
      return true;
    })
  }


  getTestTimes(){
    let arr;
    for(let i =0;i<this.vacabularys.length;i++){
      arr.push(this.vacabularys.need_recite_count)
    }
    return arr;
    // return this.vacabularys.length;
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
      console.error("playSampleAudio:Error",e)
    }
  }

  ionViewDidEnter(){
    this.nativeSevice.showLoading("正在加载...")
    if(this.slides != null && typeof  this.slides != "undefined"){
      // this.slides.lockSwipes(true);
      this.slides.lockSwipes(true);
      console.log("lockSwipes")
    }
    this.initCoolPlayVocabulary().then( _ => {
      this.nativeSevice.hideLoading();
    })

  }
}
