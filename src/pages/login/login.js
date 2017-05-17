"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var signup_1 = require('../signup/signup');
var tabs_1 = require('../tabs/tabs');
var LoginPage = (function () {
    function LoginPage(navCtrl, userData, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.userData = userData;
        this.storage = storage;
        this.login = {};
        this.submitted = false;
        this.storage.get('savePassword').then(function (value) {
            if (value) {
                _this.login.savePassword = value;
                _this.autoLogin();
            }
        });
    }
    LoginPage.prototype.onLogin = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.userData.login(this.login.username);
            this.storage.set('hasIdentified', 'true');
            this.storage.set('savePassword', this.login.savePassword);
            // this.storage.set('username', this.login.savePassword);  //set in userdata page
            this.navCtrl.push(tabs_1.TabsPage);
        }
    };
    LoginPage.prototype.autoLogin = function () {
        var _this = this;
        //check whether save-password  had been checked
        return this.storage.get('username').then(function (value) {
            if (value) {
                _this.userData.login(value);
            }
        });
    };
    LoginPage.prototype.onSignup = function () {
        this.navCtrl.push(signup_1.SignupPage);
    };
    LoginPage = __decorate([
        core_1.Component({
            selector: 'page-user',
            templateUrl: 'login.html'
        })
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
