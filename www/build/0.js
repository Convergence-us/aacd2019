webpackJsonp([0],{

/***/ 947:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivityFeedLeaderboardPageModule", function() { return ActivityFeedLeaderboardPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__ = __webpack_require__(969);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_charts__ = __webpack_require__(541);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ng2_charts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_progress_bar_progress_bar__ = __webpack_require__(970);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





let ActivityFeedLeaderboardPageModule = class ActivityFeedLeaderboardPageModule {
};
ActivityFeedLeaderboardPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__["a" /* ActivityFeedLeaderboardPage */],
            __WEBPACK_IMPORTED_MODULE_4__components_progress_bar_progress_bar__["a" /* ProgressBarComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__["a" /* ActivityFeedLeaderboardPage */]),
            __WEBPACK_IMPORTED_MODULE_3_ng2_charts__["ChartsModule"]
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__activityfeedleaderboard__["a" /* ActivityFeedLeaderboardPage */]
        ]
    })
], ActivityFeedLeaderboardPageModule);

//# sourceMappingURL=activityfeedleaderboard.module.js.map

/***/ }),

/***/ 969:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityFeedLeaderboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Components, functions, plugins






let ActivityFeedLeaderboardPage = class ActivityFeedLeaderboardPage {
    constructor(navParams, storage, databaseprovider, cd, navCtrl, view, localstorage) {
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.navCtrl = navCtrl;
        this.view = view;
        this.localstorage = localstorage;
        this.LeaderboardListing = [];
    }
    ionViewDidEnter() {
        var flags = "lb|";
        this.LeaderboardListing = [];
        this.cd.markForCheck();
        this.databaseprovider.getDatabaseStats(flags, "0").then(data => {
            if (data['length'] > 0) {
                var AttendeeName = "";
                var visCompanyName = "";
                var MaxBarDisplay = data[0].PostingsComments;
                var BarDisplay = 0;
                for (var i = 0; i < data['length']; i++) {
                    AttendeeName = data[i].FirstName + " " + data[i].LastName;
                    // Use blank if no company name available
                    if (data[1].Company == null || data[i].Company == undefined) {
                        visCompanyName = "";
                    }
                    else {
                        visCompanyName = data[i].Company;
                    }
                    // Determine if avatar is available or to use the default
                    var imageAvatar = "";
                    if (data[i].avatarFilename != 'undefined' && data[i].avatarFilename != undefined && data[i].avatarFilename != '' && data[i].avatarFilename.length > 0) {
                        imageAvatar = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].avatarFilename;
                    }
                    else {
                        imageAvatar = "assets/img/personIcon.png";
                    }
                    // Determine percentage amount for bar length
                    if (parseInt(data[i].PostingsComments) == MaxBarDisplay) {
                        BarDisplay = 100;
                    }
                    else {
                        BarDisplay = (parseInt(data[i].PostingsComments) / MaxBarDisplay) * 100;
                    }
                    console.log('Attendee: ' + AttendeeName + ', Counter: ' + Counter + ', BarDisplay: ' + BarDisplay);
                    var Counter = parseInt(data[i].PostingsComments);
                    this.LeaderboardListing.push({
                        lbDisplayName: AttendeeName,
                        lbCompany: visCompanyName,
                        lbBarDisplay: BarDisplay,
                        lbCounter: Counter,
                        lbAvatar: imageAvatar
                    });
                }
                this.cd.markForCheck();
            }
        });
    }
    closeModal() {
        this.view.dismiss();
    }
};
ActivityFeedLeaderboardPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-activityfeedleaderboard',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/activityfeedleaderboard/activityfeedleaderboard.html"*/'<ion-header>\n		<ion-navbar color="primary">\n		  <ion-title>\n			Leaderboard Top 5\n		  </ion-title>\n		</ion-navbar>\n	  </ion-header>\n\n<ion-content>\n\n	<ion-list>\n		<ion-item *ngFor="let leaderboardAttendee of LeaderboardListing" id="leaderboard-list-item19">\n			<ion-avatar item-start>\n				<img src="{{leaderboardAttendee.lbAvatar}}" onerror="this.src=\'assets/img/personIcon.png\'">\n			</ion-avatar>\n			<h2>{{leaderboardAttendee.lbDisplayName}}</h2>\n			<p>{{leaderboardAttendee.lbCompany}}</p>\n			<progress-bar [progress]="leaderboardAttendee.lbBarDisplay"></progress-bar>\n			<button disabled ion-button clear item-end>{{leaderboardAttendee.lbCounter}} pts</button>\n		</ion-item>\n	  \n	</ion-list>\n\n	<ion-grid>\n		<ion-row>\n			<ion-col col-4 >\n			</ion-col>\n			<ion-col col-4 >\n				<button ion-button block color="secondary" (click)="closeModal()">\n					Close\n				</button>\n			</ion-col>\n			<ion-col col-4 >\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n</ion-content>		\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/activityfeedleaderboard/activityfeedleaderboard.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["A" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ActivityFeedLeaderboardPage);

//# sourceMappingURL=activityfeedleaderboard.js.map

/***/ }),

/***/ 970:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProgressBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let ProgressBarComponent = class ProgressBarComponent {
    constructor() {
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('progress'),
    __metadata("design:type", Object)
], ProgressBarComponent.prototype, "progress", void 0);
ProgressBarComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'progress-bar',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/components/progress-bar/progress-bar.html"*/'<!-- Generated template for the ProgressBarComponent component -->\n<div class="progress-outer">\n  <div class="progress-inner" [style.width]="progress + \'%\'">\n      <!--{{progress}}% -->\n      &nbsp; \n  </div>\n</div>'/*ion-inline-end:"/Users/petervroom/aacd19/src/components/progress-bar/progress-bar.html"*/
    }),
    __metadata("design:paramtypes", [])
], ProgressBarComponent);

//# sourceMappingURL=progress-bar.js.map

/***/ })

});
//# sourceMappingURL=0.js.map