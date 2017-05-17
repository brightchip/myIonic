"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Enums = require("../../providers/globals");
var HomePage = (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
        this.MyHomeData = Enums.HomeData;
        this.MyLogos = Enums.Logos;
        this.MyIU = Enums.iuInfo;
        this.MyRecommedCourses = [
            { title: "course1", course_content: "This is course1", course_img: "assets/img/logos/se.png", likes: 4, comments: 1 },
            { title: "course2", course_content: "This is course2", course_img: "assets/img/logos/se.png", likes: 4, comments: 2 },
            { title: "course3", course_content: "This is course3", course_img: "assets/img/logos/se.png", likes: 7, comments: 3 },
            { title: "course4", course_content: "This is course4", course_img: "assets/img/logos/se.png", likes: 4, comments: 4 },
        ];
        // this.content.addCssClass("scroll");,private app: App
        // startAutoplay();
    }
    HomePage.prototype.slideChanged = function (slider) {
        console.log("HomePage::slideChanged" + slider.loop);
        slider.startAutoplay();
    };
    HomePage.prototype.gotoCardsPage = function (page_id) {
        console.log("HomePage::gotoCardsPage", page_id);
    };
    HomePage.prototype.goinfoPage = function (page_id) {
        console.log("HomePage::goinfoPage", page_id);
    };
    HomePage.prototype.showMore = function () {
    };
    HomePage.prototype.thumbUp = function (selectedCourse) {
        console.log("HomePage::thumbUp");
        selectedCourse.likes++;
    };
    HomePage.prototype.showComments = function (selectedCourse) {
        // console.log("HomePage::showComments",selectedCourse.course_content);
    };
    HomePage.prototype.gotoCourse = function (selectedCourse) {
        console.log("HomePage::gotoCourse", selectedCourse.course_content);
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.slides.update();
    };
    __decorate([
        core_1.ViewChild('slides')
    ], HomePage.prototype, "slides", void 0);
    HomePage = __decorate([
        core_1.Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
