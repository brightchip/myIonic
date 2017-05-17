"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tabs_1 = require('../tabs/tabs');
var SignupPage = (function () {
    function SignupPage(navCtrl, navParams, userData, sms, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userData = userData;
        this.sms = sms;
        this.storage = storage;
        this.signup = {};
        this.submitted = false;
        this.smsBody = 1234;
        this.userType = this.navParams.get('userType');
        console.log("SignupPage::userType", this.userType);
    }
    SignupPage.prototype.sendSMS = function () {
        // Send a text message using default options
        this.sms.send('13318264247', 'Hello world!');
    };
    SignupPage.prototype.checkCaptcha = function () {
        console.log("checkCaptcha");
        if (this.smsBody == this.signup.captcha) {
            this.signup.captchaMismatch = false;
            return true;
        }
        this.signup.captchaMismatch = false;
        return false;
    };
    SignupPage.prototype.onSignup = function (form) {
        this.submitted = true;
        if (form.valid && this.signup.password === this.signup.repassword && this.checkCaptcha()) {
            this.userData.signup(this.signup.username);
            this.storage.set('hasIdentified', 'true');
            this.navCtrl.push(tabs_1.TabsPage);
        }
    };
    SignupPage = __decorate([
        core_1.Component({
            selector: 'page-user',
            templateUrl: 'signup.html'
        })
    ], SignupPage);
    return SignupPage;
}());
exports.SignupPage = SignupPage;
