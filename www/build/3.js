webpackJsonp([3],{

/***/ 962:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchByTopicPageModule", function() { return SearchByTopicPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__searchbytopic__ = __webpack_require__(982);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let SearchByTopicPageModule = class SearchByTopicPageModule {
};
SearchByTopicPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__searchbytopic__["a" /* SearchByTopicPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__searchbytopic__["a" /* SearchByTopicPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__searchbytopic__["a" /* SearchByTopicPage */]]
    })
], SearchByTopicPageModule);

//# sourceMappingURL=searchbytopic.module.js.map

/***/ }),

/***/ 982:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchByTopicPage; });
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






let SearchByTopicPage = class SearchByTopicPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.sessions = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad: SearchByTopicPage');
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: SearchByTopicPage');
        // Load / refresh data when coming to this page
        this.LoadData();
    }
    SearchTopics(selectedValue) {
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        console.log('Selected topic: ' + selectedValue);
        this.cd.markForCheck();
        var TopicSearchOption = selectedValue;
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
        var PrimarySpeakerName;
        var flags = '';
        this.sessions = [];
        this.TopicSearchChoice = TopicSearchOption;
        this.localstorage.setLocalValue('TopicSearch', TopicSearchOption);
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (TopicSearchOption === null || TopicSearchOption == 'Select a topic...') {
            this.TopicSearchChoice = "Select a topic...";
            console.log('TopicSearch: Select a topic...');
        }
        else {
            // Get records
            this.databaseprovider.getSearchData(TopicSearchOption, AttendeeID).then(data => {
                console.log('TopicSearch using: ' + TopicSearchOption);
                if (data['length'] > 0) {
                    console.log('Records returned');
                    // Process returned records to display
                    for (var i = 0; i < data['length']; i++) {
                        dbEventDateTime = data[i].session_start_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        // Display end time
                        dbEventDateTime = data[i].session_end_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                        this.sessions.push({
                            DisplayEventName: data[i].session_title,
                            DisplayEventTimeDateLocation: DisplayDateTime + " in " + data[i].RoomName,
                            SpeakerDisplayName: PrimarySpeakerName,
                            EventID: data[i].session_id
                        });
                    }
                }
                this.cd.markForCheck();
                //loading.dismiss();
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
    LoadData() {
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        this.cd.markForCheck();
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
        var PrimarySpeakerName;
        this.sessions = [];
        var TopicSearchOption = this.localstorage.getLocalValue('TopicSearch');
        this.TopicSearchChoice = TopicSearchOption;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        console.log('TopicSearch: ' + TopicSearchOption);
        if (TopicSearchOption === null || TopicSearchOption == 'Select a topic...') {
            this.TopicSearchChoice = "Select a topic...";
            console.log('TopicSearch: Select a topic...');
        }
        else {
            // Get records
            this.databaseprovider.getSearchData(TopicSearchOption, AttendeeID).then(data => {
                console.log('TopicSearch using: ' + TopicSearchOption);
                if (data['length'] > 0) {
                    console.log('Records returned');
                    // Process returned records to display
                    for (var i = 0; i < data['length']; i++) {
                        dbEventDateTime = data[i].session_start_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        // Display end time
                        dbEventDateTime = data[i].session_end_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                        this.sessions.push({
                            DisplayEventName: data[i].session_title,
                            DisplayEventTimeDateLocation: DisplayDateTime + " in " + data[i].RoomName,
                            SpeakerDisplayName: PrimarySpeakerName,
                            EventID: data[i].session_id
                        });
                    }
                }
                this.cd.markForCheck();
                //loading.dismiss();
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
    EventDetails(EventID) {
        if (EventID != 0) {
            // Navigate to Exhibitor Details page
            this.navCtrl.push('EducationDetailsPage', { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
};
SearchByTopicPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-searchbytopic',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/searchbytopic/searchbytopic.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Search by Topic</ion-title>\n	</ion-navbar>\n</ion-header>\n<ion-content>\n\n	<div class="myPaddingLR" style="padding-top:10px!important; padding-bottom:10px!important">\n		<h2>Topic Search</h2>\n		<h6>Find courses tagged by specific topics by choosing one from the dropdown below.</h6>\n	</div>\n\n\n\n	<ion-item>\n		<label class="item item-select" id="searchByTopic-select1"></label>\n		\n		<ion-select name="Topics" style="background:#710080; color:#fff; width:100%"[(ngModel)]="TopicSearchChoice" (ionChange)="SearchTopics($event)">\n\n			<ion-option value=\'Select a topic...\' selected>Select a topic...</ion-option>\n			<ion-option value=\'AACD Student Outreach\'>AACD Student Outreach</ion-option>\n			<ion-option value=\'Accreditation\'>Accreditation</ion-option>\n			<ion-option value=\'Appliances\'>Appliances</ion-option>\n			<ion-option value=\'Biofilm\'>Biofilm</ion-option>\n			<ion-option value=\'Bonding\'>Bonding</ion-option>\n			<ion-option value=\'Botox\'>Botox</ion-option>\n			<ion-option value=\'Communication\'>Communication</ion-option>\n			<ion-option value=\'Composite Bonding\'>Composite Bonding</ion-option>\n			<ion-option value=\'Composites\'>Composites</ion-option>\n			<ion-option value=\'Composite Resin\'>Composite Resin</ion-option>\n			<ion-option value=\'Direct Resin\'>Direct Resin</ion-option>\n			<ion-option value=\'Fellowship\'>Fellowship</ion-option>\n			<ion-option value=\'Implant\'>Implant</ion-option>\n			<ion-option value=\'Leadership\'>Leadership</ion-option>\n			<ion-option value=\'Marketing\'>Marketing</ion-option>\n			<ion-option value=\'Material Selection\'>Material Selection</ion-option>\n			<ion-option value=\'Non-Prep Veneers\'>Non-Prep Veneers</ion-option>\n			<ion-option value=\'Patient Care\'>Patient Care</ion-option>\n			<ion-option value=\'Patient Communication\'>Patient Communication</ion-option>\n			<ion-option value=\'Philanthropy\'>Philanthropy</ion-option>\n			<ion-option value=\'Photography\'>Photography</ion-option>\n			<ion-option value=\'Polishing\'>Polishing</ion-option>\n			<ion-option value=\'Porcelain Veneers\'>Porcelain Veneers</ion-option>\n			<ion-option value=\'Rapid Fire\'>Rapid Fire</ion-option>\n			<ion-option value=\'Shade Selection\'>Shade Selection</ion-option>\n			<ion-option value=\'TMJ\'>TMJ</ion-option>\n			<ion-option value=\'Tooth Movement\'>Tooth Movement</ion-option>\n			<ion-option value=\'Transitions\'>Transitions</ion-option>\n			<ion-option value=\'Treatment Planning\'>Treatment Planning</ion-option>\n			<ion-option value=\'UEF\'>UEF</ion-option>\n			<ion-option value=\'Veneers\'>Veneers</ion-option>\n\n		</ion-select>\n	</ion-item>\n\n	<ion-list class="myLabelBold" style="max-width:100%" id="topic-list3">\n		<ion-item (click)="EventDetails(session.EventID)" *ngFor="let session of sessions" id="topics-list-item19">\n			<ion-icon item-right name="arrow-dropright"></ion-icon>\n			<h2>{{session.DisplayEventName}}</h2>\n			<p>{{session.DisplayEventTimeDateLocation}}</p>\n			<p>{{session.SpeakerDisplayName}}</p>\n		</ion-item>\n	</ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/searchbytopic/searchbytopic.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], SearchByTopicPage);

//# sourceMappingURL=searchbytopic.js.map

/***/ })

});
//# sourceMappingURL=3.js.map