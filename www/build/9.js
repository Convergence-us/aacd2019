webpackJsonp([9],{

/***/ 964:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExhibitorDetailsPageModule", function() { return ExhibitorDetailsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__exhibitordetails__ = __webpack_require__(984);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let ExhibitorDetailsPageModule = class ExhibitorDetailsPageModule {
};
ExhibitorDetailsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__exhibitordetails__["a" /* ExhibitorDetailsPage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__exhibitordetails__["a" /* ExhibitorDetailsPage */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__exhibitordetails__["a" /* ExhibitorDetailsPage */]]
    })
], ExhibitorDetailsPageModule);

//# sourceMappingURL=exhibitordetails.module.js.map

/***/ }),

/***/ 984:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExhibitorDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_leaflet__);
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







let ExhibitorDetailsPage = class ExhibitorDetailsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        // Sopcial Media Icons
        this.visSocialMediaFacebookVisible = false;
        this.visSocialMediaTwitterVisible = false;
        this.visSocialMediaLinkedInVisible = false;
        this.visSocialMediaYouTubeVisible = false;
        this.visSocialMediaRSSVisible = false;
        this.visSocialMediaGooglePlusVisible = false;
        this.visSocialMediaHeader = false;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ExhibitorDetailsPage');
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.cd.markForCheck();
        // Temporary use variables
        var flags = "dt|Alpha|" + this.navParams.get('ExhibitorID');
        var DisplayName = "";
        var DisplayCityState = "";
        var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
        // Get the data
        this.databaseprovider.getExhibitorData(flags).then(data => {
            console.log("getExhibitorData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                console.log('ExhibitorDetails: Line 99');
                if (data[0].Country != "United States" && data[0].Country != "" && data[0].Country != null) {
                    DisplayCityState = data[0].City + ", " + data[0].Country;
                }
                else {
                    DisplayCityState = data[0].City + ", " + data[0].State + "  " + data[0].ZipPostalCode;
                }
                console.log('ExhibitorDetails: Line 105');
                this.ExhibitorCompanyName = data[0].CompanyName;
                this.ExhibitorAddressLine1 = data[0].AddressLine1;
                this.ExhibitorDisplayCityState = DisplayCityState;
                this.ExhibitorZipPostalCode = data[0].ZipPostalCode;
                this.ExhibitorBoothNumber = "Booth: " + data[0].BoothNumber;
                console.log('ExhibitorDetails: Line 112');
                this.ExhibitorCompanyLogoFilename = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/ExhibitorLogos/" + data[0].imageFilename;
                console.log('ExhibitorDetails: Line 115');
                this.btnEmail = "primary";
                this.btnWebsite = "primary";
                this.btnCall = "primary";
                // Button bar
                console.log('Primary contact email button');
                if ((data[0].PrimaryOnsiteContactEmail == "") || (data[0].PrimaryOnsiteContactEmail == null) || (data[0].PrimaryOnsiteContactEmail === undefined)) {
                    this.btnEmail = "light";
                    console.log('Button btnEmail greyed out');
                }
                else {
                    this.ExhibitorPrimaryOnsiteContactEmailURL = data[0].PrimaryOnsiteContactEmail;
                }
                console.log('Primary contact website button');
                if ((data[0].Website == "") || (data[0].Website == null) || (data[0].Website === undefined)) {
                    this.btnWebsite = "light";
                    console.log('Button btnWebsite greyed out');
                }
                else {
                    this.ExhibitorWebsite = data[0].Website;
                }
                console.log('Primary contact phone button');
                if (DevicePlatform == 'Browser') {
                    this.btnCall = "light";
                    console.log('Button btnCall greyed out');
                }
                else {
                    if ((data[0].PrimaryOnsiteContactPhone == "") || (data[0].PrimaryOnsiteContactPhone == null) || (data[0].PrimaryOnsiteContactPhone === undefined)) {
                        this.btnCall = "light";
                        console.log('Button btnCall greyed out');
                    }
                    else {
                        this.ExhibitorPrimaryOnsiteContactPhone = data[0].PrimaryOnsiteContactPhone;
                        console.log('Primary contact');
                    }
                }
                // Primary contact
                console.log('Primary contact name');
                this.ExhibitorPrimaryOnsiteContactName = data[0].PrimaryOnsiteContactName;
                this.ExhibitorPrimaryOnsiteContactEmailDisplay = data[0].PrimaryOnsiteContactEmail;
                if (data[0].PrimaryOnsiteContactPhone != null) {
                    if ((data[0].PrimaryOnsiteContactPhone.length > 0) && (data[0].PrimaryOnsiteContactPhone != "") && (typeof data[0].PrimaryOnsiteContactPhone !== "undefined")) {
                        this.ExhibitorPrimaryOnsiteContactPhone = data[0].PrimaryOnsiteContactPhone;
                    }
                    else {
                        this.ExhibitorPrimaryOnsiteContactPhone = "";
                    }
                }
                else {
                    this.ExhibitorPrimaryOnsiteContactPhone = "";
                }
                // Company Details
                console.log('Company Details');
                if ((data[0].CompanyDescription == "") || (data[0].CompanyDescription == null) || (data[0].CompanyDescription === undefined)) {
                    this.ExhibitorCompanyDescription = "Not available";
                    this.exDetails = "Not available";
                }
                else {
                    this.ExhibitorCompanyDescription = data[0].CompanyDescription;
                    this.exDetails = data[0].CompanyDescription;
                }
                // Social media tags
                console.log('Social media tags');
                var SocialMediaCheck = 0;
                this.visSocialMediaFacebookVisible = false;
                this.visSocialMediaTwitterVisible = false;
                this.visSocialMediaLinkedInVisible = false;
                this.visSocialMediaYouTubeVisible = false;
                this.visSocialMediaRSSVisible = false;
                this.visSocialMediaGooglePlusVisible = false;
                this.visSocialMediaHeader = false;
                //  Visual status
                console.log('Visual status');
                if (data[0].SocialMediaFacebook != null) {
                    if ((data[0].SocialMediaFacebook.length > 0) && (data[0].SocialMediaFacebook != "") && (data[0].SocialMediaFacebook !== undefined)) {
                        this.visSocialMediaFacebookVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaTwitter != null) {
                    if ((data[0].SocialMediaTwitter.length > 0) && (data[0].SocialMediaTwitter != "") && (data[0].SocialMediaTwitter !== undefined)) {
                        this.visSocialMediaTwitterVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaLinkedIn != null) {
                    if ((data[0].SocialMediaLinkedIn.length > 0) && (data[0].SocialMediaLinkedIn != "") && (data[0].SocialMediaLinkedIn !== undefined)) {
                        this.visSocialMediaLinkedInVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaYouTube != null) {
                    if ((data[0].SocialMediaYouTube.length > 0) && (data[0].SocialMediaYouTube != "") && (data[0].SocialMediaYouTube !== undefined)) {
                        this.visSocialMediaYouTubeVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaRSS != null) {
                    if ((data[0].SocialMediaRSS.length > 0) && (data[0].SocialMediaRSS != "") && (data[0].SocialMediaRSS !== undefined)) {
                        this.visSocialMediaRSSVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (data[0].SocialMediaGooglePlus != null) {
                    if ((data[0].SocialMediaGooglePlus.length > 0) && (data[0].SocialMediaGooglePlus != "") && (data[0].SocialMediaGooglePlus !== undefined)) {
                        this.visSocialMediaGooglePlusVisible = true;
                        SocialMediaCheck = 1;
                    }
                }
                if (SocialMediaCheck == 1) {
                    this.visSocialMediaHeader = true;
                }
                // Social Media Links
                console.log('Social Media Links');
                this.ExhibitorSocialMediaFacebook = data[0].SocialMediaFacebook;
                this.ExhibitorSocialMediaTwitter = data[0].SocialMediaTwitter;
                this.ExhibitorSocialMediaLinkedIn = data[0].SocialMediaLinkedIn;
                this.ExhibitorSocialMediaYouTube = data[0].SocialMediaYouTube;
                this.ExhibitorSocialMediaRSS = data[0].SocialMediaRSSVisible;
                this.ExhibitorSocialMediaGooglePlus = data[0].SocialMediaGooglePlus;
                // Booth mapping
                console.log('Booth mapping');
                var y = 0;
                var x = 0;
                var ExhibitorName = "";
                if (data[0].BoothY != null) {
                    y = data[0].BoothY;
                    x = data[0].BoothX;
                }
                ExhibitorName = data[0].CompanyName;
                console.log("Booth mapping (x,y): " + x + ", " + y);
                if ((x === undefined) || (y === undefined)) {
                    // Show empty map
                    console.log('Show empty map');
                    this.myMap = __WEBPACK_IMPORTED_MODULE_6_leaflet__["map"]('map2', {
                        crs: __WEBPACK_IMPORTED_MODULE_6_leaflet__["CRS"].Simple,
                        minZoom: -2,
                        maxZoom: 2,
                        zoomControl: false
                    });
                    var bounds = __WEBPACK_IMPORTED_MODULE_6_leaflet__["latLngBounds"]([0, 0], [2000, 1000]); // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
                    var image = __WEBPACK_IMPORTED_MODULE_6_leaflet__["imageOverlay"]('assets/img/Floorplan2019.png', bounds, {
                        attribution: 'Convergence'
                    }).addTo(this.myMap);
                    this.myMap.fitBounds(bounds);
                    this.myMap.setMaxBounds(bounds);
                }
                else {
                    // Simple coordinate system mapping
                    console.log('Simple coordinate system mapping');
                    this.myMap = __WEBPACK_IMPORTED_MODULE_6_leaflet__["map"]('map2', {
                        crs: __WEBPACK_IMPORTED_MODULE_6_leaflet__["CRS"].Simple,
                        minZoom: -2,
                        maxZoom: 2,
                        zoomControl: false
                    });
                    var bounds = __WEBPACK_IMPORTED_MODULE_6_leaflet__["latLngBounds"]([0, 0], [1500, 2000]); // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
                    var image = __WEBPACK_IMPORTED_MODULE_6_leaflet__["imageOverlay"]('assets/img/Floorplan2019.png', bounds, {
                        attribution: 'Convergence'
                    }).addTo(this.myMap);
                    this.myMap.fitBounds(bounds);
                    this.myMap.setMaxBounds(bounds);
                    var Exhibitor = __WEBPACK_IMPORTED_MODULE_6_leaflet__["latLng"]([y, x]);
                    __WEBPACK_IMPORTED_MODULE_6_leaflet__["marker"](Exhibitor).addTo(this.myMap)
                        .bindPopup(ExhibitorName)
                        .openPopup();
                    this.myMap.setView([y, x], 1);
                }
            }
            else {
                // No data to show
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    navToWebsite(WebsiteURL) {
        if (WebsiteURL === undefined) {
            // Do nothing
        }
        else {
            // Initiate web browser
            if ((WebsiteURL.substring(0, 7) != "http://") && (WebsiteURL.substring(0, 8) != "https://")) {
                WebsiteURL = "http://" + WebsiteURL;
            }
            console.log('Exhibitor Details: Navigating to: ' + WebsiteURL);
            window.open(WebsiteURL, '_system');
        }
    }
    ;
    navToEmail(EmailAddress) {
        if (EmailAddress === undefined) {
            // Do nothing
        }
        else {
            // Initiate mail program
            window.open('mailto:' + EmailAddress + '?subject=AACD San Diego', 'target=_blank');
        }
    }
    ;
    callPhone2(phoneNumber) {
        console.log("Dialer version 2");
        var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
        if (DevicePlatform != 'Browser') {
            if ((phoneNumber === undefined) || (phoneNumber == '')) {
                console.log('No phone number defined');
                // Do nothing
            }
            else {
                // remove all other characters from phone number string
                // phoneNumber = phoneNumber.replace(/-/g, '');
                phoneNumber = phoneNumber.replace('(', '');
                phoneNumber = phoneNumber.replace(')', '');
                phoneNumber = phoneNumber.replace(' ', '-');
                console.log('Dialer: tel:' + phoneNumber);
                window.open(`tel:${phoneNumber}`, '_system');
                //window['plugins'].CallNumber.callNumber(function onSuccess(result){
                //	console.log("Dialer Success:" + JSON.stringify(result));
                //},
                //function onError(result) {
                //	console.log("Dialer Error:" + JSON.stringify(result));
                //}, phoneNumber, false);
            }
        }
    }
};
ExhibitorDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-exhibitordetails',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/exhibitordetails/exhibitordetails.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Exhibitor Details</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n\n\n\n\n      <ion-grid>\n        <ion-row>\n          <ion-col><img [src]="ExhibitorCompanyLogoFilename" onerror="this.src=\'assets/img/a_00_3920t.png\'"\n            width="50%" height=""\n            src="assets/img/a_00_3920t.png"\n            class="img-default img-responsive"\n            alt="Image error">\n        </ion-col>\n    </ion-row>\n    \n        <ion-row>\n          <ion-col>\n            <p class="marginTB0 myLabelBold myFontSize22">{{ExhibitorCompanyName}}</p>\n            <p class="marginTB0 myFontSize18">{{ExhibitorAddressLine1}}</p>\n            <p class="marginTB0 myFontSize18">{{ExhibitorDisplayCityState}}</p>\n            <p class="marginTB0 myFontSize18">{{ExhibitorBoothNumber}}</p>\n        </ion-col>\n        </ion-row>\n    </ion-grid>\n\n\n\n\n\n    <ion-card>\n        <ion-card-header style="background:#283593;color:#fff">\n            Contact\n        </ion-card-header>\n\n        <ion-list>\n            <ion-item *ngIf=visPrimaryContact>\n                <ion-icon color="secondary" name="person" item-start></ion-icon>\n                {{ExhibitorPrimaryOnsiteContactName}}\n            </ion-item>\n\n            <button ion-item>\n                <ion-icon color="secondary" name="mail" item-start></ion-icon>\n                {{ExhibitorPrimaryOnsiteContactEmailDisplay}}\n            </button>\n\n            <button ion-item>\n                <ion-icon color="secondary" name="call" item-start></ion-icon>\n                {{ExhibitorPrimaryOnsiteContactPhone}}\n            </button>\n        </ion-list>\n    </ion-card>\n\n    <ion-card>\n        <ion-card-header style="background:#283593;color:#fff">\n            Description\n        </ion-card-header>\n        <ion-card-content>\n            <div [innerHTML]="exDetails" class="myMarginTopBottom">\n                {{ExhibitorCompanyDescription}}\n            </div>\n        </ion-card-content>\n    </ion-card>\n\n    <ion-card *ngIf="visSocialMediaHeader">\n        <ion-card-header style="background:#283593;color:#fff">\n            Social Media\n        </ion-card-header>\n        <ion-card-content padding>\n            <button ion-button color="secondary" outline *ngIf="visSocialMediaFacebookVisible" (click)="navToWebsite(ExhibitorSocialMediaFacebook)">\n                <ion-icon name="logo-facebook" style="font-size:2em;"></ion-icon>\n            </button>\n            <button ion-button color="secondary" outline *ngIf="visSocialMediaTwitterVisible" (click)="navToWebsite(ExhibitorSocialMediaTwitter)">\n                <ion-icon name="logo-twitter" style="font-size:2em;"></ion-icon>\n            </button>\n            <button ion-button color="secondary" outline *ngIf="visSocialMediaLinkedInVisible" (click)="navToWebsite(ExhibitorSocialMediaLinkedIn)">\n                <ion-icon name="logo-linkedin" style="font-size:2em;"></ion-icon>\n            </button>\n            <button ion-button color="secondary" outline *ngIf="visSocialMediaYouTubeVisible" (click)="navToWebsite(ExhibitorSocialMediaYouTube)">\n                <ion-icon name="logo-youtube" style="font-size:2em;"></ion-icon>\n            </button>\n            <button ion-button color="secondary" outline *ngIf="visSocialMediaRSSVisible" (click)="navToWebsite(ExhibitorSocialMediaRSS)">\n                <ion-icon name="logo-rss" style="font-size:2em;"></ion-icon>\n            </button>\n            <button ion-button color="secondary" outline *ngIf="visSocialMediaGooglePlusVisible" (click)="navToWebsite(ExhibitorSocialMediaGooglePlus)">\n                <ion-icon name="logo-googleplus" style="font-size:2em;"></ion-icon>\n            </button>\n        </ion-card-content>\n    </ion-card>\n\n    <ion-card>\n        <ion-card-header style="background:#283593; color:#fff">\n                Locator\n            </ion-card-header>\n        <ion-card-content>\n        <div id="map2" style="width:100%; height:300px;"></div>\n        <!-- <div class="map-container">\n            <div id="mapId" style="width: 100%; height: 100%">\n            </div>\n        </div> -->\n        </ion-card-content>\n    </ion-card>\n\n	\n		\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/exhibitordetails/exhibitordetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ExhibitorDetailsPage);

//# sourceMappingURL=exhibitordetails.js.map

/***/ })

});
//# sourceMappingURL=9.js.map