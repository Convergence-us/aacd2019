webpackJsonp([3],{

/***/ 954:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileSocialMediaEntryPageModule", function() { return ProfileSocialMediaEntryPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profilesocialmediaentry__ = __webpack_require__(973);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let ProfileSocialMediaEntryPageModule = class ProfileSocialMediaEntryPageModule {
};
ProfileSocialMediaEntryPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__profilesocialmediaentry__["a" /* ProfileSocialMediaEntryPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__profilesocialmediaentry__["a" /* ProfileSocialMediaEntryPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__profilesocialmediaentry__["a" /* ProfileSocialMediaEntryPage */]
        ]
    })
], ProfileSocialMediaEntryPageModule);

//# sourceMappingURL=profilesocialmediaentry.module.js.map

/***/ }),

/***/ 973:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileSocialMediaEntryPage; });
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






let ProfileSocialMediaEntryPage = class ProfileSocialMediaEntryPage {
    constructor(navParams, storage, cd, databaseprovider, view, localstorage) {
        this.navParams = navParams;
        this.storage = storage;
        this.cd = cd;
        this.databaseprovider = databaseprovider;
        this.view = view;
        this.localstorage = localstorage;
    }
    clearInput() {
        this.SocialMediaURLEntry = "";
        this.cd.markForCheck();
    }
    ngOnInit() {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var SocialMediaType = this.localstorage.getLocalValue('SocialMediaType');
        console.log('SocialMediaType: ' + SocialMediaType);
        switch (SocialMediaType) {
            case "statusTwitter":
                this.typeOfSocialMedia = "Twitter";
                this.typeOfSampleSocialMedia = "https://twitter.com/johnsmith";
                break;
            case "statusLinkedIn":
                this.typeOfSocialMedia = "LinkedIn";
                this.typeOfSampleSocialMedia = "https://www.linkedin.com/inJohnSmith";
                break;
            case "statusFacebook":
                this.typeOfSocialMedia = "Facebook";
                this.typeOfSampleSocialMedia = "https://www.facebook.com/JohnSmith";
                break;
            case "statusInstagram":
                this.typeOfSocialMedia = "Instagram";
                this.typeOfSampleSocialMedia = "https://instagram.com/johnsmith";
                break;
            case "statusPinterest":
                this.typeOfSocialMedia = "Pinterest";
                this.typeOfSampleSocialMedia = "https://www.pinterest.com/johnsmith";
                break;
        }
        var flags = 'pg|' + SocialMediaType;
        this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
            console.log("getDatabaseStats: " + JSON.stringify(data));
            if (data['length'] > 0) {
                this.SocialMediaURLEntry = data[0].smURL;
                this.cd.markForCheck();
            }
        }).catch(function () {
            console.log("ProfileSocialMediaEntryPage Promise Rejected");
        });
    }
    closeModal(UserAction) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var SocialMediaType = this.localstorage.getLocalValue('SocialMediaType');
        var SocialMediaURLEntry = this.SocialMediaURLEntry;
        var ReturnValue = UserAction + "|" + SocialMediaType + "|" + SocialMediaURLEntry;
        if (UserAction == "Save") {
            var flags = 'pu|' + SocialMediaType + '|' + SocialMediaURLEntry;
            this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
                console.log("getDatabaseStats, closeModal: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    ReturnValue = ReturnValue + "|" + data[0].SocialMediaSetting;
                    console.log("getDatabaseStats, closeModal, Return status: " + data[0].Status);
                    if (data[0].Status == 'Saved') {
                        this.view.dismiss(ReturnValue);
                    }
                    else {
                        // Show alert about failed save
                    }
                }
            }).catch(function (e) {
                console.log("Profile Social Media Entry Update Error: " + e);
            });
        }
        if (UserAction == "Cancel") {
            this.view.dismiss(ReturnValue);
        }
    }
};
ProfileSocialMediaEntryPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-profilesocialmediaentry',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/profilesocialmediaentry/profilesocialmediaentry.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<ion-title>Social Media Link Entry</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n		<ion-label>Enter or update the link to your {{typeOfSocialMedia}} social media profile.  To erase the link, choose Clear then Save:</ion-label>\n		<!--<ion-textarea (input)=\'SocialMediaURLEntry = $event.target.value\' name="SocialMediaURLEntry" [value]="SocialMediaURLEntry" placeholder="i.e. {{typeOfSampleSocialMedia}}"></ion-textarea>-->\n		<ion-item>\n			<ion-input type="text" placeholder="i.e. {{typeOfSampleSocialMedia}}" (input)=\'SocialMediaURLEntry = $event.target.value\' name="SocialMediaURLEntry" [value]="SocialMediaURLEntry" id="SocialMediaURLEntry"></ion-input>\n		</ion-item>\n		\n		<ion-grid>\n			<ion-row>\n				<ion-col col-4 >\n					<button ion-button block color="danger" (click)="closeModal(\'Save\')">\n						Save\n					</button>\n				</ion-col>\n				<ion-col col-4 >\n					<button ion-button block color="danger" (click)="clearInput()">\n						Clear\n					</button>\n				</ion-col>\n				<ion-col col-4 >\n					<button ion-button block color="danger" (click)="closeModal(\'Cancel\')">\n						Cancel\n					</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/profilesocialmediaentry/profilesocialmediaentry.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["A" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ProfileSocialMediaEntryPage);

//# sourceMappingURL=profilesocialmediaentry.js.map

/***/ })

});
//# sourceMappingURL=3.js.map