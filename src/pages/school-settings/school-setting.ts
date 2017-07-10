import { Component } from '@angular/core';
import {ActionSheetController, AlertController, Events, NavController} from 'ionic-angular';
import {UserData} from "../../providers/user-data";
import {AccountPage} from "../account/account";
import * as Enums from "../../providers/globals";
import {NativeService} from "../../providers/mapUtil";
import {Tools} from "../../providers/tools";
import {Camera} from "@ionic-native/camera";

@Component({
  selector: 'page-school-setting',
  templateUrl: 'school-setting.html'
})
export class SchoolSettingsPage {

  school:any = {school_name:"school1",school_content:"abcd"};
  school_parts: string = "preview";
  TEXT_ADD_PROFILE = "添加封面";
  TEXT_MODIFY_PROFILE = "更改封面";
  TEXT_ADD_SCHOOL = "添加学校信息";
  TEXT_MODIFY_SCHOOL = "更改学校信息";
  TEXT_ADD_MAINBOARD = "添加首页内容";
  TEXT_MODIFY_MAINBOARD = "更改首页内容";
  TEXT_ADD_COURSE = "添加课程";
  TEXT_ADD_ACTIVITY = "添加活动";
  // TEXT_MODIFY_MAINBOARD = "更改首页内容";

  constructor(public navCtrl: NavController,
              public events: Events,
              public userData:UserData,
              public actionSheetCtrl: ActionSheetController,
              public tools:Tools,
              public camera: Camera,
              public alertCtrl: AlertController,
              public nativeService:NativeService) {

  }

  ionViewDidEnter() {
    this.init();
  }

  init(){
    this.userData.retriveSchoolInfo(this.userData.userInfo.user_id).then(data => {
      this.school = data;
      if(data.length < 1){
        this.nativeService.showToast("还未建立学校！")
      }
      this.userData.retriveCourses(this.school.school_id).then(data => {
        this.school.courses = data;
        console.log("init retriveCourses",data);
      })

      this.userData.retriveActivities(this.school.school_id).then(data => {
        this.school.activities = data;
        console.log("init retriveActivities",data);
      })
      // this.school.school_profile = "assets/img/anime3.jpg";
      console.log("init retriveSchoolInfo",this.school);
    })

  }

  segmentChanged(){

  }

  updatePicture(){
    this.presentActionSheet();
  }

  cancel(){

  }

  applyChange(){

  }

  changeSchoolName(){
    let alert = this.alertCtrl.create({
      title: '更改学校名',
      buttons: [
        '取消'
      ]
    });
    alert.addInput({
      name: 'school_name',
      value: this.school.school_name,
      placeholder: '输入学校名'
    });
    alert.addInput({
      name: 'school_content',
      value: this.school.school_content,
      placeholder: '输入学校简介'
    });
    alert.addButton({
      text: '确定',
      handler: (data: any) => {
        let reqUserInfo = {school_name:data.school_name,school_content:data.school_content,principal_id:this.userData.userInfo.user_id};

        this.updateSchoolInfo(reqUserInfo);

      }
    });
    alert.present();
  }

  addActivityDialog(title,activity,addItem){
    let alert = this.alertCtrl.create({
      title: title,
      buttons: [
        '取消'
      ]
    });
    alert.addInput({
      name: 'activity_name',
      value:activity.activity_name,
      placeholder: '输入活动名'
    });
    alert.addInput({
      name: 'activity_content',
      value:activity.activity_content,
      placeholder: '输入活动简介'
    });
    alert.addButton({
      text: '确定',
      handler: (data: any) => {
        if(addItem){
          let reData = {activity_name:data.activity_name,activity_content:data.activity_content,school_id:this.school.school_id};
          this.addActivityRemotely(reData);
        }else {
          let reData = {activity_name:data.activity_name,activity_content:data.activity_content,activity_id:activity.activity_id};
          this.updateActivityRemotely(reData,activity);
        }

      }
    });
    alert.present();
  }

  addCourseDialog(title,course,addItem){　
    let alert = this.alertCtrl.create({
      title: title,
      buttons: [
        '取消'
      ]
    });
    alert.addInput({
      name: 'course_name',
      value:course.course_name,
      placeholder: '输入课程名'
    });
    alert.addInput({
      name: 'course_content',
      value:course.course_content,
      placeholder: '输入课程简介'
    });
    alert.addButton({
      text: '确定',
      handler: (data: any) => {


        if(addItem){
          let reData = {course_name:data.course_name,course_content:data.course_content,school_id:this.school.school_id};
          this.addCourseInServer(reData);
        }else {
          let reData = {course_name:data.course_name,course_content:data.course_content,course_id:course.course_id};
          this.updateCourseInServer(reData,course);
        }


      }
    });
    alert.present();
  }

  changeSchoolMainBorad(){

  }

