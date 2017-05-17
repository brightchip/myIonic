"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var course_1 = require("../course/course");
var OnlineCoursesPage = (function () {
    function OnlineCoursesPage(actionSheetCtrl, navCtrl, navParams, confData, config, inAppBrowser, userData) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.confData = confData;
        this.config = config;
        this.inAppBrowser = inAppBrowser;
        this.userData = userData;
        this.speakers = [];
        this.studentCourses = [
            { book_id: 1, title: "动感音标", courseTimeSpan: 9, content: "this is 动感音标", logo: "assets/img/logos/se.png", videoIntroduction: "assets/video/sample.mp4" },
            { book_id: 2, title: "酷玩单词", courseTimeSpan: 9, content: "this is 酷玩单词", logo: "assets/img/th.jpg", videoIntroduction: "assets/video/sample.mp4" },
            { book_id: 2, title: "魅力语法", courseTimeSpan: 9, content: "this is 魅力语法", logo: "assets/img/nonnonbiyori.jpg", videoIntroduction: "assets/video/sample1.mp4" },
            { book_id: 2, title: "嘻哈语法", courseTimeSpan: 9, content: "this is 嘻哈语法", logo: "assets/img/nonobiyori.jpg", videoIntroduction: "assets/video/sample2.mp4" }];
        console.log("Passed params", navParams.data);
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
    OnlineCoursesPage.prototype.gotoCourse = function (promo) {
        console.log("gotoCourse", promo);
        this.navCtrl.push(course_1.CoursePage, { title: promo.title });
    };
    __decorate([
        core_1.ViewChild('tab')
    ], OnlineCoursesPage.prototype, "myTab", void 0);
    OnlineCoursesPage = __decorate([
        core_1.Component({
            selector: 'page-online-courses',
            templateUrl: 'online-courses.html'
        })
    ], OnlineCoursesPage);
    return OnlineCoursesPage;
}());
exports.OnlineCoursesPage = OnlineCoursesPage;
