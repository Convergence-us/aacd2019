webpackJsonp([0],{

/***/ 957:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeakerDetailsPageModule", function() { return SpeakerDetailsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__speakerdetails__ = __webpack_require__(975);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let SpeakerDetailsPageModule = class SpeakerDetailsPageModule {
};
SpeakerDetailsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__speakerdetails__["a" /* SpeakerDetailsPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__speakerdetails__["a" /* SpeakerDetailsPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__speakerdetails__["a" /* SpeakerDetailsPage */]]
    })
], SpeakerDetailsPageModule);

//# sourceMappingURL=speakerdetails.module.js.map

/***/ }),

/***/ 975:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SpeakerDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__educationdetails_educationdetails__ = __webpack_require__(84);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
// Components, functions, plugins





// Pages

let SpeakerDetailsPage = class SpeakerDetailsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.SessionListing = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SpeakersPage');
    }
    EventDetails(EventID) {
        if (EventID != 0) {
            // Navigate to Education Details page
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.SessionListing = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags = "dt|Alpha|" + this.navParams.get('SpeakerID');
        var DisplayName = "";
        var BioDisplay = "";
        // Get the data
        this.databaseprovider.getSpeakerData(flags, "0").then(data => {
            console.log("getSpeakerDetails: " + JSON.stringify(data));
            if (data['length'] > 0) {
                DisplayName = "";
                // Concatenate fields to build displayable name
                //if (data[0].Prefix != "") {
                //    DisplayName = DisplayName + data[0].Prefix + " ";
                //}
                DisplayName = DisplayName + data[0].FirstName;
                //if (data[0].MiddleInitial != "") {
                //    DisplayName = DisplayName + " " + data[0].MiddleInitial;
                //}
                DisplayName = DisplayName + " " + data[0].LastName;
                //if (data[0].Suffix != "") {
                //    DisplayName = DisplayName + " " + data[0].Suffix;
                //}
                //if (data[0].imis_designation != "" && data[0].imis_designation != null) {
                //    DisplayName = DisplayName + ", " + data[0].imis_designation;
                //}
                if (data[0].Credentials != "" && data[0].Credentials != null) {
                    this.visualAffiliation = data[0].Credentials;
                }
                // Thumbnail
                var imageURL = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Speakers/" + data[0].imageFilename;
                //imageURL = imageURL.substr(0, imageURL.length - 3) + 'png';
                this.visualImageURL = imageURL;
                console.log("ImageURL: " + imageURL);
                this.visualDisplayName = DisplayName;
                //$scope.visualAffiliation = res.rows.item(0).Affiliation;
                // Biography
                if ((data[0].Bio == "") || (data[0].Bio == "&nbsp;") || (data[0].Bio == "TBD")) {
                    this.spkrDetails = "No biography provided";
                }
                else {
                    BioDisplay = data[0].Bio;
                    BioDisplay = BioDisplay.replace(/&nbsp;/g, ' ');
                    BioDisplay = BioDisplay.replace(/\r/g, '');
                    BioDisplay = BioDisplay.replace(/\n/g, '');
                    BioDisplay = BioDisplay.replace(/\t/g, '');
                    BioDisplay = BioDisplay.replace(/<div>/g, '');
                    BioDisplay = BioDisplay.replace(/<\/div>/g, '');
                    this.spkrDetails = BioDisplay;
                }
                // Get session records
                var coursescat = data[0].Courses;
                var courses = coursescat.split("|");
                var text = "('";
                for (var i = 0; i < courses.length; i++) {
                    text += courses[i] + "','";
                }
                var QueryParam = text.substring(0, text.length - 2);
                QueryParam = QueryParam + ")";
                console.log("Course listing parameters: " + QueryParam);
                flags = "cl|Alpha|" + this.navParams.get('SpeakerID') + "|" + QueryParam;
                var SQLDate;
                var DisplayDateTime;
                var dbEventDateTime;
                // Get the list of courses relevant to this speaker
                this.databaseprovider.getSpeakerData(flags, "0").then(data2 => {
                    console.log("getSpeakerData: " + JSON.stringify(data));
                    if (data2['length'] > 0) {
                        for (var i = 0; i < data2['length']; i++) {
                            console.log(data2[i].session_id);
                            dbEventDateTime = data2[i].session_start_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                            // Display end time
                            dbEventDateTime = data2[i].session_end_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                            this.SessionListing.push({
                                DisplayEventName: data2[i].session_title,
                                DisplayEventTimeDateLocation: DisplayDateTime + " in " + data2[i].RoomName,
                                EventID: data2[i].session_id
                            });
                        }
                    }
                    else {
                        // No records to show
                        this.SessionListing.push({
                            DisplayEventName: "No records available",
                            DisplayEventTimeDateLocation: "",
                            EventID: "0"
                        });
                    }
                    this.cd.markForCheck();
                }).catch(function () {
                    console.log("Promise Rejected");
                });
            }
            else {
                // No data to show
                this.visualDisplayName = "Unable to retrieve record";
                this.visualAffiliation = "";
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
};
SpeakerDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-speakerdetails',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/speakerdetails/speakerdetails.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Speaker Details</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding="" style="padding-left:7px;padding-right:7px;">\n\n	<ion-grid>\n		<ion-row>\n			<ion-col col-4><img [src]="visualImageURL" onerror="this.src=\'assets/img/personIcon.png\'"\n				style="float:left; width:70%" src="assets/img/personIcon.png" alt="Image error">\n					</ion-col>\n	\n			<ion-col col-8 class="myLabelBold" style="padding-left:0">\n					<h1>{{visualDisplayName}}</h1>\n					<h3>{{visualAffiliation}}</h3>\n					</ion-col>\n		</ion-row>\n	</ion-grid>\n\n	<p class="myLabelBold myHeader">\n		Biography\n	</p>\n\n	<div [innerHTML]="spkrDetails" style="padding-left: 5px; padding-right: 5px;">\n		{{visualBiography}}\n	</div>\n\n	<p class="myLabelBold myHeader myMarginTopBottom">\n		Sessions\n	</p>\n\n	<ion-list id="speakersessions-list3" class=" ">\n		<ion-item class="item-icon-left item-icon-right" (click)="EventDetails(session.EventID)" *ngFor="let session of SessionListing" id="speakersessions-list-item19">\n			<ion-icon item-right name="arrow-dropright"></ion-icon>\n			<h2>{{session.DisplayEventName}}</h2>\n			<p>{{session.DisplayEventTimeDateLocation}}</p>\n		</ion-item>\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/speakerdetails/speakerdetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */]) === "function" ? _a : Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */]) === "function" ? _b : Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]) === "function" ? _c : Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */]) === "function" ? _d : Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" ? _e : Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */]) === "function" ? _f : Object])
], SpeakerDetailsPage);

//# sourceMappingURL=speakerdetails.js.map

/***/ })

});
//# sourceMappingURL=0.js.map