  presentActionSheet() {
    let oldImg = this.school.school_profile;
    let actionSheet = this.actionSheetCtrl.create({
      title: '选择图片',
      buttons: [
        {
          text: '从相册中选择',
          handler: () => {
           this.tools.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,this.userData.userInfo.user_id).then(newFileName => {
             this.updateImg(newFileName,oldImg);
           })
          }
        },
        {
          text: '拍照',
          handler: () => {
            this.tools.takePicture(this.camera.PictureSourceType.CAMERA,this.userData.userInfo.user_id).then(newFileName => {
              this.updateImg(newFileName,oldImg);
            })

          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  updateImg(newFileName,oldImg){
    console.log("updateImg",newFileName,oldImg)

    let oldImgName = "";
    if(oldImg != null){
      let oldImgName = oldImg.lastIndexOf('/') + 1;
    }

    return  this.userData.updateSchoolProfile(this.school.school_id,this.userData.userInfo.user_id,this.tools.pathForImage(newFileName),newFileName,oldImgName).then( (success) =>{
      console.log("copyImage:saveProfile",success)
      if(!success){//set image back when failed upload
        this.school.school_profile = oldImg;
      }else {
        this.school.school_profile = this.tools.pathForImage(newFileName);
      }
    })
  }

  addCourse(){
    console.log("addCourse")
    this.addCourseDialog("添加王牌课程",{},true);　
  }

  addActivity(){
    console.log("addActivity")
    this.addActivityDialog("添加最近活动",{},true);
  }

  editCourse(course){
    console.log("updateCourse",course)
    this.addCourseDialog("修改王牌课程",course,false);
  }

 editActivity(activity){
    console.log("updateActivity",activity)
    this.addActivityDialog("修改最近活动",activity,false);
  }


  removeCourse(course){
    console.log("removeCourse",course)
    let confirm = this.alertCtrl.create({
      title: "删除",
      message: "删除该项",
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
            return;
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('Agree clicked');
            this.userData.removeCourse(course).then( _=>{
              var index = this.school.courses.indexOf(course);
              this.school.courses.splice(index,1);
            })
          }
        }
      ]
    });
    confirm.present();
  }

  removeActivity(activity){
    console.log("removeActivity",activity)
    let confirm = this.alertCtrl.create({
      title: "删除",
      message: "删除该项",
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          return
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('Agree clicked');
            this.userData.removeActivity(activity).then( _=>{
              var index = this.school.activities.indexOf(activity);
              this.school.activities.splice(index,1);
            })
          }
        }
      ]
    });
    confirm.present();

  }


  private updateSchoolInfo(reqUserInfo: { school_name: (any | string | string | string); school_content: (string | any | string | string); principal_id: any }) {
    console.log("updateSchoolInfo",this.school);

    if(this.school.id == null || typeof this.school.id == "undefined"){
      console.log("updateSchoolInfo create new school");
      this.userData.addSchoolInfo(reqUserInfo).then( (results => {
        this.school.school_name = reqUserInfo.school_name;
        this.school.school_content = reqUserInfo.school_content
      })).catch(err => {
        // this.userData.userInfo.user_name = temp;
      } )
    }else {
      this.userData.updateSchoolInfo(reqUserInfo).then( (results => {
        this.school.school_name = reqUserInfo.school_name;
        this.school.school_content = reqUserInfo.school_content
      })).catch(err => {
        // this.userData.userInfo.user_name = temp;
      } )
    }

  }

  private addCourseInServer(reData: { course_name: (any | string | string | string); course_content: (any | string | string | string | string); school_id: any }) {
    console.log("addCourseInServer",reData,this.school);

    if(reData.school_id == null || reData.school_id == "undefined"){
      this.nativeService.showToast("请先建立院校")
      return;
    }

    this.userData.addCourseRemotely(reData).then( (results => {
      // let course =
      console.log("addCourseInServer ",results);
      this.school.courses.push(results);
    })).catch(err => {
      // this.userData.userInfo.user_name = temp;
    } )
  }

  private updateCourseInServer(reData: { course_name: (any | string | string | string); course_content: (any | string | string | string | string); course_id: any },course) {
    console.log("updateCourseInServer",reData,this.school);

    if(reData.course_id == null || reData.course_id == "undefined"){
      // this.nativeService.showToast("请先建立院校")
      return;
    }

    this.userData.updateCourseRemotely(reData).then( (results => {
      // let course =
      console.log("updateCourseInServer ",results);
      course.course_name = results.course_name;
      course.course_content = results.course_content;
      console.log("updateCourseInServer ",course);
    })).catch(err => {

    })
  }

  private addActivityRemotely(reData: { activity_name: any; activity_content: any; school_id: any }) {
    console.log("addActivityRemotely",reData,this.school);

    if(reData.school_id == null || reData.school_id == "undefined"){
      this.nativeService.showToast("请先建立院校")
      return;
    }
    // console.log("addActivityRemotely ");
    this.userData.addActivityRemote(reData).then( (results => {
      console.log("addActivityRemotely ",results);
      this.school.activities.push(results);
    })).catch(err => {

    } )
  }


  private updateActivityRemotely(reData: { activity_name: any; activity_content: any; activity_id: any },activity) {
    console.log("updateActivityRemotely",reData,this.school);

    if(reData.activity_id == null || reData.activity_id == "undefined"){

      return;
    }

    this.userData.updateActivityRemote(reData).then( (results => {

      activity.activity_name = results.activity_name;
      activity.activity_content = results.activity_content;
      console.log("updateActivityRemotely ",activity);
    })).catch(err => {

    })
  }



}
