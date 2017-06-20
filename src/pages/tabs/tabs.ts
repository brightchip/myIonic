import {Component, ViewChild} from '@angular/core';
import {NavParams, Tabs} from 'ionic-angular';
import { HomePage } from "../home/home";
import { UserData } from '../../providers/user-data';
import {OnlineCoursesPage} from "../online-courses/online-courses";
import {VacationEducationPage} from "../vacation-education/vacation-education";
import {SpecialEnglishPage} from "../special-english/special-english";
import {SettingsPage} from "../settings/settings";
import {ChatListPage} from "../chat-list/chat-list";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = HomePage;
  tab2Root: any = SpecialEnglishPage;
  tab3Root: any = OnlineCoursesPage;
  tab4Root: any = VacationEducationPage;
  tab5Root: any = ChatListPage;
  tab6Root: any = SettingsPage;
  mySelectedIndex: number;

  // set some user information on cardParams
    constructor(navParams: NavParams, public userData: UserData) {
      this.mySelectedIndex = navParams.data.tabIndex || 0;

      console.log("tab page tab5",this.mySelectedIndex);
  }


  ionViewDidEnter(){
    console.log("tab page entered")
    // this.userData.getDefaultUserData();
  }
  // ionChange(){
  //   console.log("this.userData.currentPageId " ,this.userData.currentPageId );
  // }
  //
  // updateSelectedPageId(){
  //   this.userData.currentPageId =  this.mySelectedIndex;
  // }

}
