"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var storage_1 = require('@ionic/storage');
var app_component_1 = require('./app.component');
var about_1 = require('../pages/about/about');
var about_popover_1 = require('../pages/about-popover/about-popover');
var account_1 = require('../pages/account/account');
var login_1 = require('../pages/login/login');
var schedule_1 = require('../pages/schedule/schedule');
var schedule_filter_1 = require('../pages/schedule-filter/schedule-filter');
var session_detail_1 = require('../pages/session-detail/session-detail');
var signup_1 = require('../pages/signup/signup');
var speaker_detail_1 = require('../pages/speaker-detail/speaker-detail');
var myclass_list_1 = require('../pages/myclass-list/myclass-list');
var tabs_1 = require('../pages/tabs/tabs');
var tutorial_1 = require('../pages/tutorial/tutorial');
var support_1 = require('../pages/support/support');
var home_1 = require('../pages/home/home');
var conference_data_1 = require('../providers/conference-data');
var user_data_1 = require('../providers/user-data');
var in_app_browser_1 = require('@ionic-native/in-app-browser');
var splash_screen_1 = require('@ionic-native/splash-screen');
var entry_1 = require("../pages/entry/entry");
var sms_1 = require('@ionic-native/sms');
var vacation_education_1 = require("../pages/vacation-education/vacation-education");
var special_english_1 = require("../pages/special-english/special-english");
var online_courses_1 = require("../pages/online-courses/online-courses");
var student_courses_1 = require("../pages/student-courses/student-courses");
var parents_courses_1 = require("../pages/parents-courses/parents-courses");
var course_1 = require("../pages/course/course");
var lesson_1 = require("../pages/lesson/lesson");
// import {Lesson} from "../providers/lesson";
// import {AngularInview} from 'angular-inview';
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.ConferenceApp,
                about_1.AboutPage,
                account_1.AccountPage,
                login_1.LoginPage,
                home_1.HomePage,
                // MapPage,
                about_popover_1.PopoverPage,
                schedule_1.SchedulePage,
                schedule_filter_1.ScheduleFilterPage,
                session_detail_1.SessionDetailPage,
                signup_1.SignupPage,
                speaker_detail_1.SpeakerDetailPage,
                myclass_list_1.MyclassListPage,
                tabs_1.TabsPage,
                tutorial_1.TutorialPage,
                support_1.SupportPage,
                entry_1.EntryPage,
                lesson_1.LessonPage,
                vacation_education_1.VacationEducationPage,
                special_english_1.SpecialEnglishPage,
                online_courses_1.OnlineCoursesPage,
                parents_courses_1.ParentsCoursesPage,
                student_courses_1.StudentCoursesPage,
                course_1.CoursePage
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(app_component_1.ConferenceApp),
                storage_1.IonicStorageModule.forRoot(),
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                app_component_1.ConferenceApp,
                about_1.AboutPage,
                account_1.AccountPage,
                login_1.LoginPage,
                home_1.HomePage,
                // MapPage,
                about_popover_1.PopoverPage,
                schedule_1.SchedulePage,
                schedule_filter_1.ScheduleFilterPage,
                session_detail_1.SessionDetailPage,
                signup_1.SignupPage,
                speaker_detail_1.SpeakerDetailPage,
                myclass_list_1.MyclassListPage,
                tabs_1.TabsPage,
                tutorial_1.TutorialPage,
                support_1.SupportPage,
                entry_1.EntryPage,
                lesson_1.LessonPage,
                vacation_education_1.VacationEducationPage,
                special_english_1.SpecialEnglishPage,
                online_courses_1.OnlineCoursesPage,
                parents_courses_1.ParentsCoursesPage,
                student_courses_1.StudentCoursesPage,
                course_1.CoursePage
            ],
            providers: [
                conference_data_1.ConferenceData,
                user_data_1.UserData,
                in_app_browser_1.InAppBrowser,
                splash_screen_1.SplashScreen,
                sms_1.SMS,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
