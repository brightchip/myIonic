"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var about_1 = require('../about/about');
var home_1 = require("../home/home");
var online_courses_1 = require("../online-courses/online-courses");
var vacation_education_1 = require("../vacation-education/vacation-education");
var special_english_1 = require("../special-english/special-english");
var TabsPage = (function () {
    // set some user information on cardParams
    function TabsPage(navParams, userData) {
        this.userData = userData;
        // set the root pages for each tab
        this.tab1Root = home_1.HomePage;
        // tab1Root: any = SchedulePage;
        this.tab2Root = special_english_1.SpecialEnglishPage;
        this.tab3Root = online_courses_1.OnlineCoursesPage;
        this.tab4Root = vacation_education_1.VacationEducationPage;
        this.tab5Root = about_1.AboutPage;
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'tabs.html'
        })
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
