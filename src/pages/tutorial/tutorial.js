"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tabs_1 = require('../tabs/tabs');
var entry_1 = require("../entry/entry");
var TutorialPage = (function () {
    function TutorialPage(navCtrl, menu, storage) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.storage = storage;
        this.showSkip = true;
    }
    TutorialPage.prototype.startApp = function () {
        var _this = this;
        this.storage.get('hasIdentified')
            .then(function (hasIdentified) {
            if (hasIdentified) {
                _this.navCtrl.push(tabs_1.TabsPage).then(function () {
                });
            }
            else {
                _this.navCtrl.push(entry_1.EntryPage).then(function () {
                });
            }
        });
        this.storage.set('hasSeenTutorial', 'true');
    };
    TutorialPage.prototype.onSlideChangeStart = function (slider) {
        this.showSkip = !slider.isEnd();
    };
    TutorialPage.prototype.ionViewWillEnter = function () {
        this.slides.update();
    };
    TutorialPage.prototype.ionViewDidEnter = function () {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    };
    TutorialPage.prototype.ionViewDidLeave = function () {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    };
    __decorate([
        core_1.ViewChild('slides')
    ], TutorialPage.prototype, "slides", void 0);
    TutorialPage = __decorate([
        core_1.Component({
            selector: 'page-tutorial',
            templateUrl: 'tutorial.html'
        })
    ], TutorialPage);
    return TutorialPage;
}());
exports.TutorialPage = TutorialPage;
