"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var VacationEducationPage = (function () {
    function VacationEducationPage(actionSheetCtrl, navCtrl, navParams, confData, config, inAppBrowser, userData) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.confData = confData;
        this.config = config;
        this.inAppBrowser = inAppBrowser;
        this.userData = userData;
        this.speakers = [];
        this.MyEducationVacation = {
            img: ["assets/img/th.jpg",
                "assets/img/nonnonbiyori.jpg",
                "assets/img/nonobiyori.jpg"],
            introVideo: "assets/video/kmb.mp4",
            content: "Wellcome to Vacationing Education! have  nice study days" };
        this.VacaClasses = [{ id: 0, title: "学前班", img: "assets/img/school.png", subtitle: "" },
            { id: 1, title: "中期班", img: "assets/img/school.png", subtitle: "（讲不听，打死！）" },
            { id: 2, title: "国际版", img: "assets/img//school.png", subtitle: "" }];
        console.log("Passed params", navParams.data);
    }
    VacationEducationPage.prototype.slideChanged = function (slider) {
        console.log("VacationEducationPage::slideChanged" + slider.loop);
        slider.startAutoplay();
    };
    VacationEducationPage.prototype.gotoClasses = function (id) {
        console.log("VacationEducationPage::gotoClasses" + id);
    };
    VacationEducationPage = __decorate([
        core_1.Component({
            selector: 'page-veducation',
            templateUrl: 'vacation-education.html'
        })
    ], VacationEducationPage);
    return VacationEducationPage;
}());
exports.VacationEducationPage = VacationEducationPage;
