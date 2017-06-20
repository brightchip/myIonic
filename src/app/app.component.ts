import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
// import { MapPage } from '../pages/map/map';
// import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
// import { SchedulePage } from '../pages/schedule/schedule';
import { MyclassListPage } from '../pages/myclass-list/myclass-list';
  import { SupportPage } from '../pages/support/support';

import { HomePage } from '../pages/home/home';
import { EntryPage } from '../pages/entry/entry';

// import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import {SignupPage} from "../pages/signup/signup";
import {WebsocketEntity} from "../providers/websocketEntity";
import {LessonPage} from "../pages/lesson/lesson";



export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}



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
    { title: 'My classes', component: TabsPage, tabComponent: MyclassListPage, index: 1, icon: 'contacts' },
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

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public websocket:WebsocketEntity,
    // public confData: ConferenceData,
    public storage: Storage,
      // page: PageInterface,
  public splashScreen: SplashScreen
  ) {

    this.websocket.connect();

    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.storage.get('hasIdentified')
            .then((hasIdentified) => {
              if (hasIdentified) {
                console.log("hasIdentified")
                this.rootPage  = (TabsPage);
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



    // load the conference data
    // confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    this.listenToLoginEvents();
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
      this.enableMenu(true);
      this.nav.setRoot(TabsPage);
      this.rootPage  = (TabsPage);

      this.websocket.connect();

      console.log("app component","login")
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
      this.rootPage  = (TabsPage);
      this.nav.setRoot(TabsPage);

      this.websocket.connect();

      console.log("app component","signup")
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
      this.rootPage  = (LoginPage);
      this.nav.setRoot(LoginPage);

      this.userData.cleanCache();

      this.websocket.closeConnection();
    });

    this.events.subscribe('websocket:send', (eventObj) => {
      this.websocket.sendData(eventObj);
    });

    this.events.subscribe('websocket:receive', (data) => {
      this.handleData(data);
    });

  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

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

}