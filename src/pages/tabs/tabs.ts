import {Component, ViewChild} from '@angular/core';
import {NavParams, Tabs} from 'ionic-angular';
import { MyclassListPage } from '../myclass-list/myclass-list';
import { HomePage } from "../home/home";
import { CardsPage } from "../cards/cards"
import { UserData } from '../../providers/user-data';
import {OnlineCoursesPage} from "../online-courses/online-courses";
import {VacationEducationPage} from "../vacation-education/vacation-education";
import {SerialPermissionOptions} from "ionic-native";
import {SpecialEnglishPage} from "../special-english/special-english";
import {SettingsPage} from "../settings/settings";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = HomePage;
  // tab1Root: any = SchedulePage;
  tab2Root: any = SpecialEnglishPage;
  tab3Root: any = OnlineCoursesPage;
  tab4Root: any = VacationEducationPage;
  tab5Root: any = SettingsPage;
  mySelectedIndex: number;

  // set some user information on cardParams

    constructor(navParams: NavParams, public userData: UserData) {
      this.mySelectedIndex = navParams.data.tabIndex || 0;

  }


  // ionChange(){
  //   console.log("this.userData.currentPageId " ,this.userData.currentPageId );
  // }
  //
  // updateSelectedPageId(){
  //   this.userData.currentPageId =  this.mySelectedIndex;
  // }

}
