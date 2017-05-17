import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { ConferenceApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { MyclassListPage } from '../pages/myclass-list/myclass-list';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { HomePage } from '../pages/home/home';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EntryPage } from "../pages/entry/entry";

import { SMS } from '@ionic-native/sms';
import {VacationEducationPage} from "../pages/vacation-education/vacation-education";
import {SpecialEnglishPage} from "../pages/special-english/special-english";
import {OnlineCoursesPage} from "../pages/online-courses/online-courses";
import { StudentCoursesPage } from "../pages/student-courses/student-courses";
import { ParentsCoursesPage } from "../pages/parents-courses/parents-courses";
import {CoursePage} from "../pages/course/course";
import {LessonPage} from "../pages/lesson/lesson";
import {SettingsPage} from "../pages/settings/settings";
import {httpEntity} from "../providers/httpEntity";

import {Camera} from "@ionic-native/camera";
import { File  } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import {Transfer} from "@ionic-native/transfer";
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import {WebsocketEntity} from "../providers/websocketEntity";
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
import {ViewAccountPage} from "../pages/view-account/view-account";

// import {AngularInview} from 'angular-inview';

@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    HomePage,
    // MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    MyclassListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    EntryPage,
    LessonPage,
    VacationEducationPage,
    SpecialEnglishPage,
    OnlineCoursesPage,
    ParentsCoursesPage,
    StudentCoursesPage,
    CoursePage,
    SettingsPage,
    ViewAccountPage
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp),
		IonicStorageModule.forRoot(),
    EmojiPickerModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    HomePage,
    // MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    MyclassListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    EntryPage,
    LessonPage,
    VacationEducationPage,
    SpecialEnglishPage,
    OnlineCoursesPage,
    ParentsCoursesPage,
    StudentCoursesPage,
    CoursePage,
    SettingsPage,
    ViewAccountPage
  ],
  providers: [
    ConferenceData,
    UserData,
    InAppBrowser,
    SplashScreen,
    SMS,
    httpEntity,
    Camera,
    File,
    FilePath,
    Transfer,
    MediaPlugin,
    WebsocketEntity,
    // Lessons
    // AngularInview
  ]

})
export class AppModule { }
