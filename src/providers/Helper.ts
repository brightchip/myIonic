/**
 * Created by Winjoy on 7/15/2017.
 */
import {Injectable} from '@angular/core';
import {NativeService} from "./mapUtil";
import {JPush} from "ionic3-jpush";


/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class Helper {

  constructor(private nativeService: NativeService,    public jPush: JPush,) {
  }

  initJpush() {
    setTimeout(() => {

      // this.jPush.setBadge(10);
      this.jPush.getRegistrationID().then(regid => {
        console.log("getRegistrationID",regid)
      }).catch( err=>{
        console.error("getRegistrationID",err)
      })

      this.jPush.openNotification();

      this.jPush.receiveNotification().subscribe( msg=> {
        console.log("receiveNotification",msg)
      })

      // this.setJpush();
    },5000);
    // this.jPushAddEventListener();
  }


  setJpush(){



  }

  private jPushAddEventListener() {
    //判断系统设置中是否允许当前应用推送
    window['plugins'].jPushPlugin.getUserNotificationSettings(result => {
      if (result == 0) {
        console.log('系统设置中已关闭应用推送');
      } else if (result > 0) {
        console.log('系统设置中打开了应用推送');
      }
    });

    //点击通知进入应用程序时会触发的事件
    document.addEventListener("jpush.openNotification", event => {
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.openNotification" + content);
    }, false);

    //收到通知时会触发该事件
    document.addEventListener("jpush.receiveNotification", event => {
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.receiveNotification" + content);
    }, false);

    //收到自定义消息时触发这个事件
    document.addEventListener("jpush.receiveMessage", event => {
      let message = this.nativeService.isIos() ? event['content'] : event['message'];
      console.log("jpush.receiveMessage" + message);
    }, false);


    //设置标签/别名回调函数
    document.addEventListener("jpush.setTagsWithAlias", event => {
      console.log("onTagsWithAlias");
      let result = "result code:" + event['resultCode'] + " ";
      result += "tags:" + event['tags'] + " ";
      result += "alias:" + event['alias'] + " ";
      console.log(result);
    }, false);

  }

  //设置标签
  public setTags(tags) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.setTags(tags);

    // // let tags = this.nativeService.isAndroid() ? ['android'] : ['ios'];
    // console.log('设置setTags:' + tags);
    // window['plugins'].jPushPlugin.setTags(tags);
  }

  //设置别名,一个用户只有一个别名
  public setAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.setAlias(userId);
  //   console.log('设置setAlias:' + userId);
  //   //ios设置setAlias有bug,值必须为string类型,不能是number类型
  //   window['plugins'].jPushPlugin.setAlias('' + userId);
  }

}

// 作者：小军617
// 链接：http://www.jianshu.com/p/eb8ab29329d9
//   來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
