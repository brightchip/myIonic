"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
// import {Lesson} from "../../providers/lesson";
var CoursePage = (function () {
    function CoursePage(navCtrl, navParams, confData, config, inAppBrowser) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.confData = confData;
        this.config = config;
        this.inAppBrowser = inAppBrowser;
        this.myLesson = { lessonName: "lesson1",
            video: "assets/video/sample.mp4",
            comments: "comments",
            likes: 3,
            homework: "homework",
            vocabularyWork: "vocabulary work" };
        this.myLessonList = [this.myLesson, this.myLesson];
        this.title = this.navParams.get('title');
        console.log("Passed params", navParams.data);
        // this.myLesson = new Lesson("lesson1","assets/video/sample.mp4","comments",3,"homework","vocabulary work");
        // this.myLesson = new Lesson();
        // this.myLesson.video = "assets/video/sample.mp4";
        // this.myLesson.comments = "comments";
        // this.myLesson.likes = 3;
        // this.myLesson.homeWork = "homework";
        // this.myLesson.vocabularyWork = "vocabulary work";
        this.myLessonList.push(this.myLesson);
        this.myLessonList.push(this.myLesson);
    }
    CoursePage.prototype.gotoLesson = function (lesson) {
        this.navCtrl.push(CoursePage, { lesson: lesson });
    };
    CoursePage = __decorate([
        core_1.Component({
            selector: 'page-course',
            templateUrl: 'course.html'
        })
    ], CoursePage);
    return CoursePage;
}());
exports.CoursePage = CoursePage;
