import {Injectable} from "@angular/core";
import {AlertController, Events, LoadingController, Platform, ToastController} from "ionic-angular";
import {UserData} from "./user-data";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import * as Enums from "./globals";
import { File  } from '@ionic-native/file';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {DBHelper} from "./dbhelper";
import {NativeService} from "./mapUtil";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";

/**
 * Created by Winjoy on 5/19/2017.
 */

@Injectable()
export class Tools{

  // BASE_URL;
  // IMAGE_DIR_NAME;
  // AUDIO_DIR_NAME;

  BASE_URL:string = Enums.baseUrl + '/userRouter/';
  IMAGE_DIR_NAME:string = Enums.IMAGE_DIR_NAME ;
  AUDIO_DIR_NAME:string = Enums.AUDIO_DIR_NAME ;
  ROOT_DIR;
  IMAGE_DIR;
  AUDIO_DIR;
  fileTransfer:TransferObject;

  loading;
  public loadingContent: any;

  constructor(
    private file:File,
    private platform:Platform,
    private alertCtrl: AlertController,
    public events:Events,
    public toastCtrl:ToastController,
    private transfer: Transfer,
    public  loadingCtrl:LoadingController,
    private screenOrientation: ScreenOrientation,
    public nativeService:NativeService,
    public camera: Camera,
    private filePath: FilePath,


  ){
    console.log("tool constructor.......");
    this.platform.ready().then(() => {
      if(this.nativeService.isMobile()){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }else {
        console.log("not on mobile")
      }

      this.getRootDir();
    });
    this.fileTransfer = this.transfer.create();
  }


