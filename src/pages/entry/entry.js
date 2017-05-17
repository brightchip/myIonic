"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var signup_1 = require("../signup/signup");
var Enums = require("../../providers/globals");
var EntryPage = (function () {
    function EntryPage(navCtrl, menu, storage) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.storage = storage;
        this.MyUserType = Enums.UserType;
    }
    EntryPage.prototype.ionViewDidEnter = function () {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    };
    EntryPage.prototype.ionViewDidLeave = function () {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    };
    EntryPage.prototype.onSignup = function (userType) {
        console.log("EntryPage::onSignup", userType);
        this.navCtrl.push(signup_1.SignupPage, { userType: userType });
    };
    EntryPage = __decorate([
        core_1.Component({
            selector: 'page-entry',
            templateUrl: 'entry.html'
        })
    ], EntryPage);
    return EntryPage;
}());
exports.EntryPage = EntryPage;
