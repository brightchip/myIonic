import { Injectable } from '@angular/core';
import {AlertController, Events, ToastController,Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {httpEntity} from "./httpEntity";
import {Auth} from "./auth";
import {Tools} from "./tools";
import * as Enums from "./globals";
import { Headers } from '@angular/http';
import {throttle} from "rxjs/operator/throttle";
import {WebsocketEntity} from "./websocketEntity";
import {DBHelper} from "./dbhelper";
// import {ChatData} from "./chat-data";

@Injectable()
export class UserData {

  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HOMEWORK_LOCAL = 'homeworkLocal';
  DEFAULT_ICON = 'assets/img/logos/se.png';
  BASE_URL = Enums.baseUrl + "/userRouter/";
  testVar: string;
  public userInfo: any = {};

  constructor(public events: Events,
              public storage: Storage,
              private tools: Tools,
              private auth:Auth,
              private httpTools:httpEntity,
              public platform:Platform,
              public websocket:WebsocketEntity,
              public dbHelper:DBHelper
              ) {
  }

  getDefaultUserData():Promise<any>{
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
     if(value){
       return  this.getUserInfo().then( (userData) =>{
         // console.log("getDefaultUserData initialize data",  userData);
         let today = new Date();
         today.setHours(0,0,0,0);
         this.userInfo.hasChecin = false;
         if(typeof userData.latest_checkin_datetime != "undefined"){
           // console.log("getDefaultUserData compare date",   " today " + today.getTime() + " latest_checkin_datetime"  + userData.latest_checkin_datetime);
           if(userData.latest_checkin_datetime >= today.getTime()){
             this.userInfo.hasChecin = true;
           }
         }

         if(typeof userData.avatar == "undefined"){
           // console.log("getDefaultUserData","userAvatar undefined")
           this.userInfo.avatar = this.DEFAULT_ICON;
         }
         // console.log("getDefaultUserData",this.userInfo);
         return  this.userInfo;
       })
     }else {
       throw "not found value";
     }
    })

    // this.userData.getDefaultUserData().then( (userInfo) =>{
    //   if(typeof userInfo != "undefined"){
    //     if(typeof userInfo.user_name != "undefined"){
    //       this.userInfo.user_name = userInfo.user_name;
    //       console.log("AccountPage init", "userInfo.user_name " + userInfo.user_name + " this.userInfo.user_name " + this.userInfo.user_name  )
    //     }
    //     if(typeof userInfo.checkinCount != "undefined"){
    //       this.userInfo.checkinCount = userInfo.checkinCount;
    //       console.log("AccountPage init", "userInfo.checkinCount " + userInfo.checkinCount + " this.userInfo.checkinCount " + this.userInfo.checkinCount  )
    //
    //     }
    //     if(typeof userInfo.userAvatar != "undefined"){
    //       this.userInfo.userAvatar = userInfo.userAvatar;
    //     }
    //     if(typeof userInfo.phone != "undefined"){
    //       this.userInfo.phone = userInfo.phone;
    //     }
    //   }else {
    //     console.log("AccountPage init", "userInfo undefined")
    //   }
    //   console.log("AccountPage init", userInfo)
    // })
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

  loginFinish(user,updateStorage) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set('hasIdentified', 'true');
    this.events.publish('user:login');
    console.log("loginFinished");
    // this.chatData.login(this.userInfo.user_id);

    if(updateStorage){
      // let userInfo = user;
      console.log("user-data:finished login",user);
      this.setUserInfo(user);
    }

  };

  findUserInfo(user_id):any{
    console.log("findUserInfo",user_id);
    var userInfo = {user_id:user_id,user_name:"",avatar:"",phone:""}
    this.dbHelper.getUserInfo(user_id)
     .then( (userInfoOld) => {
      // userInfo = userInfoOld;
       this.retriveUserInfo(user_id).then( (userInfoNew) => {
         userInfo.user_name = userInfoNew.user_name;
         userInfo.avatar = userInfoNew.avatar;
         userInfo.phone = userInfoNew.phone;
         // userInfo = userInfoNew;
         console.log("findUserInfo update userInfoNew",userInfo,userInfoNew)
       })

       userInfo.user_name = userInfoOld.user_name;
       userInfo.avatar = userInfoOld.avatar;
       userInfo.phone = userInfoOld.phone;
       // userInfo = userInfoNew;
       console.log("findUserInfo update userInfoOld",userInfo,userInfoOld)

    }).catch( err => {
      console.error("findUserInfo",err);
       this.retriveUserInfo(user_id).then( (userInfoNew) => {
         userInfo.user_name = userInfoNew.user_name;
         userInfo.avatar = userInfoNew.avatar;
         userInfo.phone = userInfoNew.phone;
         // userInfo = userInfoNew;
         console.log("findUserInfo update userInfoNew",userInfo,userInfoNew)
       })
    })
    return userInfo;
  }

  signup(userInfo) {
    this.auth.create(userInfo).then( data => {
      this.tools.loadingContent = "注册成功"
      this.tools.dismissLoadingText(true);

      this.loginFinish(data,true);
    }).catch( (error) => {

      this.tools.loadingContent = "注册失败"
      this.tools.dismissLoadingText(false);
      console.log("user:signupfailed", error);
      if(error.status  == 401){
        this.events.publish('user:signupfailed', "用户已存在!");
      }else {
        this.events.publish('user:signupfailed', "请检查网络!");
      }
    })

  };

  login(userReq){
    console.log("login: userReq",userReq)
    this.tools.loadingContent = "正在登录..."
    this.tools.presentLoadingText();

    this.auth.checkAuthentication().then( success =>{
      console.log("login: success",success)

      this.tools.loadingContent = "登录成功!"
      this.tools.dismissLoadingText(true);

      this.loginFinish(userReq,false);

    }).catch( err =>{
      console.log("login:checkAuthentication failed",err)

      this.auth.newLogin(userReq).then( user => {
        this.tools.loadingContent = "登录成功!"
        this.tools.dismissLoadingText(true);
        console.log("login newLogin " ,user)
        if(user == null){
          return;
        }

        let time = user.latest_checkin_datetime;
        let userInfo = {
          checkin_count : user.checkin_count,
          latest_checkin_datetime :  time,
          user_name : user.user_name,
          identity : user.identity,
          user_id : user.user_id,
          phone : user.phone,
          avatar:this.tools.getAvatar(user.avatar)
        }
        //download user avatar by phone value
        // this.tools.downloadAvatar(userInfo.avatar)

        this.loginFinish(userInfo,true);
      },error => {
        this.tools.loadingContent = "登录失败!"
        this.tools.dismissLoadingText(false);

        if(error.status  == 401){
          this.events.publish('user:loginfailed', "用户名/密码错误!");
        }else if(error.status  == 402){
          this.events.publish('user:loginfailed', "用户不存在!");
        }else {
          this.events.publish('user:loginfailed', "请检查网络!");
        }
        // this.events.publish('user:loginfailed', "用户名/密码错误!");
        console.log("loginfailed",error);
      })
    })
  }

  logout(){
    this.storage.set('token', '');
    this.storage.remove(this.HAS_LOGGED_IN);
    //clean user cache
    this.userInfo = {};
    this.setUserInfo(this.userInfo);
    this.storage.set("chatlogs", []);
    this.events.publish('user:logout');
  }

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

  postComment(tmp):Promise<any> {
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    var reqData = JSON.stringify(tmp);
    console.log("postComment", this.BASE_URL + " Comment:" + reqData,{headers:headers});
    return   this.httpTools.sendPost(this.BASE_URL + "postComment", reqData,{headers:headers})
      .toPromise()
      .then( resData=> {
        let  data =  JSON.parse(resData._body);
        console.log("success ? ", data);
        // if(data.success){
          let comment = this.tools.handleResCommentData(data.data)

        let eventObj = {eventType:"updateComment",eventData:{comments:comment[0],part_id:tmp.part_id},client_id:this.userInfo.user_id};
        this.websocket.sendData(eventObj);

        return comment[0]
      }, error => {
        console.log("Oooops!" + error);
        this.handleError(error);
        return null;
      });
  }

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

  dailyCheckin() : Promise<boolean>{
    return this.getDefaultUserData().then( (userInfo) => {
      let hasCheckin = false;
      // let today = new Date();
      // today.setHours(0,0,0,0);
      // userInfo.latestCheckinDate = today.getTime();

      //save the latest date when check in
      let today = new Date();
      today.setHours(0,0,0,0);

      var reqData = JSON.stringify(userInfo);
      let headers = new Headers();
      headers.append('Authorization', this.auth.token);

      console.log("dailyCheckin", this.BASE_URL  + "checkin" , reqData,{headers: headers});
      return  this.httpTools.sendPost(this.BASE_URL + "checkin", reqData,{headers: headers})
        .toPromise()
        .then(resData => {
          let  data =  JSON.parse(resData._body);  //1ss
          console.log("success" , data.data.checkin_count );


          this.userInfo.latest_checkin_datetime = today.getTime();
          this.userInfo.checkin_count = data.data.checkin_count;
          hasCheckin = true;

          console.log("dailyCheckin" ,"publish " + hasCheckin + " latest_checkin_datetime " + this.userInfo.latest_checkin_datetime,"checking_count " + this.userInfo.checkin_count);
          this.setUserInfo(this.userInfo);

          return (hasCheckin);
        }, error => {
          this.tools.presentErrorAlert("签到失败","请检查网络")
          console.log("dailyCheckin" ,"err " , error);
          this.handleError(error);
          throw (error);

        })


      })
  }

  saveProfile(imagePath:string,fileName:string,oldAvatar) :Promise<boolean> {

    let useInfo = {user_id:this.userInfo.user_id,avatar:fileName,oldAvatar:oldAvatar};
    this.updateUserAvatar(useInfo).then( () => {
      this.setUserInfo(this.userInfo);
    }).catch( err => {
      console.error("saveProfile",err);
    })
    return  this.tools.uploadImage(imagePath,fileName);
  }

  forgetPassword(password) {

  }

  // public uploadAvatar(imagePath:string,phone:string) :Promise<boolean>{
  //   return this.tools.uploadImage(imagePath,phone);
  // }
  //teacher

  setUserInfo(userInfo: any): void {
    console.log("setUserInfo",userInfo);
    this.storage.set('userInfo', userInfo);
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

  saveHomeworkData(homework: any): void {
    console.log("user-data:saveHomeworkData",homework);
    this.storage.set(this.HOMEWORK_LOCAL, homework);
  };

  public notifyUpdate(eventObj: any) {
    console.log("notifyUpdate",eventObj)
    // this.events.publish('websocket:send',eventObj );
    this.websocket.sendData(eventObj);
  }

  updateUserInfo(userInfo):Promise<any>{
        var reqData = JSON.stringify(userInfo);
        let headers = new Headers();
        headers.append('Authorization', this.auth.token);
        headers.append('Content-Type', 'application/json');

        console.log("updateUserInfo", this.BASE_URL  + "updateUserInfo" , reqData, {headers: headers});
        return this.httpTools.sendPost(this.BASE_URL + "updateUserInfo", reqData, {headers: headers})
          .toPromise()
          .then(resData => {
            let  data =  JSON.parse(resData._body);  //1
            console.log("success updateUserInfo",data);
            this.userInfo.user_name = userInfo.user_name;
            this.setUserInfo(this.userInfo);

            return (data);
            // return data;
          }, error => {
            console.log("user:updateUserInfo failed",error);
            this.tools.presentToast(" 更新失败！");
            this.handleError(error);
            throw (error);
            // this.presentToast(" 更新失败！");
            // this.presentErrorAlert("注册失败！","请检查网络")
          });
  }

  retriveUserInfo(user_id: any): Promise<any>{
       let headers = new Headers();
        headers.append('Authorization', this.auth.token);

        console.log("retriveUserInfo", this.BASE_URL + "retriveUserInfo" + "?user_id=" + user_id, {headers: headers});
       return this.httpTools.sendGet(this.BASE_URL + "retriveUserInfo" + "?user_id=" + user_id, {headers: headers})
          .toPromise()
          .then(resData => {
            console.log("retriveUserInfo res data ?", resData);
            let data = resData.data;
            let userInfo = this.tools.handleUserInfo(data)
            this.dbHelper.updateUserInfo(userInfo);//update local user table

            return userInfo;
          }, error => {
            console.log("Oooops!" + error);
            console.log("retriveUserInfo failed");
            this.handleError(error);
            return {};
            // return;
          });
  }

  updateLessonInfo(lesson_id) {
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);
    console.log("updateLessonInfo", this.BASE_URL + "retriveCourseInfo" + "?lesson_id=" + lesson_id , {headers: headers});
    return this.httpTools.sendGet(this.BASE_URL + "updateLessonInfo" + "?lesson_id=" + lesson_id , {headers: headers})
      .toPromise()
      .then(resData => {
        console.log("updateLessonInfo res data ?", resData);
        let data = resData;

        return data.data;
      }, error => {
        // console.log("Oooops!" + error);
        console.log("updateLessonInfo failed",error);
        this.handleError(error);
        throw  error;
      });
  }

  retriveComments(phone,lesson_id,part_id) : Promise<any>{
        let headers = new Headers();
        headers.append('Authorization', this.auth.token);
        console.log("getComments", this.BASE_URL + "getComments" + "?lesson_id=" + lesson_id + "&phone=" + phone + "&part_id=" + part_id, {headers: headers});
        return this.httpTools.sendGet(this.BASE_URL + "getComments" + "?lesson_id=" + lesson_id + "&phone=" + phone + "&part_id=" + part_id, {headers: headers})
          .toPromise()
          .then(resData => {
            console.log("getComments res data ?", resData);
            let data = resData;

            return this.tools.handleResCommentData(data.data);
          }, error => {
            console.log("Oooops!" + error);
            console.log("getComments failed");
            this.handleError(error);
            throw  error;
          });
  }


  findCity(url) : Promise<any>{
    console.log("findCity",url);
    return this.httpTools.sendGet(url, {})
      .toPromise()
      .then(resData => {
        console.log("findCity res data ?", resData);
        let data = resData;

        return data;
      }, error => {
        console.log("findCity failed",error);;
        throw  error;
      });
  }


  viewCourse(user_id: any, lesson_id: number | any, part_id: any) {
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    let viewData = {user_id: user_id, lesson_id: lesson_id,part_id:part_id}
    var reqData = JSON.stringify(viewData);
    console.log("viewCourse", this.BASE_URL + "viewCourse", reqData, {headers: headers});
    return  this.httpTools.sendPost(this.BASE_URL + "viewCourse", reqData, {headers: headers})
      .toPromise()
      .then(resData => {
        let data = JSON.parse(resData._body);  //1
        console.log("success viewCourse", data);

        return (data.data);
      }, error => {

        this.tools.presentToast(" 更新失败！");
        console.log("user:viewCourse failed", error);
        this.handleError(error);
        throw (error);
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }

  thumbUpCourse(user_id,liked_id,part_id,table_name) :Promise<any> {
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    let likeData = {user_id: user_id, liked_id: liked_id,part_id:part_id, table_name: table_name}
    var reqData = JSON.stringify(likeData);
    console.log("thumbUpCourse", this.BASE_URL + "thumbUpCourse", reqData, {headers: headers});
    return  this.httpTools.sendPost(this.BASE_URL + "thumbUpCourse", reqData, {headers: headers})
      .toPromise()
      .then(resData => {
        let data = JSON.parse(resData._body);  //1
        console.log("success thumbUpCourse", data);

        return (data.data);
      }, error => {

        this.tools.presentToast(" 更新失败！");
        console.log("user:thumbUpCourse failed", error);
        this.handleError(error);
        throw (error);
        // this.presentErrorAlert("注册失败！","请检查网络")
      });
  }

  thumbUp(user_id,liked_id,table_name) :Promise<any> {
        let headers = new Headers();
        headers.append('Authorization', this.auth.token);

        let likeData = {user_id: user_id, liked_id: liked_id, table_name: table_name}
        var reqData = JSON.stringify(likeData);
        console.log("thumbUp", this.BASE_URL + "thumbUp", reqData, {headers: headers});
    return  this.httpTools.sendPost(this.BASE_URL + "thumbUp", reqData, {headers: headers})
          .toPromise()
          .then(resData => {
            let data = JSON.parse(resData._body);  //1
            console.log("success thumbUp", data);

            return (data.comment);
          }, error => {

            this.tools.presentToast(" 更新失败！");
            console.log("user:thumbUp failed", error);
            this.handleError(error);
            throw (error);
            // this.presentErrorAlert("注册失败！","请检查网络")
          });
  }

  retriveStudentHomework(lesson_id,user_id):Promise<any>{
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);

    console.log("retriveStudentHomework", this.BASE_URL + "getHomework" + "?lesson_id=" + lesson_id + "&user_id=" + user_id , {headers: headers});
    return this.httpTools.sendGet(this.BASE_URL + "getHomework" + "?lesson_id=" + lesson_id + "&user_id=" + user_id , {headers: headers})
      .toPromise()
      .then(resData => {
        console.log("retriveStudentHomework data ? ", resData);

        return resData.data;
      }, error => {
        console.log("retriveStudentHomework failed", error);
        this.handleError(error);
        throw  error;
      });
  }

  findTestResult(lesson_id):Promise<any>{
    return this.dbHelper.getTestResult(lesson_id).then( data => {
      return data;
    })
  }

  retriveHomework(lesson_id): Promise<any>{
        let headers = new Headers();
        headers.append('Authorization', this.auth.token);

        console.log("retriveHomework", this.BASE_URL + "getRemoteVacabularyTable" + "?lesson_id=" + lesson_id, {headers: headers});
        return this.httpTools.sendGet(this.BASE_URL + "getRemoteVacabularyTable" + "?lesson_id=" + lesson_id, {headers: headers})
          .toPromise()
          .then(resData => {
            console.log("retriveHomework data ? ", resData);
            let data = resData;
            let arrHomeworkCollection = data;
            this.tools.downloadAllhomeworks(arrHomeworkCollection)

            return data.data;
          }, error => {
            console.log("retriveHomework failed", error);
            this.handleError(error);
            throw  error;
          });
  }

  submitHomework(audioFiles,user_id,lesson_id) :Promise<boolean>{
    console.log("submitHomework","total " + audioFiles.length + "words Pronounciation");
    // let  transfer0 = new Transfer();
    // let url = 'http://192.168.0.112:3000/userRouter/uploadAudio';
    // let   fileTransfer :TransferObject  = transfer0.create();
    return  this.tools.uploadMultiFiles(audioFiles,this.BASE_URL,user_id,lesson_id).then( (data) => {
      if(data != null){
        this.updateRemoteVacabularyTable(data.user_id,data.arrayFileName,data.lesson_id);
      }

    })
  }

  updateRemoteVacabularyTable(user_id,arrayFileName,lesson_id) {

        let myLesson = {user_id: user_id, vacabulary_pronunciation: arrayFileName, lesson_id: lesson_id}
        var reqData = JSON.stringify(myLesson);
        let headers = new Headers();
        headers.append('Authorization', this.auth.token);

        console.log("updateRemoteVacabularyTable", this.BASE_URL + "updateRemoteVacabularyTable", reqData, {headers: headers});
    return    this.httpTools.sendPost(this.BASE_URL + "updateRemoteVacabularyTable", reqData, {headers: headers})
          .toPromise()
          .then(resData => {
            let data = JSON.parse(resData._body);  //1
            console.log("updateRemoteVacabularyTable", data);
            return (data);
          }, error => {
            this.tools.presentToast(" 更新失败！");
            console.log("user:update failed", error);
            this.handleError(error);
            throw (error);
            // this.presentErrorAlert("注册失败！","请检查网络")
          });
  }

  private updateUserAvatar(userInfo):Promise<any>{
    var reqData = JSON.stringify(userInfo);
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);
    headers.append('Content-Type', 'application/json');

    console.log("updateUserAvatar", this.BASE_URL  + "updateUserAvatar" , reqData, {headers: headers});
    return this.httpTools.sendPost(this.BASE_URL + "updateUserAvatar", reqData, {headers: headers})
      .toPromise()
      .then(resData => {
        let  data =  JSON.parse(resData._body);  //1
        console.log("success updateUserAvatar",data);

        return (data);
        // return data;
      }, error => {
        console.log("user:updateUserAvatar failed",error);
        this.tools.presentToast(" 更新失败！");
        this.handleError(error);
        throw (error);
      });

  }

  findCourses():Promise<any>{
    var courseList = []
    return this.dbHelper.getBooks().then( (books) => {
      console.log("findCourses from local cache", books)
      if(typeof  books != "undefined" && books != null && books.length > 1) {
        courseList = this.tools.deepClone(books);
        return courseList;
      }else {
        return this.retriveBookList().then(booksNew => {
          if(typeof  booksNew != "undefined" && booksNew != null && booksNew.length > 1) {
            console.log("findCourses",booksNew)
            for(let i =0;i<booksNew.length;i++) {
              //add to local database
              this.dbHelper.updateBook(booksNew[i]);//update local user table
              // this.dbHelper.updateBook(booksNew[i]);//update local user table
              // if (booksNew[i].state == 1 || booksNew[i].state == 2) {
              //   this.dbHelper.updateBook(booksNew[i]);//update local user table
              // }else if(booksNew[i].state == 4){
              //   this.dbHelper.deleteItem("tb_book",booksNew[i]);//update local user table
              // }
            }
            console.log("findCourses from remote server",  booksNew)
            courseList = this.tools.deepClone(booksNew);
            return courseList;
          }
        })
      }

    }).catch( err => {
      console.error("findCourses",err)
    })
  }

  findLessons(bookInfo):Promise<any>{
    var lessonList = []
    return this.dbHelper.getLessons(bookInfo.book_id).then( (lessonListOld) => {
      if(typeof  lessonListOld != "undefined" && lessonListOld != null && lessonListOld.length > 1) {
        console.log("getLessons of", bookInfo.book_id, lessonListOld)
        lessonList = this.tools.deepClone(lessonListOld);
        return lessonList;
      }else {
        return this.retriveLessonList(bookInfo.book_id).then( lessonListNew => {
          if(typeof  lessonListNew != "undefined" && lessonListNew != null && lessonListNew.length > 1) {


            for(let i =0;i<lessonListNew.length;i++){

              // if(resData[i].state == 1 || resData[i].state == 2){
              this.dbHelper.updateLesson(lessonListNew[i]);//update local user table
              // }else if(resData[i].state == 4){
              //   this.dbHelper.deleteItem("tb_lesson",resData[i]);//update local user table
              // }

            }
            lessonList = this.tools.deepClone(lessonListNew);
            console.log("getLessons from remote server",  lessonList)
            return lessonList;
          }
        })
      }

      // return lessonList;
    }).catch(e => {
      throw e;
    })
  }

  retriveBookList():Promise<any>{
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);
    console.log("retriveBookList", this.BASE_URL + "retriveBookList"  , {headers: headers});
    return this.httpTools.sendGet(this.BASE_URL + "retriveBookList" , {headers: headers})
      .toPromise()
      .then(resData => {
        console.log("retriveBookList res data ?", resData);

        return resData.data;
      }, error => {
        console.log("Oooops!" + error);
        this.handleError(error);
        throw  error;
      });
  }

  retriveLessonList(book_id):Promise<any>{
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);
    console.log("retriveLessonList", this.BASE_URL + "retriveLessonList" + "?book_id=" + book_id , {headers: headers});
    return this.httpTools.sendGet(this.BASE_URL + "retriveLessonList" + "?book_id=" + book_id, {headers: headers})
      .toPromise()
      .then(resData => {
        console.log("retriveLessonList res data ?", resData);

        return resData.data;
      }, error => {
        console.log("Oooops!" + error);
        // console.log("retriveLessonList failed");
        this.handleError(error);
        throw  error;
      });
  }

  retriveVocabularyList(lesson_id):Promise<any>{
    let headers = new Headers();
    headers.append('Authorization', this.auth.token);
    console.log("retriveVocabularyList", this.BASE_URL + "retriveVocabularyList" + "?lesson_id=" + lesson_id , {headers: headers});
    return this.httpTools.sendGet(this.BASE_URL + "retriveVocabularyList" + "?lesson_id=" + lesson_id, {headers: headers})
      .toPromise()
      .then(resData => {
        console.log("retriveVocabularyList res data ?", resData);
        // for(let i =0;i<resData.length;i++){
        //
        //   if(resData[i].state == 1 || resData[i].state == 2){
        //     this.dbHelper.updateVocabulary(resData[i]);//update local user table
        //   }else if(resData[i].state == 4){
        //     this.dbHelper.deleteItem("tb_vocabulary",resData[i]);//update local user table
        //   }
        // }

        return resData.data;
      }, error => {
        console.log("Oooops!" + error);
        // console.log("retriveLessonList failed");
           this.handleError(error);

        throw  error;
      });
  }

  findVocabulary(lesson_id): Promise<any>{
    console.log("findVocabulary",lesson_id);
    var vocabularys = []
    return this.dbHelper.getVocabularys(lesson_id).then( (vocabularysOld) => {
      if(typeof  vocabularysOld != "undefined" && vocabularysOld != null && vocabularysOld.length > 1) {
        console.log("findVocabulary from local cache", vocabularysOld)
        for (let i = 0; i < vocabularysOld.length; i++) {
          console.log("findVocabulary process", vocabularysOld[i])
          var vocabulary = {
            vocabulary_id: vocabularysOld[i].vocabulary_id,
            word: vocabularysOld[i].word,
            pronunciation: vocabularysOld[i].pronunciation,
            explain: vocabularysOld[i].explain,
            sampleAudio: vocabularysOld[i].audio,
            explain_img:vocabularysOld[i].explain_img,
            userAudio:""
          };
          vocabularys.push(vocabulary);
          // if (!this.tools.checkRemoteFileUrl(vocabularysOld[i].audio)) {
          //   console.log("findVocabulary process", vocabularysOld[i], "local file not found try to download from remote serve")
          //   let audio = this.tools.getAudioUrl(this.createFileName())
          //   vocabulary.sampleAudio = audio;
          //   this.tools.downloadFileFromSpecifiedLink(vocabularysOld[i].audio_url, audio);
          // }
        }
      }else {
        this.retriveVocabularyList(lesson_id).then( data => {

          if(typeof  data != "undefined" && data != null && data.length > 1) {
            for (let i = 0; i < data.length; i++) {
              console.log("findVocabulary process", data[i])
              this.dbHelper.updateVocabulary(data[i]);//update local user table
              var vocabulary = {
                vocabulary_id: data[i].vocabulary_id,
                word: data[i].word,
                pronunciation: data[i].pronunciation,
                explain: data[i].explain,
                sampleAudio: data[i].audio,
                explain_img:data[i].explain_img,
                userAudio:""
              };
              vocabularys.push(vocabulary);

              // if (!this.tools.checkRemoteFileUrl(vocabularysOld[i].audio)) {
              //   console.log("findVocabulary process", vocabularysOld[i], "local file not found try to download from remote serve")
              //   let audio = this.tools.getAudioUrl(this.createFileName())
              //   vocabulary.sampleAudio = audio;
              //   this.tools.downloadFileFromSpecifiedLink(vocabularysOld[i].audio_url, audio);
              // }
            }
            console.log("findVocabulary from remote server",  vocabularys)
            return vocabularys;
          }
        })
          // vocabularys.push(vocabulary);
          // console.log("findVocabulary find a vocabulary" + vocabulary)
        // }
      }
      return vocabularys;
    })

  }

  loginExpaired(){
    this.events.publish('login:expaired');
    console.log("login expaired");
  }

  findCoolPlayVocabulary(lesson_id) : Promise<any>{
    console.log("findCoolPlayVocabulary",lesson_id);
    var vocabularys = []
  return  this.dbHelper.getCoolPlayVocabularys(lesson_id).then( (vocabularysOld) => {

      if(typeof  vocabularysOld != "undefined" && vocabularysOld != null && vocabularysOld.length > 1) {
          console.log("findCoolPlayVocabulary of" , lesson_id,vocabularysOld,vocabularysOld.length)

          for (let i = 0; i < vocabularysOld.length; i++) {

              this.dbHelper.getRandomRows(vocabularysOld[i]).then( (randoms) => {
              var vocabulary = {wrongAnswer:null,
                correctAnswer:null,
                vocabulary_id:vocabularysOld[i].vocabulary_id,
                word:vocabularysOld[i].word,
                pronunciation: vocabularysOld[i].pronunciation,
                explain:vocabularysOld[i].explain,
                explain_img:vocabularysOld[i].explain_img,
                sampleAudio:vocabularysOld[i].audio,
                randoms:randoms,
                need_recite_count:1,
                recite_wrong_times:vocabularysOld[i].recite_wrong_times};
              console.log("findCoolPlayVocabulary process" , vocabularysOld[i])
              // if (!this.tools.checkRemoteFileUrl(vocabularysOld[i].audio)) {
              //   console.log("findVocabulary process" ,vocabularysOld[i],"local file not found try to download from remote serve")
              //   let audio = this.tools.getAudioUrl(this.createFileName())
              //   vocabulary.sampleAudio = audio;
              //   this.tools.downloadFileFromSpecifiedLink(vocabularysOld[i].audio_url, audio);
              // }
                vocabularys.push(vocabulary);
                console.log("findVocabulary find a vocabulary" , vocabulary)
            })

          }
      }else {
        this.retriveVocabularyList(lesson_id).then( data => {
          for (let i = 0; i < data.length; i++) {

            this.dbHelper.getRandomRows(data[i]).then((randoms) => {
              var vocabulary = {
                wrongAnswer: null,
                correctAnswer: null,
                vocabulary_id: data[i].vocabulary_id,
                word: data[i].word,
                pronunciation: data[i].pronunciation,
                explain: data[i].explain,
                explain_img: data[i].explain_img,
                sampleAudio: data[i].audio,
                randoms: randoms, need_recite_count: 1,
                recite_wrong_times: data[i].recite_wrong_times
              };
              console.log("findCoolPlayVocabulary from remote server process", data[i])
              // if (!this.tools.checkRemoteFileUrl(data[i].audio)) {
              //   console.log("findVocabulary  from remote server  process", data[i], "local file not found try to download from remote serve")
              //   let audio = this.tools.getAudioUrl(this.createFileName())
              //   vocabulary.sampleAudio = audio;
              //   this.tools.downloadFileFromSpecifiedLink(vocabularysOld[i].audio_url, audio);
              // }
              vocabularys.push(vocabulary);
              // console.log("findVocabulary find a vocabulary", vocabulary)
            })
          }
        })
      }
    return vocabularys;
    })

  }

  parseVocabularyData(data){

  }

  retriveVocabulary(vocabulary){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let audioUrl =        "http://api.wordnik.com/v4/word.json/" + vocabulary +"/audio?useCanonical=false&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
    let pronuciationUrl = "http://api.wordnik.com:80/v4/word.json/"+ vocabulary  +"/pronunciations?useCanonical=false&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
    let testUrl =         "http://api.wordnik.com/v4/word.json/map/audio?useCanonical=false&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
    console.log("translate send http request",audioUrl,pronuciationUrl)
    this.httpTools.sendGet(audioUrl,{})
      .toPromise()
      .then(resData => {
        console.log("translate audio",resData)
      }).catch( error => {
      this.handleError(error);
      console.error("translate audio",error)
    })

    this.httpTools.sendGet(pronuciationUrl,{headers:headers})
      .toPromise()
      .then(resData => {
        console.log("translate pronunciation",resData)
      }).catch( error => {
      this.handleError(error);
      console.error("translate pronunciation",error)
    })
  }

  // Create a new name for the image
  private createFileName()  {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  this.userInfo.phone + "_" + n + ".mp3";
    return newFileName;//this.vacabularys[this.currentIndex].word;
  }


  private handleError(error: any) {
    console.error("handle error",error);
    if(error.status == 401){
      this.loginExpaired();
    }
  }

}
