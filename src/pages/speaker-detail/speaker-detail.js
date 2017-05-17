"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var session_detail_1 = require('../session-detail/session-detail');
var SpeakerDetailPage = (function () {
    function SpeakerDetailPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.speaker = this.navParams.data;
    }
    SpeakerDetailPage.prototype.goToSessionDetail = function (session) {
        this.navCtrl.push(session_detail_1.SessionDetailPage, session);
    };
    SpeakerDetailPage = __decorate([
        core_1.Component({
            selector: 'page-speaker-detail',
            templateUrl: 'speaker-detail.html'
        })
    ], SpeakerDetailPage);
    return SpeakerDetailPage;
}());
exports.SpeakerDetailPage = SpeakerDetailPage;
