webpackJsonp([6],{

/***/ 957:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MyAgendaPersonalModule", function() { return MyAgendaPersonalModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__myagendapersonal__ = __webpack_require__(978);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let MyAgendaPersonalModule = class MyAgendaPersonalModule {
};
MyAgendaPersonalModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__myagendapersonal__["a" /* MyAgendaPersonal */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__myagendapersonal__["a" /* MyAgendaPersonal */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__myagendapersonal__["a" /* MyAgendaPersonal */]]
    })
], MyAgendaPersonalModule);

//# sourceMappingURL=myagendapersonal.module.js.map

/***/ }),

/***/ 978:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyAgendaPersonal; });
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






let MyAgendaPersonal = class MyAgendaPersonal {
    constructor(navCtrl, navParams, storage, databaseprovider, loadingCtrl, alertCtrl, events, cd, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.cd = cd;
        this.localstorage = localstorage;
        this.btnDelete = false;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MyAgendaPersonal');
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        this.btnDelete = false;
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
        var AgendaQueryDates = AgendaDates.split("|");
        var NumberofDates = AgendaQueryDates.length - 2;
        this.agendaItempersonalStartDate = AgendaQueryDates[0];
        this.agendaItempersonalEndDate = AgendaQueryDates[NumberofDates];
        this.cd.markForCheck();
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var personalID = this.localstorage.getLocalValue('PersonalEventID');
        if (personalID != "0") {
            var flags = "pi|0|" + personalID + "|0|0|0|0|0|0|0";
            // Get the data
            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                console.log("getPersonalAgendaData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    this.agendaItempersonalEventName = data[0].EventName;
                    this.agendaItempersonalEventLocation = data[0].EventLocation;
                    this.agendaItempersonalDate = data[0].EventDate;
                    this.agendaItempersonalStartTime = data[0].EventStartTime;
                    this.agendaItempersonalEndTime = data[0].EventEndTime;
                    if (data[0].EventDescription == 'undefined' || data[0].EventDescription === undefined || data[0].EventDescription === null) {
                        console.log('Personal Agenda, Set Description to blank');
                        this.agendaItempersonalEventDescription = "";
                    }
                    else {
                        console.log('Personal Agenda, Set Description to: ' + data[0].EventDescription);
                        this.agendaItempersonalEventDescription = data[0].EventDescription;
                    }
                    this.agendaItemid = data[0].mtgID;
                    this.btnDelete = true;
                    this.cd.detectChanges();
                    this.cd.markForCheck();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        //loading.dismiss();
    }
    SaveAgendaItem() {
        console.log('Process Personal Agenda Save');
        // Saving progress
        let saving = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Saving...'
        });
        // Alert for successful save
        let savealert = this.alertCtrl.create({
            title: 'Personal Agenda Entry',
            subTitle: 'Personal Agenda entry has been saved.',
            buttons: ['Ok']
        });
        // Alert for failed save
        let failalert = this.alertCtrl.create({
            title: 'Personal Agenda Entry',
            subTitle: 'Unable to save your Personal Agenda entry at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        // Alert for required fields
        let requiredalert = this.alertCtrl.create({
            title: 'Personal Agenda Entry',
            subTitle: 'All fields except Description are required to be completed before saving.',
            buttons: ['Ok']
        });
        // Show saving progress
        saving.present();
        var personalID = this.localstorage.getLocalValue('PersonalEventID');
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var ControlDate;
        var StartTime = "";
        var EndTime = "";
        var EventDate = "";
        // Validation checks
        var ValidationPass = true;
        // Diagnostics
        console.log('Personal Agenda, agendaItempersonalEventName: ' + this.agendaItempersonalEventName);
        console.log('Personal Agenda, agendaItempersonalEventLocation: ' + this.agendaItempersonalEventLocation);
        console.log('Personal Agenda, agendaItempersonalDate: ' + this.agendaItempersonalDate);
        console.log('Personal Agenda, agendaItempersonalStartTime: ' + this.agendaItempersonalStartTime);
        console.log('Personal Agenda, agendaItempersonalEndTime: ' + this.agendaItempersonalEndTime);
        if (this.agendaItempersonalEventName == null || this.agendaItempersonalEventName == "") {
            ValidationPass = false;
        }
        if (this.agendaItempersonalEventLocation == null || this.agendaItempersonalEventLocation == "") {
            ValidationPass = false;
        }
        if (this.agendaItempersonalDate == null || this.agendaItempersonalDate == "") {
            ValidationPass = false;
        }
        if (this.agendaItempersonalStartTime == null || this.agendaItempersonalStartTime == "") {
            ValidationPass = false;
        }
        if (this.agendaItempersonalEndTime == null || this.agendaItempersonalEndTime == "") {
            ValidationPass = false;
        }
        if (ValidationPass == false) {
            saving.dismiss();
            requiredalert.present();
        }
        else {
            // Date formatting
            //ControlDate = new Date(this.agendaItempersonalDate + " " + this.agendaItempersonalStartTime);
            //StartTime = dateFormat(ControlDate, "HH:MM:ss");
            StartTime = this.agendaItempersonalStartTime + ":00";
            //ControlDate = new Date(this.agendaItempersonalDate + " " + this.agendaItempersonalEndTime);
            //EndTime = dateFormat(ControlDate, "HH:MM:ss");
            EndTime = this.agendaItempersonalEndTime + ":00";
            console.log('Personal Agenda, 24hr Start Time: ' + StartTime);
            console.log('Personal Agenda, 24hr End Time: ' + EndTime);
            // Previously successful sync time
            var LastUpdateDate3 = this.localstorage.getLocalValue('LastUpdateDate');
            if (LastUpdateDate3 == '' || LastUpdateDate3 === null) {
                LastUpdateDate3 = '2018-09-01T00:00:01Z';
            }
            var LastUpdateDate2 = new Date(LastUpdateDate3).toUTCString();
            var LastUpdateDate = dateFormat(LastUpdateDate2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            var flags = "ps|0|" + personalID + "|" + StartTime + "|" + EndTime + "|" + this.agendaItempersonalEventLocation + "|" + this.agendaItempersonalEventName + "|" + this.agendaItempersonalDate + "|0|" + LastUpdateDate + "|" + this.agendaItempersonalEventDescription;
            console.log('Save personal flags: ' + flags);
            this.databaseprovider.getAgendaData(flags, AttendeeID).then(dataS => {
                console.log("Personal Agenda Save, getAgendaData: " + JSON.stringify(dataS));
                if (dataS['length'] > 0) {
                    if (dataS[0].PEStatus == "Success") {
                        // Saved
                        this.events.publish('user:Status', 'Personal Agenda Save/Update');
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.pop();
                    }
                    else {
                        // Not saved
                        console.log("Query: " + dataS[0].PEQuery);
                        saving.dismiss();
                        failalert.present();
                    }
                }
                else {
                    // Not saved
                    console.log("No query to show");
                    saving.dismiss();
                    failalert.present();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
    DeleteAgendaItem() {
        console.log('Process Personal Agenda Delete');
        // Deleting progress
        let deleting = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Deleting...'
        });
        // Alert for successful delete
        let deletealert = this.alertCtrl.create({
            title: 'Personal Agenda Entry',
            subTitle: 'Personal Agenda entry has been deleted.',
            buttons: ['Ok']
        });
        // Alert for failed delete
        let failalert = this.alertCtrl.create({
            title: 'Personal Agenda Entry',
            subTitle: 'Unable to delete your Personal Agenda entry at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        let confirmAlert = this.alertCtrl.create({
            title: 'Delete Personal Agenda',
            message: 'Are you sure you want to delete this agenda item?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('User chose to keep agenda item');
                        //this.confirmAlert.dismiss();
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('User chose to delete agenda item');
                        var personalID = this.localstorage.getLocalValue('PersonalEventID');
                        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
                        // Get last update performed by this app
                        var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
                        if (LastUpdateDate == null) {
                            // If never, then set variable and localStorage item to NA
                            LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                            this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
                        }
                        var flags = "pd|0|" + personalID + "|0|0|0|0|0|0|" + LastUpdateDate + "|0";
                        console.log('Delete personal flags: ' + flags);
                        this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                            console.log("getAgendaData: " + JSON.stringify(data));
                            if (data['length'] > 0) {
                                if (data[0].PEStatus == "Success") {
                                    // Saved
                                    this.events.publish('user:Status', 'Personal Agenda Delete');
                                    //confirmAlert.dismiss();
                                    deletealert.present();
                                    this.navCtrl.pop();
                                }
                                else {
                                    // Not saved
                                    console.log("Query: " + data[0].PEQuery);
                                    //confirmAlert.dismiss();
                                    failalert.present();
                                }
                            }
                            else {
                                // Not saved
                                console.log("No query to show");
                                //confirmAlert.dismiss();
                                failalert.present();
                            }
                        }).catch(function () {
                            console.log("Promise Rejected");
                        });
                    }
                }
            ]
        });
        // Show saving progress
        confirmAlert.present();
    }
};
MyAgendaPersonal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-myagendapersonal',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/myagendapersonal/myagendapersonal.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Personal Agenda Item</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n\n<ion-card>\n		<ion-card-content>\n\n	<ion-list>\n			<ion-card-header style="background:#283593;color:#fff; height:40px; padding-top:7px">\n					Event Title\n				</ion-card-header>\n\n		<ion-item>\n			<ion-input type="text" placeholder="Enter personal event title" style="height:40px" (input)=\'agendaItempersonalEventName = $event.target.value\' name="agendaItempersonalEventName" [value]="agendaItempersonalEventName" id="agendaItempersonalEventName"></ion-input>\n		</ion-item>\n\n		<ion-card-header style="background:#283593;color:#fff;height:40px; padding-top:7px">\n				Location\n			</ion-card-header>\n            \n		<ion-item>\n			<ion-input type="text" placeholder="Enter a location" style="height:40px" (input)=\'agendaItempersonalEventLocation = $event.target.value\' name="agendaItempersonalEventLocation" [value]="agendaItempersonalEventLocation" id="agendaItempersonalEventLocation"></ion-input>\n		</ion-item>\n\n		<ion-card-header style="background:#283593;color:#fff; height:40px; padding-top:7px">\n				Date and Time of the Event\n			</ion-card-header>\n\n\n			<ion-grid>\n				<ion-row>\n					<ion-col>     \n							<p style="text-align:center">Date</p>\n\n							<ion-datetime style="text-align:center"\n							displayFormat="MM/DD/YYYY"\n							min="{{agendaItempersonalStartDate}}" \n							max="{{agendaItempersonalEndDate}}" \n							name="agendaItempersonalDate" \n							[(ngModel)]="agendaItempersonalDate" \n							id="agendaItempersonalDate"></ion-datetime>\n\n\n					</ion-col>\n\n					<ion-col>                 \n							<p style="text-align:center">Start Time</p>\n\n							<ion-datetime style="text-align:center"\n							displayFormat="HH:mm"\n							min="07:00" \n							max="23:30" \n							name="agendaItempersonalStartTime" \n							[(ngModel)]="agendaItempersonalStartTime" \n							id="agendaItempersonalStartTime"></ion-datetime>\n					</ion-col>\n\n					<ion-col>\n							<p style="text-align:center">End Time</p>\n							<ion-datetime style="text-align:center"\n							displayFormat="HH:mm" \n							min="07:00" \n							max="23:30" \n							name="agendaItempersonalEndTime" \n							[(ngModel)]="agendaItempersonalEndTime" \n							id="agendaItempersonalEndTime"></ion-datetime>\n					</ion-col>\n				</ion-row>\n			</ion-grid>\n\n			<ion-card-header style="background:#283593;color:#fff; height:40px; padding-top:7px">\n				Description\n			</ion-card-header>\n\n			<ion-grid>\n				<ion-row>\n					<ion-col col-12>\n						<ion-textarea placeholder="Enter description or notes about this personal event" \n						(input)=\'agendaItempersonalEventDescription = $event.target.value\' \n							name="agendaItempersonalEventDescription" \n							[value]="agendaItempersonalEventDescription" \n							id="agendaItempersonalEventDescription"></ion-textarea>\n					</ion-col>\n				</ion-row>\n			</ion-grid>\n\n			<ion-grid>\n				<ion-row>\n					<ion-col>\n						<button ion-button block style="background:#2196f3; color:#fff" (click)="SaveAgendaItem()">\n							Save\n						</button>\n					</ion-col>\n				</ion-row>\n\n				<ion-row>\n					<ion-col>\n						<button ion-button block style="background:#2196f3; color:#fff" *ngIf="btnDelete" (click)="DeleteAgendaItem(agendaItemid)">\n							Delete\n						</button>\n					</ion-col>\n				</ion-row>\n			</ion-grid>\n		\n	</ion-list>\n</ion-card-content>\n</ion-card>\n\n</ion-content>\n\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/myagendapersonal/myagendapersonal.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], MyAgendaPersonal);

//# sourceMappingURL=myagendapersonal.js.map

/***/ })

});
//# sourceMappingURL=6.js.map