import { Injectable } from '@angular/core';
import {AlertController, Events, ToastController,Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {httpEntity} from "./httpEntity";
// import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File  } from '@ionic-native/file';
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";

// import { Http,Headers } from '@angular/http';
// import 'rxjs/add/operator/map';


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HOMEWORK_LOCAL = 'homeworkLocal';

  userInfo: any = {};
  BASE_URL = 'http://192.168.0.102:3000/userRouter/';

  // STATIC_FILE_SERVER = 'http://192.168.0.112:3000/upload';
  // BASE_URL = 'http://127.0.0.1:3000/userRouter/';
  // BASE_URL = 'http://requestb.in/14g052f1';
  currentPageId;
  DEFAULT_ICON = 'assets/img/logos/se.png';

  fileTransfer :TransferObject ;

  ROOT_DIR;
  IMAGE_DIR;
  IMAGE_DIR_NAME = 'user_data';
  AUDIO_DIR_NAME = 'audios';
  testVar: string;

  constructor(public events: Events,
                public storage: Storage,
              public toastCtrl:ToastController,
              private transfer: Transfer,
              private file: File,
              public platform:Platform,
              private alertCtrl: AlertController,
                public httpTools: httpEntity) {
    // this.getDefaultUserData();
    // console.log("UserData",this.userInfo);
    this.fileTransfer = this.transfer.create()

    this.getRootDir();

    console.log("account page",this.IMAGE_DIR);
  }

  getRootDir(){
    if (this.platform.is('android')){
      this.ROOT_DIR = this.file.externalDataDirectory;
      this.IMAGE_DIR =  this.ROOT_DIR  + this.IMAGE_DIR_NAME;
      console.log("account page externalDataDirectory ",this.file.externalDataDirectory + " externalRootDirectory " + this.file.externalRootDirectory)
      return this.ROOT_DIR;
    }
  }

  getDefaultUserData():Promise<any>{
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
     if(value){
       return  this.getUserInfo().then( (userData) =>{
         let today = new Date();
         today.setHours(0,0,0,0);
         this.userInfo.hasChecin = false;
         // console.log("getDefaultUserData",   " today " + today.getTime() + " latestCheckinDate"  + userData.latestCheckinDate);
         if(userData.latestCheckinDate >= today.getTime()){
             this.userInfo.hasChecin = true;
         }
         if(typeof userData.userAvatar == "undefined"){
           console.log("getDefaultUserData","userAvatar undefined")
           this.userInfo.userAvatar = this.DEFAULT_ICON;
         }


         // console.log("getDefaultUserData",this.userInfo);

         return  this.userInfo;

       })
     }
    })
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(userInfo): void {
    var reqData = JSON.stringify(userInfo);
    console.log("login", this.BASE_URL + " data:" + reqData);
    this.httpTools.sendPost(this.BASE_URL + "login", reqData)
      .subscribe( resData=> {
         let  data =  JSON.parse(resData._body);
        console.log("success ? ", data);
        if(data.success){
          //set username got from server 1
          //cache user info.
          // this.setUsername(data.data.user_name);

          this.userInfo.checkinCount = data.data.checkin_count;
          let time = data.data.latest_checkin_datetime;
          this.userInfo.latestCheckinDate =  time;

          console.log("login","  results.data.latest_checkin_datetime " + data.data.latest_checkin_datetime + " " +  this.userInfo.latestCheckinDate);
          this.userInfo.user_name = data.data.user_name;
          this.userInfo.identity = data.data.identity;
          this.userInfo.user_id = data.data.user_id;
          this.userInfo.phone = data.data.phone;
          //download user phone

          this.file.checkDir(this.ROOT_DIR, this.IMAGE_DIR_NAME).then((exist) =>{
            console.log('Directory exists')
            this.download(userInfo.phone + ".jpg");

          }).catch((err) => {
            console.log("directory does not exist")
            this.file.createDir(this.ROOT_DIR, this.IMAGE_DIR_NAME, true).then(() => {
              this.download(userInfo.phone + ".jpg");
            })
              .catch((err) => { console.log("error during creating directory", err)  });
          });

          this.setUserInfo(this.userInfo);
          this.storage.set(this.HAS_LOGGED_IN, true);
          this.storage.set('hasIdentified', 'true');
          this.events.publish('user:login');

        } else {
          this.events.publish('user:loginfailed', "用户名/密码错误!");
          console.log("loginfailed");
        }

      }, error => {
        console.log("Oooops!" , error);
        if(error.status  == 401){
          this.events.publish('user:loginfailed', "用户名/密码错误!");
        }else {
          this.events.publish('user:loginfailed', "请检查网络!");
        }
        // this.presentErrorAlert("登录失败！","请检查网络")
      });
  };



  signup(userInfo): void {
    var reqData = JSON.stringify(userInfo);
    console.log("signup", this.BASE_URL  + " data:" + reqData );
    console.log("515");
    this.httpTools.sendPost(this.BASE_URL + "signUp", reqData)
      .subscribe(resData => {
        let  data =  JSON.parse(resData._body);  //1
        console.log("success" , data);
        if(data.success ){
          console.log("success signup");
          this.storage.set(this.HAS_LOGGED_IN, true);
          this.storage.set('hasIdentified', 'true');

          this.setUserInfo(data.data);
          // this.setUsername(userInfo.user_name);
          this.events.publish('user:signup');
        }else {
          this.events.publish('user:signupfailed', "用户已存在!");
          console.log("user:signupfailed");
        }
      }, error => {
        console.log("Oooops!" + error);
        this.events.publish('user:signupfailed', "请检查网络!");
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  };

     retriveCourses(): void {
    //    var reqData = JSON.stringify({test:"222"});
    // var url = this.BASE_URL + "test" ;
    // this.httpTools.sendPost(url,reqData).subscribe(
    //   response => {
    //     // courses = response.data.children;
    //     console.log("retriveCourses:response" + response.name);
    //   },
    //   err => {
    //     console.log("retriveCourses:Oops!" + err);
    //   }
    // );
    //    this.download("2333.jpg")
  }

  //update local user info. after successfully uploaded data to remove server
  updateUserInfo(userInfo):void{
    var reqData = JSON.stringify(userInfo);
    console.log("updateUserInfo", this.BASE_URL  + " data:" + reqData );
    this.httpTools.sendPost(this.BASE_URL + "updateUserInfo", reqData)
      .subscribe(resData => {
        let  data =  JSON.parse(resData._body);  //1
        console.log("success" , data);
        if(data.success ){
          console.log("success updateUserInfo");
          this.setUserInfo(userInfo);

        }else {
          this.presentToast(" 更新失败！");
          console.log("user:updateUserInfo failed");
        }
      }, error => {
        console.log("Oooops!" + error);
        this.presentToast(" 更新失败！");
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    //clean user cache
    this.userInfo = {userAvatar:this.DEFAULT_ICON};
    this.setUserInfo(this.userInfo);

    this.events.publish('user:logout');
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get('hasSeenTutorial').then((value) => {
      return value;
    });
  }

  presentErrorAlert(errorTitle,errorContent) {
    let alert = this.alertCtrl.create({
      title: errorTitle,
      subTitle:errorContent,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  dailyCheckin() : Promise<boolean>{
  return  this.getUserInfo().then(() =>{
      let hasCheckin = false;
        var reqData = JSON.stringify(this.userInfo);
        console.log("dailyCheckin", this.BASE_URL  + " reqData:" + reqData);
    return  this.httpTools.sendPost(this.BASE_URL + "checkin", reqData)
          .subscribe(resData => {
            let  data =  JSON.parse(resData._body);  //1ss
            console.log("success" , data);
            //save the latest date when check in
            let today = new Date();
            today.setHours(0,0,0,0);
            this.userInfo.latestCheckinDate = today.getTime();

            if(data.success ){
              this.userInfo.checkinCount = data.data.checkinCount;
              hasCheckin = true;
            }
            console.log("dailyCheckin" ,"publish " + hasCheckin + " latestCheckinDate " + this.userInfo.latestCheckinDate);
            this.setUserInfo(this.userInfo);

            this.events.publish('user:checkin',hasCheckin);
            this.events.publish('user:checkinCount',this.userInfo.checkinCount );

            return hasCheckin;
          }, error => {
            console.log("Oooops!" + error);
            // this.events.publish('user:signupfailed', "请检查网络!");
            this.presentErrorAlert("签到失败","请检查网络")
            console.log("dailyCheckin" ,"publish " + hasCheckin);
            this.events.publish('user:checkin',hasCheckin );

            return hasCheckin;
          })
      })
  }

  saveProfile(imagePath:string,phone:string) :Promise<boolean> {
   return this.uploadImage(imagePath,phone);
    // this.userInfo.userAvatar = userAvatar;
    // this.setUserInfo(this.userInfo);
  }

  forgetPassword(password) {

  }

  postComment(tmp):Promise<any> {
    var reqData = JSON.stringify(tmp);
    console.log("postComment", this.BASE_URL + " Comment:" + reqData);
    return   this.httpTools.sendPost(this.BASE_URL + "postComment", reqData)
      .toPromise()
      .then( resData=> {
        let  data =  JSON.parse(resData._body);
        console.log("success ? ", data);
        if(data.success){
          let comment = this.handleResCommentData(data)
          let eventObj = {eventType:"updateComment",eventData:comment};
          this.notifyUpdate(eventObj);
          return comment[0]
        } else {
          return null;
        }

      }, error => {
        console.log("Oooops!" + error);
        return null;
      });
  }

  retriveComments(phone,lesson_id) : Promise<any>{
    console.log("getComments", this.BASE_URL  + "getComments" + "?lesson_id=" + lesson_id + "&phone=" + phone);
    return this.httpTools.sendGet(this.BASE_URL + "getComments" + "?lesson_id=" + lesson_id + "&phone=" + phone)
       .toPromise()
      .then( resData=> {
        console.log("getComments res data ?", resData);
        let  data =  resData;
        if(data.success){

         return this.handleResCommentData(data);
        } else {
          console.log("getComments failed");
          return ;
        }

      }, error => {
        console.log("Oooops!" + error);

      });
  }

  handleResCommentData(data):any{//return array of comments
    let comments = data.data.comments;
    let userInfos = data.data.userinfo;
    let arrFileNames = [];
    let arrComments = [];
    // var self = this;

    // console.log("getComments userInfos",userInfos);
    // console.log("getComments comments",comments);
    for (var i = 0; i < comments.length ; i++) {
      // console.log("getComments",i)
      let fileName = userInfos[i].phone + ".jpg";
      let avatar = this.IMAGE_DIR + "/" + fileName;

      if(arrFileNames.indexOf(fileName) < 0) {
        arrFileNames.push(fileName);
      }
      //convert timestamp to readable date
      let date = comments[i].comment_date;

      //parse comments
      arrComments.push(
        {
          comment_id:comments[i].comment_id,
          avatar:avatar,
          author:comments[i].anchor,
          phone:userInfos[i].phone,
          user_id:userInfos[i].user_id,
          user_name:userInfos[i].user_name,
          content:comments[i].content,
          under_which_user:comments[i].under_which_user,
          reply_which_comment:comments[i].reply_which_comment,
          likes:comments[i].likes != null ? comments[i].likes : [] ,
          likes_amount:comments[i].likes_amount,
          unread_reply:comments[i].unread_reply,
          showReply: false,
          subComments :[] ,
          comment_date:date})
    }
    //download user avatars----
    // console.log("getComments arrFileNames",arrFileNames);
    this.retriveUserAvatar(arrFileNames);
    console.log("user-data:handleResCommentData",arrComments);
    return arrComments;
  }

  thumbUp(user_id,liked_id,table_name) {
    let likeData = {user_id:user_id,liked_id:liked_id,table_name:table_name}
    var reqData = JSON.stringify(likeData);
    console.log("thumbUp", this.BASE_URL  + " data:" + reqData );
    this.httpTools.sendPost(this.BASE_URL + "thumbUp", reqData)
      .subscribe(resData => {
        let  data =  JSON.parse(resData._body);  //1
        console.log("success" , data);
        if(data.success ){
          console.log("success thumbUp");
        }else {
          this.presentToast(" 更新失败！");
          console.log("user:thumbUp failed");
        }
      }, error => {
        console.log("Oooops!" + error);
        this.presentToast(" 更新失败！");
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }



  retriveUserAvatar(arrFileNames) : Promise<boolean>{
    console.log("retriveUserAvatar..."  );
     let  self = this;
    return this.downloadMultiFiles(self,"",arrFileNames,"avatars",this.IMAGE_DIR,this.BASE_URL,this.fileTransfer,this.file)
      .then( result => {
        console.log("retriveUserAvatars", "finished" );
        return true;
      } )
      .catch( error => {
        console.log("retriveUserAvatars", "Error while retrive User Avatars" );
        return false;
      } );
  }


  public uploadImage(imagePath:string,phone:string) :Promise<boolean>{
    // File for Upload
    var targetPath = imagePath;
    // File name only
    var filename = phone + ".jpg";

    var options = {
      fileKey: "avatar",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
    };
    console.log("uploadImage","targetPath " + targetPath + " filename " + filename);
    // Use the FileTransfer to upload the image
  return  this.fileTransfer.upload(targetPath , this.BASE_URL + "uploadAvatar" , options).then(data => {
      this.presentToast('Image succesful uploaded.');
      //save avatar to local cache
      this.userInfo.userAvatar = targetPath;
      this.setUserInfo(this.userInfo);
    return true;
    }, err => {

      this.presentToast('Error while uploading file.');
      console.log("uploadImage","Error while uploading file " + err);
    return false;
    });
  }

  public download(fileName:string) {
    console.log('download : fileName' , fileName);
    this.fileTransfer.download(this.BASE_URL + "download" + "?fileName=" + fileName,this.IMAGE_DIR + "/" + fileName).then((entry) => {

      console.log('download complete: ' + entry.toURL());
      this.userInfo.userAvatar = entry.toURL();
      this.setUserInfo(this.userInfo);
    }, (error) => {
      this.userInfo.userAvatar = this.DEFAULT_ICON;
      this.setUserInfo(this.userInfo);
      console.log('download : error' + error);
      // handle error
    });
  }

  submitHomework(audioFiles,phone,lesson_id) :Promise<boolean>{
    console.log("submitHomework","total " + audioFiles.length + "words Pronounciation");
    // let  transfer0 = new Transfer();
    // let url = 'http://192.168.0.112:3000/userRouter/uploadAudio';
    // let   fileTransfer :TransferObject  = transfer0.create();
  return  this.uploadMultiFiles(audioFiles,this.fileTransfer,this.BASE_URL,phone,lesson_id)

  }

  private updateRemoteVacabularyTable(phone,arrayFileName,lesson_id) {
    let myLesson = {phone:phone,vacabulary_pronunciation:arrayFileName,lesson_id:lesson_id}

    var reqData = JSON.stringify(myLesson);
    console.log("updateRemoteVacabularyTable", this.BASE_URL  + " data:" + reqData );
    this.httpTools.sendPost(this.BASE_URL + "updateRemoteVacabularyTable", reqData)
      .subscribe(resData => {
        let  data =  JSON.parse(resData._body);  //1
        console.log("success" , data);
        if(data.success ){
          console.log("success update");
        }else {
          this.presentToast(" 更新失败！");
          console.log("user:update failed");
        }
      }, error => {
        console.log("Oooops!" + error);
        this.presentToast(" 更新失败！");
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }

  //teacher

  retriveHomework(lesson_id): Promise<any>{
    console.log("retriveHomework", this.BASE_URL  + "getRemoteVacabularyTable" + "?lesson_id=" + lesson_id);
    return this.httpTools.sendGet(this.BASE_URL + "getRemoteVacabularyTable" + "?lesson_id=" + lesson_id)
      .subscribe( resData=> {
        console.log("res data ? ", resData);
        let  data =  resData;
      //   console.log("success ? ", data);
        if(data.success){
          let arrHomeworkCollection = data.data;
          // let   file = new File()
          // let localDir = file.externalDataDirectory;
          // let localAudioDir =  localDir  + "audios";

          // let  transfer0 = new Transfer();
          // // let url = 'http://192.168.0.112:3000/userRouter/download';
          // let   fileTransfer :TransferObject  = transfer0.create();

         return this.file.checkDir(this.ROOT_DIR, this.AUDIO_DIR_NAME).then((exist) =>{
            console.log('Directory exists')
              return    this.checkAllHomeworks(arrHomeworkCollection,this.ROOT_DIR + this.AUDIO_DIR_NAME,this.BASE_URL);
          }).catch((err) => {            //checkin dir error
           this.file.createDir(this.ROOT_DIR , this.AUDIO_DIR_NAME , true).then(() => {
             return this.checkAllHomeworks(arrHomeworkCollection, this.ROOT_DIR + this.AUDIO_DIR_NAME, this.BASE_URL);
           })
             .catch((err) => {
               console.log("error during creating directory", err)
             });
           console.log('Directory not exists')
          });


        } else {
          console.log("retriveHomework failed");
        }

      }, error => {
        console.log("Oooops!" + error);
      });
  }

  checkAllHomeworks(arrHomework,downloadForlder,baseUrl) : Promise<boolean>{
    console.log("checkAllHomeworks..."  );
    var promises = [];

    var arrHomeworkData = [];
    var self = this;

    arrHomework.forEach(function (homework) {
      let studen_phone = homework.student_phone;
      let arrAudioFiles = homework.vacabulary_pronunciation;
      let homeworkdata = {studen_phone:studen_phone,audios:downloadForlder + "/" + arrAudioFiles }
      arrHomeworkData.push(homeworkdata);

      let checkHomeworkPromise =    self.downloadMultiFiles(self,studen_phone,arrAudioFiles,"audios",downloadForlder,baseUrl,self.fileTransfer,self.file)
        .then( result => Promise.resolve(result) )
        .catch( error => Promise.resolve( [] ) );

      promises.push(checkHomeworkPromise);
      console.log("checkAllHomeworks","studen_phone:" + studen_phone + " audio files:" + arrAudioFiles);
    });

    this.saveHomeworkData(arrHomeworkData);

    console.log("checkAllHomeworks","Promise all...");
    return   Promise.all(promises).then(data => {
      console.log("checkAllHomeworks", "finished" );
      console.log("checkAllHomeworks", "finished" );
      return true;
    }, err => {

      console.log("checkAllHomeworks", "Error while checking All Homeworks" );
      return false;
    });
  }


  uploadMultiFiles(audioFiles,fileTransfer,baseUrl,phone,lesson_id):Promise<boolean>{
    var promises = [];
    var arrayFileName = [];

    audioFiles.forEach(function (i) {
      console.log("submitHomework","processing "  + i.audio)
      let fileName = i.audio.substr(i.audio.lastIndexOf('/') + 1);

      let options = {
        fileKey: "audio",
        fileName:fileName ,
        chunkedMode: false,
        mimeType: "audio/mp3",
      };

      let uploadPromise =  fileTransfer.upload(i.audio, baseUrl + "uploadAudio", options)
        .then( result => Promise.resolve(result))
        .catch( error => Promise.resolve( [] ));

      arrayFileName.push(fileName);
      promises.push(uploadPromise);
    });

    console.log("submitHomework","Promise all...");
    return   Promise.all(promises).then(data => {
      this.presentToast('submitHomework succesful uploaded.');
      this.updateRemoteVacabularyTable(phone,arrayFileName,lesson_id);
      return true;
    }, err => {
      this.presentToast('submitHomework Error while uploading file.');
      console.log("submitHomework", "Error while uploading file " + err);
      return false;
    });

  }

  downloadMultiFiles(self,phone,arrFileNames,fileType,downloadPath,baseUrl,fileTransfer,file) : Promise<boolean>{
    let arrPromise = [];
    let fileNames = [];

    console.log("downloadMultiFiles","baseUrl:" + baseUrl + " downloadPath:" + downloadPath + " arrFileNames:" + arrFileNames);


    arrFileNames.forEach(function (i) {
      let fileName = i;
      if(fileNames.indexOf(fileName) < 0){

        fileNames.push(fileName);
        console.log("downloadMultiFiles:file",fileName,file,fileTransfer);

        file.checkFile(downloadPath,fileName).then( (exist) =>{
          if(!exist){
            console.log("downloadMultiFiles:url",baseUrl + "download" + "?fileName=" + fileName + "&fileType=" + fileType + "&schoolName= ",downloadPath + "/" + fileName)
            let promise =    fileTransfer.download(baseUrl + "download" + "?fileName=" + fileName + "&fileType=" + fileType + "&schoolName= ",downloadPath + "/" + fileName)
              .then( result => Promise.resolve(result))
              .catch( error => Promise.resolve( [] ));
            arrPromise.push(promise);
          }else {
            console.log("downloadMultiFiles",fileName + " exist!");
          }
        }).catch( (err) => {
          console.log("error while checkFile" + err)
        })

      }

    });

    console.log("downloadMultiFiles","Promise all...");
    return   Promise.all(arrPromise).then(data => {
      console.log("downloadMultiFiles","finished download user:" + phone)
      return true;
    }, err => {
      console.log("downloadMultiFiles", "Error while download file " + err);
      return false;
    });
  }

  setUserInfo(userInfo: any): void {
    this.storage.set('userInfo', userInfo);
  };

  saveHomeworkData(homework: any): void {
    console.log("user-data:saveHomeworkData",homework);
    this.storage.set(this.HOMEWORK_LOCAL, homework);
  };

  getHomeworkData(): Promise<any> {
    return this.storage.get(this.HOMEWORK_LOCAL).then((value) => {
      // console.log("getUserInfo",value);
      return value;
    });
  };

  getUserInfo(): Promise<any> {
    return this.storage.get('userInfo').then((value) => {
      // console.log("getUserInfo",value);
      this.userInfo = value;
      return value;
    });
  };

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  cleanCache() {
    console.log("logout:cleanCache" + this.ROOT_DIR  + " " + this.IMAGE_DIR_NAME);
    this.file.removeRecursively(this.ROOT_DIR,this.IMAGE_DIR_NAME)
      .catch( (err) => {
        console.log("logout:removeRecursively" + err);
      })
  }
  // createDir():Promise<boolean>{
  //   return
  // }


  private notifyUpdate(eventObj: any) {
    console.log("notifyUpdate",eventObj)
    this.events.publish('websocket:send',eventObj );
  }

  retriveUserInfo(user_id: any) {
    console.log("retriveUserInfo", this.BASE_URL  + "retriveUserInfo" + "?user_id=" + user_id );
    return this.httpTools.sendGet(this.BASE_URL + "retriveUserInfo" + "?user_id=" + user_id )
      .toPromise()
      .then( resData=> {
        console.log("retriveUserInfo res data ?", resData);
        let  data =  resData;
        if(data.success){

          return data.data;
        } else {
          console.log("retriveUserInfo failed");
          return ;
        }

      }, error => {
        console.log("Oooops!" + error);

      });
  }
}
