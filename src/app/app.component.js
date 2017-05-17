"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var about_1 = require('../pages/about/about');
var account_1 = require('../pages/account/account');
var login_1 = require('../pages/login/login');
// import { MapPage } from '../pages/map/map';
// import { SignupPage } from '../pages/signup/signup';
var tabs_1 = require('../pages/tabs/tabs');
var tutorial_1 = require('../pages/tutorial/tutorial');
// import { SchedulePage } from '../pages/schedule/schedule';
var myclass_list_1 = require('../pages/myclass-list/myclass-list');
var support_1 = require('../pages/support/support');
var home_1 = require('../pages/home/home');
var entry_1 = require('../pages/entry/entry');
var ConferenceApp = (function () {
    function ConferenceApp(events, userData, menu, platform, 
        // public confData: ConferenceData,
        storage, 
        // page: PageInterface,
        splashScreen) {
        var _this = this;
        this.events = events;
        this.userData = userData;
        this.menu = menu;
        this.platform = platform;
        this.storage = storage;
        this.splashScreen = splashScreen;
        // List of pages that can be navigated to from the left menu
        // the left menu only works after login
        // the login page disables the left menu
        this.appPages = [
            // { title: 'Schedule', component: TabsPage, tabComponent: SchedulePage, icon: 'calendar' },
            { title: 'Home', component: tabs_1.TabsPage, tabComponent: home_1.HomePage, index: 0, icon: 'map' },
            { title: 'My classes', component: tabs_1.TabsPage, tabComponent: myclass_list_1.MyclassListPage, index: 1, icon: 'contacts' },
            { title: 'About', component: tabs_1.TabsPage, tabComponent: about_1.AboutPage, index: 2, icon: 'information-circle' },
        ];
        this.loggedInPages = [
            { title: 'Account', component: account_1.AccountPage, icon: 'person' },
            { title: 'Support', component: support_1.SupportPage, icon: 'help' },
            { title: 'Logout', component: tabs_1.TabsPage, icon: 'log-out', logsOut: true }
        ];
        this.loggedOutPages = [
            { title: 'Login', component: login_1.LoginPage, icon: 'log-in' },
            { title: 'Support', component: support_1.SupportPage, icon: 'help' },
            { title: 'Signup', component: entry_1.EntryPage, icon: 'person-add' }
        ];
        // Check if the user has already seen the tutorial
        this.storage.get('hasSeenTutorial')
            .then(function (hasSeenTutorial) {
            if (hasSeenTutorial) {
                _this.storage.get('hasIdentified')
                    .then(function (hasIdentified) {
                    if (hasIdentified) {
                        console.log("hasIdentified");
                        _this.rootPage = (tabs_1.TabsPage);
                    }
                    else {
                        _this.rootPage = (entry_1.EntryPage);
                    }
                });
            }
            else {
                _this.rootPage = tutorial_1.TutorialPage;
            }
            _this.platformReady();
        });
        // load the conference data
        // confData.load();
        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then(function (hasLoggedIn) {
            _this.enableMenu(hasLoggedIn === true);
        });
        this.listenToLoginEvents();
    }
    ConferenceApp.prototype.openPage = function (page) {
        var _this = this;
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index }).catch(function () {
                console.log("Didn't set nav root");
            });
        }
        else {
            this.nav.setRoot(page.component).catch(function () {
                console.log("Didn't set nav root");
            });
        }
        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            setTimeout(function () {
                _this.userData.logout();
            }, 1000);
        }
    };
    ConferenceApp.prototype.openTutorial = function () {
        this.nav.setRoot(tutorial_1.TutorialPage);
    };
    ConferenceApp.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.enableMenu(true);
        });
        this.events.subscribe('user:signup', function () {
            _this.enableMenu(true);
        });
        this.events.subscribe('user:logout', function () {
            _this.enableMenu(false);
        });
    };
    ConferenceApp.prototype.enableMenu = function (loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    };
    ConferenceApp.prototype.platformReady = function () {
        var _this = this;
        // Call any initial plugins when ready
        this.platform.ready().then(function () {
            _this.splashScreen.hide();
        });
    };
    ConferenceApp.prototype.isActive = function (page) {
        var childNav = this.nav.getActiveChildNav();
        // Tabs are a special case because they have their own navigation
        if (childNav) {
            if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
                return 'primary';
            }
            return;
        }
        if (this.nav.getActive() && this.nav.getActive().component === page.component) {
            return 'primary';
        }
        return;
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav)
    ], ConferenceApp.prototype, "nav", void 0);
    ConferenceApp = __decorate([
        core_1.Component({
            templateUrl: 'app.template.html'
        })
    ], ConferenceApp);
    return ConferenceApp;
}());
exports.ConferenceApp = ConferenceApp;