  getRootDir(){
    if (this.platform.is('android')){
      this.ROOT_DIR = this.file.externalDataDirectory;
      this.IMAGE_DIR =  this.ROOT_DIR  + this.IMAGE_DIR_NAME;
      this.AUDIO_DIR =  this.ROOT_DIR  + this.AUDIO_DIR_NAME;

      console.log("getRootDir ",this.file.externalDataDirectory + " externalRootDirectory " + this.file.externalRootDirectory)
      return this.ROOT_DIR;
    }
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

  downloadAvatar(avatar){
    this.file.checkDir(this.ROOT_DIR, this.IMAGE_DIR_NAME).then((exist) =>{
      console.log('Directory exists')
      this.downloadImg(avatar);
    }).catch((err) => {
      console.log("directory does not exist")
      this.file.createDir(this.ROOT_DIR, this.IMAGE_DIR_NAME, true).then(() => {
        this.downloadImg(avatar);
      })
        .catch((err) => { console.log("error during creating directory", err)  });
    });
  }

  downloadAllhomeworks(arrHomework):Promise<any>{
    console.log("downloadAllhomeworks...",arrHomework );
    var downloadFinshPro = [];
    for(let i =0;i<arrHomework.length;i++){
      let downloadPro =  this.downloadHomework(arrHomework[i])
        .then( result => Promise.resolve(result) )
        .catch( error => Promise.resolve( [] ) );
      downloadFinshPro.push(downloadPro);
    }
    console.log("downloadAllhomeworks","Promise all...");
    return   Promise.all(downloadFinshPro).then(data => {
      console.log("downloadAllhomeworks","finished" )
      return true;
    }, err => {
      console.log("downloadAllhomeworks", "Error while download file " + err);
      return false;
    });

  }

  downloadHomework(homework):Promise<any>{
      let student_id = homework.student_id;
      let arrAudioFiles = homework.vacabulary_pronunciation;
      let downloadFinshPro = [];
      // let homeworkdata = {student_id:student_id,audios:downloadForlder + "/" + arrAudioFiles }
      // arrHomeworkData.push(homeworkdata);
    for(let i =0;i<arrAudioFiles.length;i++){
      let downloadPro =  this.downloadAudio(arrAudioFiles[i])
        .then( result => Promise.resolve(result) )
        .catch( error => Promise.resolve( [] ) );
      downloadFinshPro.push(downloadPro);
    }
    console.log("downloadHomework","Promise all...");
    return   Promise.all(downloadFinshPro).then(data => {
      console.log("downloadHomework","finished student_id :" + student_id)
      return true;
    }, err => {
      console.log("downloadHomework", "Error while download file " + err);
      return false;
    });
  }

  public downloadAudio(fileName:string) :Promise<any> {
    console.log('downloadAudio : fileName', fileName);
    return this.file.checkDir(this.ROOT_DIR, this.AUDIO_DIR_NAME).then((exist) => {
      console.log('Directory exists')
      return  this.downloadFileFromSpecifiedLink(this.BASE_URL + "download" + "?fileName=" + fileName + "&fileType=audio" , this.getAudioUrl(fileName)).then((result) => {
        console.log('downloadAudio result' + result);
        return result;
      });
    }).catch((err) => {            //checkin dir error
      return  this.file.createDir(this.ROOT_DIR, this.AUDIO_DIR_NAME, true).then(() => {
        this.downloadFileFromSpecifiedLink(this.BASE_URL + "download" + "?fileName=" + fileName + "&fileType=audio", this.getAudioUrl(fileName)).then((result) => {
          console.log('downloadAudio result' + result);
          return result;
        });
      })

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
          console.log("downloadMultiFiles",fileName + " exist!");
        }).catch( (err) => {
          console.log("downloadMultiFiles:url",baseUrl + "download" + "?fileName=" + fileName + "&fileType=" + fileType + "&schoolName= ",downloadPath + "/" + fileName)
          let promise =    self.downloadFileFromSpecifiedLink(baseUrl + "download" + "?fileName=" + fileName + "&fileType=" + fileType + "&schoolName= ",downloadPath + "/" + fileName)
            .then( result => Promise.resolve(result))
          arrPromise.push(promise);
          // console.log("error while checkFile" + err)
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

  public uploadImage(imagePath:string,fileName:string) :Promise<boolean>{
    // File for Upload
    var targetPath = imagePath;
    // File name only

    var options = {
      fileKey: "avatar",
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
    };
    console.log("uploadImage","targetPath " + targetPath + " filename " + fileName);
    // Use the FileTransfer to upload the image
    return  this.fileTransfer.upload(targetPath , this.BASE_URL + "uploadAvatar" , options).then(data => {
      this.presentToast('Image succesful uploaded.');
      //save avatar to local cache
      // this.userData.userInfo.userAvatar = targetPath;
      // this.userData.setUserInfo(this.userData.userInfo);
      return true;
    }, err => {
      this.presentToast('Error while uploading file.');
      console.log("uploadImage","Error while uploading file " + err);
      return false;
    });
  }

  uploadMultiFiles(audioFiles,baseUrl,user_id,lesson_id):Promise<any>{
    var promises = [];
    var arrayFileName = [];

    let self = this;
    audioFiles.forEach(function (i) {
      console.log("submitHomework","processing "  + i.audio)
      let fileName = i.audio.substr(i.audio.lastIndexOf('/') + 1);

      let options = {
        fileKey: "audio",
        fileName:fileName ,
        chunkedMode: false,
        mimeType: "audio/mp3",
      };

      let uploadPromise =  self.fileTransfer.upload(i.audio, baseUrl + "uploadAudio", options)
        .then( result => Promise.resolve(result))
        .catch( error => Promise.resolve( [] ));

      arrayFileName.push(fileName);
      promises.push(uploadPromise);
    });

    console.log("submitHomework","Promise all...");
    return   Promise.all(promises).then(data => {
      this.presentToast('submitHomework succesful uploaded.');

      return {user_id:user_id,arrayFileName:arrayFileName,lesson_id:lesson_id};
    }, err => {
      this.presentToast('submitHomework Error while uploading file.');
      console.log("submitHomework", "Error while uploading file " + err);
      return null;
    });

  }

  public downloadImg(fileName:string) {
    console.log('downloadImg : fileName' , fileName);
    this.downloadFileFromSpecifiedLink(this.BASE_URL + "download" + "?fileName=" + fileName + "&fileType=img",this.getImageUrl(fileName)).then((result) => {
      console.log('downloadImg result' + result);
    });
  }


  public downloadFileFromSpecifiedLink(url:string,filePath:string) :Promise<any> {
    console.log('downloadFileFromSpecifiedLink file from',url,'to' , filePath);

    this.fileTransfer.onProgress((event: ProgressEvent) => {
      let num = Math.floor(event.loaded / event.total * 100);
      if (num === 100) {
      } else {
        // console.log('downloadFileFromSpecifiedLink progress' + num + '%');
      }
    });

   return this.fileTransfer.download(url,filePath).then((entry) => {

      console.log('downloadFileFromSpecifiedLink complete: ' , entry.toURL());
      return true;
    }, (error) => {
      console.error('downloadFileFromSpecifiedLink : error' , error);
     return false;
    });


  }

  public getImageUrl(fileName){
    return this.IMAGE_DIR + "/" + fileName;
  }

  public getAudioUrl(fileName){
    return this.AUDIO_DIR + "/" + fileName;
  }

  public  getAvatar(avatar){
    if(avatar != null && typeof avatar != "undefined"){
      this.downloadAvatar(avatar)
      console.log("getAvatar",this.getImageUrl(avatar))
      return this.getImageUrl(avatar);
    }else {
      console.log("getAvatar", "assets/img/default_avatar.png")
      return  "assets/img/default_avatar.png";
    }
  }


  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }



  presentErrorAlert(errorTitle,errorContent) {
    let alert = this.alertCtrl.create({
      title: errorTitle,
      subTitle:errorContent,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  cleanCache() {
    console.log("logout:cleanCache" + this.ROOT_DIR  + " " + this.IMAGE_DIR_NAME);
    this.file.removeRecursively(this.ROOT_DIR,this.IMAGE_DIR_NAME)
      .catch( (err) => {
        console.log("logout:removeRecursively" + err);
      })
  }

  handleResCommentData(data):any{//return array of comments
    console.log("handleResCommentData",data)

    let comments = data.comments;
    let userInfos = data.userinfo;
    if(comments.length <= 0 || userInfos.length <= 0){
      return [];
    }

    let arrFileNames = [];
    let arrComments = [];
    // var self = this;

    for (var i = 0; i < userInfos.length ; i++) {
      console.log("handleResCommentData",userInfos[i])

      //if use haven't update the avatar
      let fileName = "default_avatar.png";
      let avatar = "assets/img/default_avatar.png";

      if(userInfos[i].avatar != null && typeof userInfos[i].avatar != "undefined"){
        fileName = userInfos[i].avatar;
        avatar = this.getImageUrl(fileName);

        if(arrFileNames.indexOf(fileName) < 0) {
          arrFileNames.push(fileName);
        }
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


  public notifyUpdate(eventObj: any) {
    console.log("notifyUpdate",eventObj)
    // this.events.publish('websocket:send',eventObj );
  }

  init() {
    this.getRootDir();
  }

  presentLoadingText() {
   this.loading  = this.loadingCtrl.create({
      spinner: 'hide',
      content: this.loadingContent
    });
    this.loading.present();
  }

  dismissLoadingText(dismissInstant){
    if(this.loading == null){
      return;
    }
    this.loading.dismiss();
    // if(dismissInstant){
    //
    // }else {
    //   setTimeout(() => {
    //     this.loading.dismiss();
    //   }, 1000);
    // }

  }

  deepClone(oldArray: Object[]) {
    let newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  handleUserInfo(data) {
    let userInfo = data;
    userInfo.avatar =  this.getAvatar(data.avatar);
    // userInfo.avatar  = this.IMAGE_DIR + "/" + fileName;
    // let arrFileNames = [fileName];
    // this.retriveUserAvatar(arrFileNames);
   return userInfo;
  }

  checkRemoteFileUrl(audioFIle){
    if(audioFIle.length <7){
      return false
    }
    return true;
  }




  dateDiff(hisTime,nowTime){
      if(!arguments.length) return '';
      var arg = arguments,
        now =arg[1]?arg[1]:new Date().getTime(),
        diffValue = now - arg[0].getTime(),
        result={
          isToday:false, text:"",
        },
        minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24,
        halfamonth = day * 15,
        month = day * 30,
        year = month * 12,

        _year = diffValue/year,
        _month =diffValue/month,
        _week =diffValue/(7*day),
        _day =diffValue/day,
        _hour =diffValue/hour,
        _min =diffValue/minute;

      if(new Date().toDateString()==hisTime.toDateString()){
        result.isToday=true;
      }
      if(_year>=1) result.text = Math.floor(_year) + "年前";
      else if(_month>=1) result.text =  Math.floor(_month) + "个月前";
      else if(_week>=1) result.text = Math.floor(_week) + "周前";
      else if(_day>=1) result.text = Math.floor(_day) +"天前";
      else if(_hour>=1) result.text = Math.floor(_hour) +"个小时前";
      else if(_min>=1) result.text = Math.floor(_min) +"分钟前";
      else result.text="刚刚";

      return result.text;
    }

  //此方法来源于 https://github.com/vuejs/vue-hackernews/blob/gh-pages/src/filters/index.js
  fromNow (dateStr) {
    const between = Date.now() / 1000 - Number(new Date(dateStr.replace(/-/g,'/')).getTime()) / 1000;
    if (between < 3600) {
      return (~~(between / 60)+'分钟前');
    } else if (between < 86400) {
      return (~~(between / 3600)+'小时前');
    } else {
      return (~~(between / 86400)+'天前');
    }
  }

  isToday(dateStr){
    return (new Date().toDateString()==(new Date(dateStr.replace(/-/g,'/')).toDateString()));
  }




  public takePicture(sourceType,user_id) :Promise<any>{

    if(sourceType === this.camera.PictureSourceType.PHOTOLIBRARY){
      console.log("take pic from PHOTOLIBRARY");
      return this.nativeService.getPictureByPhotoLibrary().then(imagePath => {
        console.log("take pic imagePath",imagePath);
        return  this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log("take pic resolveNativePath",filePath);
            if(this.nativeService.isAndroid()){
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              return  this.copyFileToLocalDir(correctPath, currentName, this.createFileName(user_id));
            }else {
              console.log("select Picture on ios")
            }

          });
      })
    }else {
      return  this.nativeService.getPictureByCamera().then(imagePath => {

        if(this.nativeService.isAndroid()) {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          return  this.copyFileToLocalDir(correctPath, currentName, currentName);
        }else {
          console.log("takePicture on ios")
        }

      })

    }

  }



// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName):Promise<any>{
    console.log("copyFileToLocalDir","namePath " + namePath + " currentName " + currentName + "　newFileName "+　newFileName);

   return this.file.checkDir(this.ROOT_DIR, this.IMAGE_DIR_NAME).then((exist) =>{
      console.log('Directory exists')
     return  this.copyImage(namePath,currentName,newFileName);

    }).catch((err) => {
      console.log("directory not exist")
     return this.file.createDir(this.ROOT_DIR, this.IMAGE_DIR_NAME, true).then(() => {
       return  this.copyImage(namePath,currentName,newFileName);
      })
        .catch((err) => { console.log("error during creating directory", err)  });
    });

  }

  copyImage(namePath,currentName,newFileName): Promise<any>{
    console.log('copyImage', namePath,currentName,newFileName);

    return this.file.copyFile(namePath, currentName, this.IMAGE_DIR, newFileName).then(success => {
      //update image view
      // var temp = this.userData.userInfo.avatar;
      let newImgPath = this.pathForImage(newFileName);

      console.log('the image src path:', newImgPath,newFileName);
      return newFileName;

      // this.presentToast('the image src path:'+ this.avatar)
    }, error => {
      this.presentToast('Error while storing file.');
      throw error;
    });
  }


  // Create a new name for the image
  private createFileName(user_id) {
    // var fileName:string = "default_avatar.jpg"
    // if(typeof this.userInfo.phone != "undefined"){
    //   fileName =   this.userInfo.phone + ".jpg";
    // }
    var d = new Date(),
      n = d.getTime(),
      prefeix = user_id + "_",
      newFileName = prefeix +  n + ".jpg";
    return newFileName;
  }
// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.IMAGE_DIR+ "/" + img;
    }
  }
  public pathForAudio(audio) {
    if (audio === null) {
      return '';
    } else {
      return this.AUDIO_DIR+ "/" + audio;
    }
  }




}
