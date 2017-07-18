import { Component, ViewChild } from '@angular/core';
import {Events, MenuController, Nav, Platform, ToastController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { HomePage } from '../pages/home/home';
import { EntryPage } from '../pages/entry/entry';
import { UserData } from '../providers/user-data';
import {WebsocketEntity} from "../providers/websocketEntity";
import {Tools} from "../providers/tools";
import {Auth} from "../providers/auth";
import {ChatData} from "../providers/chat-data";
import {DBHelper} from "../providers/dbhelper";
import {enableProdMode} from '@angular/core';
import {BookControl} from "../providers/book-control";
import {JPushService} from "ionic2-jpush";
import {NativeService} from "../providers/mapUtil";
import {Helper} from "../providers/Helper";
import {JPush} from "ionic3-jpush";
// import { JPush } from 'ionic-native';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}


declare var window;
@Component({
  templateUrl: 'app.template.html'
})

export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  test:any;


  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    // { title: 'Schedule', component: TabsPage, tabComponent: SchedulePage, icon: 'calendar' },
    { title: 'Home', component: TabsPage, tabComponent: HomePage,  index: 0, icon: 'map' },
    // { title: 'My classes', component: TabsPage, tabComponent: MyclassListPage, index: 1, icon: 'contacts' },
    { title: 'About', component: TabsPage, tabComponent: AboutPage, index: 2, icon: 'information-circle' },

    // { title: 'Map', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map' },
    // { title: 'Map', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map' },
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', component: AccountPage, icon: 'person' },
    { title: 'Support', component: SupportPage, icon: 'help' },
    { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
    { title: 'Support', component: SupportPage, icon: 'help' },
    { title: 'Signup', component: EntryPage, icon: 'person-add' }
  ];
  rootPage: any;
  private loginToast: any;

  msgList:Array<any>=[];

  constructor(
    public events: Events,
    public userData: UserData,
    // public menu: MenuController,
    public platform: Platform,
    public chatData:ChatData,
    public websocket:WebsocketEntity,
    public tools: Tools,
    public auth:Auth,
    public storage: Storage,
    public toastCtrl:ToastController,
    public dbHelper:DBHelper,
    public nativeService:NativeService,
    public bookControl:BookControl,
      // page: PageInterface,

    public helper:Helper,
    public splashScreen: SplashScreen,
    private jPushPlugin: JPushService
  ) {
    // //noinspection JSAnnotator
    // if (this.platform.is('ios') || this.platform.is('android')) {
    //
    //   enableProdMode();
    // } else {
    //   // something else
    // }

    this.initJPush();

    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.storage.get('hasIdentified')
            .then((hasIdentified) => {
              if (hasIdentified) {
                console.log("hasIdentified")
                this.rootPage  = (TabsPage);
                this.presentLoginToast("正在尝试连接到服务器...")
                this.auth.checkAuthentication().then( success =>{
                  // console.log("login: success",success)
                  // this.rootPage  = (LoginPage)
                  this.dimissToastBar();
                  // this.chatData.login(this.userData.userInfo.user_id);
                  console.log("token still working")
                  this.afterLogined();

                  // this.bookControl.loadCourses();

                }).catch( err =>{
                  console.log("token expired")
                  this.dimissToastBar();
                  this.tools.presentToast("登录已过时")
                  this.rootPage  = (LoginPage)
                });

              } else {
                this.rootPage  = (LoginPage)
                // this.rootPage = (TabsPage)
              }
            });
        } else {
          this.rootPage = TutorialPage;
        }
        // this.rootPage  = (TabsPage);
        this.platformReady()//ss
      });
    // decide which menu items should be hidden by current login status stored in local storage
    // this.userData.hasLoggedIn().then((hasLoggedIn) => {
    //   // this.enableMenu(hasLoggedIn === true);
    // });

    this.listenToLoginEvents();

}


  initJPush() {
    this.platform.ready().then( () =>{

      console.log("init");
      // this.init2();
      // this.jPush. init().then(_=>{
      // })

      console.log("openNotification")
      this.helper.initJpush();

      // this.setJpush();


    })
  }


  dimissToastBar(){
    this.loginToast.dismiss();
  }

  public presentLoginToast(text) {
    this.loginToast = this.toastCtrl.create({
      message: text,
      duration: 3600000,
      position: 'top'
    });
    this.loginToast .present();
  }


  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index }).catch(() => {
        console.log("Didn't set nav root");
      });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);

  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      // this.enableMenu(true);
      this.nav.setRoot(TabsPage);
      this.rootPage  = (TabsPage);

      this.afterLogined();

      // this.bookControl.loadCourses();

      console.log("app component","login")
    });

    this.events.subscribe('user:signup', () => {
      // this.enableMenu(true);
      this.rootPage  = (TabsPage);
      this.nav.setRoot(TabsPage);

      this.afterLogined();

      // this.bookControl.loadCourses();

      console.log("app component","signup")
    });

    this.events.subscribe('user:logout', () => {
      // this.enableMenu(false);
      this.rootPage  = (LoginPage);
      this.nav.setRoot(LoginPage);

      // this.tools.cleanCache();

      this.websocket.closeConnection();
    });

    this.events.subscribe('login:expaired',() => {
      this.rootPage  = (LoginPage);
      this.nav.setRoot(LoginPage);
      this.tools.presentToast("登录已过时")
      // this.tools.cleanCache();

      this.websocket.closeConnection();
    });

    // this.events.subscribe('websocket:send', (eventObj) => {
    //   this.websocket.sendData(eventObj);
    // });
    //
    // this.events.subscribe('websocket:receive', (data) => {
    //   this.handleData(data);
    // });

  }

  // enableMenu(loggedIn: boolean) {
  //   this.menu.enable(loggedIn, 'loggedInMenu');
  //   this.menu.enable(!loggedIn, 'loggedOutMenu');
  // }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {

        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }

  private handleData(data: any) {
    console.log("handleData",data)
  }


  private afterLogined() {
    console.log("afterLogined");
    this.websocket.connect();
    this.userData.getUserInfo().then( _=>{
      this.helper.setTags("" + this.userData.userInfo.identity);
      this.helper.setAlias( "" + this.userData.userInfo.user_id)

    })



  }
}
