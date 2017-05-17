"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var LessonPage = (function () {
    function LessonPage(actionSheetCtrl, navCtrl, navParams, confData, config, inAppBrowser, userData) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.confData = confData;
        this.config = config;
        this.inAppBrowser = inAppBrowser;
        this.userData = userData;
        this.speakers = [];
        console.log("Passed params", navParams.data);
    }
    LessonPage = __decorate([
        core_1.Component({
            selector: 'page-cards',
            templateUrl: 'cards.html'
        })
    ], LessonPage);
    return LessonPage;
}());
exports.LessonPage = LessonPage;
