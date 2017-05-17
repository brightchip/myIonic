"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var SpecialEnglishPage = (function () {
    function SpecialEnglishPage(actionSheetCtrl, navCtrl, navParams, confData, config, inAppBrowser, userData) {
        // console.log("Passed params", navParams.data);
        this.actionSheetCtrl = actionSheetCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.confData = confData;
        this.config = config;
        this.inAppBrowser = inAppBrowser;
        this.userData = userData;
        this.specialEnglishBooks = [{ book_id: 1, title: "book1", courseTimeSpan: 9, content: "this is book1", logo: "assets/img/logos/se.png", videoIntroduction: "assets/video/sample.mp4" },
            { book_id: 2, title: "book2", courseTimeSpan: 9, content: "this is book2", logo: "assets/img/th.jpg", videoIntroduction: "assets/video/sample.mp4" },
            { book_id: 2, title: "book3", courseTimeSpan: 9, content: "this is book3", logo: "assets/img/nonnonbiyori.jpg", videoIntroduction: "assets/video/sample1.mp4" },
            { book_id: 2, title: "book4", courseTimeSpan: 9, content: "this is book4", logo: "assets/img/nonobiyori.jpg", videoIntroduction: "assets/video/sample2.mp4" }];
    }
    SpecialEnglishPage.prototype.gotoOnlineCourse = function (_specialEnglishBooks) {
        console.log("gotoOnlineCourse");
    };
    SpecialEnglishPage.prototype.findLocation = function (_specialEnglishBooks) {
        console.log("findLocation");
    };
    SpecialEnglishPage.prototype.playVideo = function () {
        console.log("playVideo");
    };
    SpecialEnglishPage.prototype.lineInView = function (index, inview, inviewpart) {
        console.log("lineInView", index);
    };
    SpecialEnglishPage.prototype.ionViewDidLeave = function () {
        this.pauseVideo();
    };
    SpecialEnglishPage.prototype.videoPlayed = function (specialEnglishBooks) {
        // if( this.currentPlayingVideo != specialEnglishBooks.index && specialEnglishBooks.index){
        //   let videoPlayer = this.itroVideoPlayer[this.currentPlayingVideo].nativeElement;
        //   videoPlayer.pause();
        // }
        //
        // this.currentPlayingVideo = specialEnglishBooks.index;
        console.log("videoPlayed", specialEnglishBooks);
    };
    SpecialEnglishPage.prototype.pauseVideo = function () {
        // this.itroVideoPlayer.pause();
        // for(var i=0;i<this.itroVideoPlayer.length;i++){
        //   let videoPlayer = this.itroVideoPlayer[i].nativeElement;
        //   videoPlayer.pause();
        // }
        console.log("pauseVideo");
    };
    SpecialEnglishPage.prototype.toggleVideo = function (index) {
        // let videoPlayer = this.itroVideoPlayer[index].nativeElement;
        // videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
    };
    __decorate([
        core_1.ViewChild("itroVideoPlayer")
    ], SpecialEnglishPage.prototype, "itroVideoPlayer", void 0);
    SpecialEnglishPage = __decorate([
        core_1.Component({
            selector: 'page-senglish',
            templateUrl: 'special-english.html'
        })
    ], SpecialEnglishPage);
    return SpecialEnglishPage;
}());
exports.SpecialEnglishPage = SpecialEnglishPage;
