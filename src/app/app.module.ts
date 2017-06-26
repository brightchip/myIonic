import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { ConferenceApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';

import { SignupPage } from '../pages/signup/signup';


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
import {Tools} from "../providers/tools";
import {Auth} from "../providers/auth";
import {ChattingPage} from "../pages/chatting/chatting";
import {ChatData} from "../providers/chat-data";
import {DBHelper} from "../providers/dbhelper";
import {ChatListPage} from "../pages/chat-list/chat-list";
import {MapPage} from "../pages/map/map";
import {NativeService} from "../providers/mapUtil";
import {StatusBar} from '@ionic-native/status-bar';
import {Network} from '@ionic-native/network';
import {AppMinimize} from "@ionic-native/app-minimize";
import {AppVersion} from '@ionic-native/app-version';
import {Toast} from '@ionic-native/toast';
import {ImagePicker} from '@ionic-native/image-picker';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { Geolocation } from '@ionic-native/geolocation';
import { VideoDubbingPage} from "../pages/video-dubbing/video-dubbing";
import {ProgressBarComponent} from "../components/progress-bar/progress-bar";
import {VocabularyRecordingPage} from "../pages/vocabulary-recording/vocabulary-recording";
import {VocabularySelectingPage} from "../pages/vocabulary-selecting/vocabulary-selecting";
// import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
// import {AngularInview} from 'angular-inview';

@NgModule({
  declarations: [

    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    HomePage,
    MapPage,
    PopoverPage,

    SignupPage,

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
    ViewAccountPage,
    ChattingPage,
    ChatListPage,
    VideoDubbingPage,
    ProgressBarComponent,
    VocabularyRecordingPage,
    VocabularySelectingPage
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
    MapPage,
    PopoverPage,

    SignupPage,

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
    ViewAccountPage,
    ChattingPage,
    ChatListPage,
    VideoDubbingPage,
    VocabularyRecordingPage,
    VocabularySelectingPage
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
    Tools,
    Auth,
    ChatData,
    DBHelper,
    StatusBar,
    NativeService,
    AppVersion,
    Network,
    AppMinimize,
    Toast,
    ImagePicker,
    ScreenOrientation,
    Geolocation,

    // Lessons
    // AngularInview
  ]

})
export class AppModule { }
