webpackJsonp([7],{

/***/ 966:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListingLevel1Module", function() { return ListingLevel1Module; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__listinglevel1__ = __webpack_require__(984);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins



// Pages

let ListingLevel1Module = class ListingLevel1Module {
};
ListingLevel1Module = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [__WEBPACK_IMPORTED_MODULE_3__listinglevel1__["a" /* ListingLevel1 */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__listinglevel1__["a" /* ListingLevel1 */])
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_3__listinglevel1__["a" /* ListingLevel1 */]]
    })
], ListingLevel1Module);

//# sourceMappingURL=listinglevel1.module.js.map

/***/ }),

/***/ 984:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListingLevel1; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__educationdetails_educationdetails__ = __webpack_require__(84);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
// Components, functions, plugins






// Pages


let ListingLevel1 = class ListingLevel1 {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, events, alertCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.localstorage = localstorage;
        this.ProgramListing = [];
        this.daysShow = true;
        // Day buttons
        this.dayButton1 = "myButtonGreyBlue";
        this.dayButton2 = "myButtonGreyBlue";
        this.dayButton3 = "myButtonGreyBlue";
        this.dayButton4 = "myButtonGreyBlue";
        this.dayButton5 = "myButtonGreyBlue";
        this.DayButton1Show = false;
        this.DayButton2Show = false;
        this.DayButton3Show = false;
        this.DayButton4Show = false;
        this.DayButton5Show = false;
        this.ProgramTitle = this.navParams.get('listingType');
    }
    ngOnInit() {
        // Load initial data set here
        //switch(this.navParams.get('listingType')) {
        //		case "Lectures":
        //			this.daysShow = true;
        //			console.log('Showing day bar');
        //			break;
        //		default:
        //			this.daysShow = false;
        //			console.log('Hiding day bar');
        //			break;
        //}
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.ProgramListing = [];
        this.cd.markForCheck();
        var flags;
        var NotesButtonStatus = true;
        // Disabled per LIsa Bollenbach 2018-04-19
        var AgendaButtonStatus = false;
        var dayID;
        var AgendaQueryDate = "";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var ProgramDay = this.localstorage.getLocalValue('ProgramDay');
        this.dayButton1 = "myButtonGreyBlue";
        this.dayButton2 = "myButtonGreyBlue";
        this.dayButton3 = "myButtonGreyBlue";
        this.dayButton4 = "myButtonGreyBlue";
        this.dayButton5 = "myButtonGreyBlue";
        var AgendaDays = this.localstorage.getLocalValue("AgendaDays");
        var AgendaDayButtonLabels = this.localstorage.getLocalValue("AgendaDayButtonLabels");
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
        var AgendaDisplayDate = this.localstorage.getLocalValue('AgendaDisplayDate');
        var AgendaQueryDates = AgendaDates.split("|");
        var DayLabel = AgendaDayButtonLabels.split("|");
        console.log('AgendaDays: ' + AgendaDays);
        switch (AgendaDays) {
            case "1":
                this.DayButton1Show = true;
                this.DayButton2Show = false;
                this.DayButton3Show = false;
                this.DayButton4Show = false;
                this.DayButton5Show = false;
                this.DayButton1Label = DayLabel[0];
                this.DayButton2Label = "";
                this.DayButton3Label = "";
                this.DayButton4Label = "";
                this.DayButton5Label = "";
                break;
            case "2":
                this.DayButton1Show = true;
                this.DayButton2Show = true;
                this.DayButton3Show = false;
                this.DayButton4Show = false;
                this.DayButton5Show = false;
                this.DayButton1Label = DayLabel[0];
                this.DayButton2Label = DayLabel[1];
                this.DayButton3Label = "";
                this.DayButton4Label = "";
                this.DayButton5Label = "";
                break;
            case "3":
                this.DayButton1Show = true;
                this.DayButton2Show = true;
                this.DayButton3Show = true;
                this.DayButton4Show = false;
                this.DayButton5Show = false;
                this.DayButton1Label = DayLabel[0];
                this.DayButton2Label = DayLabel[1];
                this.DayButton3Label = DayLabel[2];
                this.DayButton4Label = "";
                this.DayButton5Label = "";
                break;
            case "4":
                this.DayButton1Show = true;
                this.DayButton2Show = true;
                this.DayButton3Show = true;
                this.DayButton4Show = true;
                this.DayButton5Show = false;
                this.DayButton1Label = DayLabel[0];
                this.DayButton2Label = DayLabel[1];
                this.DayButton3Label = DayLabel[2];
                this.DayButton4Label = DayLabel[3];
                this.DayButton5Label = "";
                break;
            case "5":
                this.DayButton1Show = true;
                this.DayButton2Show = true;
                this.DayButton3Show = true;
                this.DayButton4Show = true;
                this.DayButton5Show = true;
                this.DayButton1Label = DayLabel[0];
                this.DayButton2Label = DayLabel[1];
                this.DayButton3Label = DayLabel[2];
                this.DayButton4Label = DayLabel[3];
                this.DayButton5Label = DayLabel[4];
                break;
        }
        switch (AgendaDisplayDate) {
            case AgendaQueryDates[0]:
                this.dayButton1 = "myButtonActive";
                AgendaQueryDate = AgendaQueryDates[0];
                break;
            case AgendaQueryDates[1]:
                this.dayButton2 = "myButtonActive";
                AgendaQueryDate = AgendaQueryDates[1];
                break;
            case AgendaQueryDates[2]:
                this.dayButton3 = "myButtonActive";
                AgendaQueryDate = AgendaQueryDates[2];
                break;
            case AgendaQueryDates[3]:
                this.dayButton4 = "myButtonActive";
                AgendaQueryDate = AgendaQueryDates[3];
                break;
            case AgendaQueryDates[4]:
                this.dayButton5 = "myButtonActive";
                AgendaQueryDate = AgendaQueryDates[4];
                break;
            default:
                this.dayButton1 = "myButtonActive";
                this.storage.set('AgendaDisplayDate', AgendaQueryDates[0]);
                AgendaQueryDate = AgendaQueryDates[0];
                break;
        }
        flags = AgendaQueryDate;
        console.log('Flags: ' + flags);
        //if (AttendeeID != '' && AttendeeID != null) {
        this.databaseprovider.getLecturesByDay(flags, this.navParams.get('listingType'), AttendeeID).then(data => {
            console.log("getLecturesByDay: " + JSON.stringify(data));
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    var SubjectCodeCECredits = "";
                    var dbEventDateTime = data[i].session_start_time.substring(0, 19);
                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                    var SQLDate = new Date(dbEventDateTime);
                    var DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                    // Display end time
                    dbEventDateTime = data[i].session_end_time.substring(0, 19);
                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                    SQLDate = new Date(dbEventDateTime);
                    DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                    //console.log('Session ID: ' + data[i].session_id + ', OnAgenda: ' + data[i].OnAgenda);
                    var AgendaButtonText = "";
                    if (data[i].OnAgenda != null) {
                        AgendaButtonText = "Remove";
                        //    ButtonStyle = "myButtonColor";
                    }
                    else {
                        AgendaButtonText = "Add";
                        //    ButtonStyle = "myButtonGreyBlue";
                    }
                    var visEventName = data[i].session_title;
                    var DisplayDateRoom = "";
                    if (data[i].RoomName.length == 0) {
                        DisplayDateRoom = DisplayDateTime;
                    }
                    else {
                        DisplayDateRoom = DisplayDateTime + " in " + data[i].RoomName;
                    }
                    if (data[i].subject != null && data[i].subject != "") {
                        SubjectCodeCECredits = "Subject code: " + data[i].subject;
                    }
                    if (data[i].subject != null && data[i].subject != "") {
                        if (data[i].cs_credits != null && data[i].cs_credits != "") {
                            SubjectCodeCECredits = SubjectCodeCECredits + " - CE Credits: " + data[i].cs_credits;
                        }
                    }
                    else {
                        if (data[i].cs_credits != null && data[i].cs_credits != "") {
                            SubjectCodeCECredits = "CE Credits: " + data[i].cs_credits;
                        }
                    }
                    // Status checks
                    var visSessionStatus = "";
                    var visStatusStyle = "SessionStatusNormal";
                    // Room Capacity check
                    if (parseInt(data[i].room_capacity) <= parseInt(data[i].Attendees)) {
                        visSessionStatus = "Course at Capacity";
                        visStatusStyle = "SessionStatusRed";
                    }
                    // Waitlist check
                    if (data[i].Waitlist == "1") {
                        if (visSessionStatus == "") {
                            visSessionStatus = "You are Waitlisted";
                            visStatusStyle = "SessionStatusRed";
                        }
                        else {
                            visSessionStatus = visSessionStatus + " / You are Waitlisted";
                            visStatusStyle = "SessionStatusRed";
                        }
                    }
                    console.log("Course: " + data[i].session_title);
                    console.log("Room Capacity: " + data[i].room_capacity);
                    console.log("Attendees: " + data[i].Attendees);
                    console.log("Status Text: " + visSessionStatus);
                    this.ProgramListing.push({
                        DisplayEventName: visEventName,
                        DisplayEventTimeDateLocation: DisplayDateRoom,
                        SpeakerDisplayName: data[i].other_speakers,
                        EventID: data[i].session_id,
                        visAgendaAddRemoveButton: AgendaButtonText,
                        btnEvalShow: false,
                        btnNotesShow: NotesButtonStatus,
                        btnAgendaShow: AgendaButtonStatus,
                        btnEmailShow: true,
                        DisplaySubjectCodeCECredits: SubjectCodeCECredits,
                        SessionStatusStyle: visStatusStyle,
                        SessionStatus: visSessionStatus
                    });
                }
            }
            else {
                this.ProgramListing.push({
                    DisplayEventName: "No records available",
                    DisplayEventTimeDateLocation: "",
                    SpeakerDisplayName: "",
                    EventID: 0,
                    btnEvalShow: false,
                    btnNotesShow: false,
                    btnAgendaShow: false,
                    btnEmailShow: false,
                    DisplaySubjectCodeCECredits: "",
                    SessionStatusStyle: "",
                    SessionStatus: ""
                });
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
        //} else {
        //	console.log('User not logged in');
        //	loading.dismiss();
        //}
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ListingLevel1');
    }
    GetSearchResults() {
        var SearchTerms = this.EntryTerms;
        if ((SearchTerms == undefined) || (SearchTerms == "")) {
            // Do nothing or show message
        }
        else {
            this.localstorage.setLocalValue("SearchTerms", SearchTerms);
            this.navCtrl.push('SearchResultsPage', { SearchTerms: SearchTerms }, { animate: true, direction: 'forward' });
        }
    }
    ;
    EventDetails(EventID) {
        this.localstorage.setLocalValue('EventID', EventID);
        if (EventID != 0) {
            var MassAddFlag = "0";
            var MassEvalFlag = "0";
            var MassContactFlag = "0";
            var MassEmailFlag = "0";
            var MassAgendaFlag = "0";
            var MassNotesFlag = "0";
            MassAddFlag = this.localstorage.getLocalValue("MassAdd");
            MassEvalFlag = this.localstorage.getLocalValue("MassEval");
            MassContactFlag = this.localstorage.getLocalValue("MassContact");
            MassEmailFlag = this.localstorage.getLocalValue("MassEmail");
            MassAgendaFlag = this.localstorage.getLocalValue("MassAgenda");
            MassNotesFlag = this.localstorage.getLocalValue("MassNotes");
            if ((MassAddFlag != "0") || (MassEvalFlag != "0") || (MassContactFlag != "0") || (MassEmailFlag != "0") || (MassAgendaFlag != "0") || (MassNotesFlag != "0")) {
                this.localstorage.setLocalValue("MassAdd", "0");
                this.localstorage.setLocalValue("MassEval", "0");
                this.localstorage.setLocalValue("MassContact", "0");
                this.localstorage.setLocalValue("MassEmail", "0");
                this.localstorage.setLocalValue("MassAgenda", "0");
                this.localstorage.setLocalValue("MassNotes", "0");
            }
            else {
                // Navigate to Exhibitor Details page
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: EventID }, { animate: true, direction: 'forward' });
            }
        }
    }
    ;
    navToNotes(EventID) {
        console.log("NoteDetails: " + EventID);
        this.localstorage.setLocalValue("MassNotes", "1");
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID == '' || AttendeeID == null) {
            // If not, store the page they want to go to and go to the Login page
            console.log('Stored AttendeeID: ' + AttendeeID);
            this.localstorage.setLocalValue('NavigateToPage', "NotesDetailsPage");
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
        else {
            // Otherwise just go to the page they want
            this.navCtrl.push('NotesDetailsPage', { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    eMailCourse(CourseTitle) {
        this.localstorage.setLocalValue("MassEmail", "1");
        window.open("mailto:info@mailaddress.com?subject=" + CourseTitle + "&body=From the AACD Chicago 2018 Conference...", '_system');
    }
    ;
    DayUpdate(DayName) {
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
        var AgendaQueryDates = AgendaDates.split("|");
        switch (DayName) {
            case "1":
                this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[0]);
                break;
            case "2":
                this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[1]);
                break;
            case "3":
                this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[2]);
                break;
            case "4":
                this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[3]);
                break;
            case "5":
                this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[4]);
                break;
            default:
                this.localstorage.setLocalValue('AgendaDisplayDate', AgendaQueryDates[0]);
                break;
        }
        this.ngOnInit();
    }
    AgendaUpdate(session, EventID, sessionCard) {
        console.log('Agenda Update called');
        console.log('Session: ' + JSON.stringify(session));
        console.log('EventID: ' + EventID);
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        this.localstorage.setLocalValue("MassAdd", "1");
        this.localstorage.setLocalValue("EventID", EventID);
        this.localstorage.setLocalValue("MassAddTag", EventID);
        var flags = '';
        if (AttendeeID !== null) {
            if (AttendeeID.length > 0) {
                //var elem = angular.element(e.srcElement);
                // Get last update performed by this app
                var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
                if (LastUpdateDate == null) {
                    // If never, then set variable and localStorage item to NA
                    LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                    this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
                }
                // If so, remove it
                //if (elem.text().trim() == "Remove") {
                if (session.visAgendaAddRemoveButton == "Remove") {
                    console.log('Remove detected');
                    flags = "dt|0|Alpha|" + EventID;
                    this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
                        console.log("getLectureData: " + JSON.stringify(data));
                        if (data['length'] > 0) {
                            // Values for Agenda Management
                            this.localstorage.setLocalValue("AAOID", EventID);
                            this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11, 19));
                            this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11, 19));
                            this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
                            this.localstorage.setLocalValue("EventName", data[0].session_title);
                            this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0, 10));
                            var AAOID = this.localstorage.getLocalValue("AAOID");
                            var EventID = this.localstorage.getLocalValue("EventID");
                            var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
                            var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
                            var EventLocation = this.localstorage.getLocalValue("EventLocation");
                            var EventName = this.localstorage.getLocalValue("EventName");
                            EventName = EventName.replace(/'/g, "''");
                            var EventDate = this.localstorage.getLocalValue("EventDate");
                            // -----------------------
                            // Remove Item from Agenda
                            // -----------------------
                            flags = 'dl|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
                            console.log("flags: " + flags);
                            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                                console.log("getAgendaData: " + JSON.stringify(data));
                                if (data['length'] > 0) {
                                    console.log("Return status: " + data[0].DeleteStatus);
                                    if (data[0].DeleteStatus == "Success") {
                                        this.events.publish('user:Status', 'AgendaItem Remove');
                                        session.visAgendaAddRemoveButton = "Add";
                                        this.cd.markForCheck();
                                    }
                                    else {
                                        console.log("Return query: " + data[0].DeleteQuery);
                                        let alert = this.alertCtrl.create({
                                            title: 'Agenda Item',
                                            subTitle: 'Unable to remove the item from your agenda at this time. Please try again shortly.',
                                            buttons: ['OK']
                                        });
                                        alert.present();
                                    }
                                }
                            }).catch(function () {
                                console.log("Promise Rejected");
                            });
                        }
                    }).catch(function () {
                        console.log("Promise Rejected");
                    });
                }
                // If not, add it
                //if (elem.text().trim() == "Add") {
                if (session.visAgendaAddRemoveButton == "Add") {
                    console.log('Add detected');
                    flags = "dt|0|Alpha|" + EventID;
                    this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
                        console.log("getLectureData: " + JSON.stringify(data));
                        if (data['length'] > 0) {
                            // Values for Agenda Management
                            this.localstorage.setLocalValue("AAOID", EventID);
                            this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11, 19));
                            this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11, 19));
                            this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
                            this.localstorage.setLocalValue("EventName", data[0].session_title);
                            this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0, 10));
                            var AAOID = this.localstorage.getLocalValue("AAOID");
                            var EventID = this.localstorage.getLocalValue("EventID");
                            var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
                            var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
                            var EventLocation = this.localstorage.getLocalValue("EventLocation");
                            var EventName = this.localstorage.getLocalValue("EventName");
                            EventName = EventName.replace(/'/g, "''");
                            var EventDate = this.localstorage.getLocalValue("EventDate");
                            // ------------------------
                            // Add item to Agenda
                            // ------------------------
                            flags = 'ad|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
                            console.log("flags: " + flags);
                            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                                console.log("getAgendaData: " + JSON.stringify(data));
                                if (data['length'] > 0) {
                                    console.log("Return status: " + data[0].AddStatus);
                                    if (data[0].AddStatus == "Success") {
                                        this.events.publish('user:Status', 'AgendaItem Add');
                                        session.visAgendaAddRemoveButton = "Remove";
                                        this.cd.markForCheck();
                                    }
                                    else {
                                        console.log("Return query: " + data[0].AddQuery);
                                        let alert = this.alertCtrl.create({
                                            title: 'Agenda Item',
                                            subTitle: 'Unable to add the item to your agenda at this time. Please try again shortly.',
                                            buttons: ['OK']
                                        });
                                        alert.present();
                                    }
                                }
                            }).catch(function () {
                                console.log("Promise Rejected");
                            });
                        }
                    }).catch(function () {
                        console.log("Promise Rejected");
                    });
                }
                // Flip button text
                //if (elem.text().trim() == "Add") {
                //    elem.text("Remove");
                //} else {
                //    elem.text("Add");
                //}
            }
            else {
                // Not logged in
                this.localstorage.setLocalValue('NavigateToPage', "listingLevel1");
                this.localstorage.setLocalValue("LoginWarning", "2");
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
            }
        }
        else {
            // Not logged in
            this.localstorage.setLocalValue('NavigateToPage', "listingLevel1");
            this.localstorage.setLocalValue("LoginWarning", "2");
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
    }
    ;
};
ListingLevel1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-listinglevel1',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/listinglevel1/listinglevel1.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{ProgramTitle}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-grid style="padding:0; margin:0">\n		<ion-row>\n			<ion-col col-9>	\n				<ion-item class="item-input">\n					<ion-icon name="search" item-left></ion-icon>\n					<ion-input name="srchBarEntry" id="srchBarEntry" \n					type="text" placeholder="Search" [(ngModel)]="EntryTerms"></ion-input>\n				</ion-item>\n			</ion-col>\n			<ion-col col-3>\n				<button ion-button full style="padding:0; margin:0; background:#2196f3" (tap)="GetSearchResults()">Submit</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n\n\n	<ion-grid style="padding:0; margin-bottom:5px">\n		<ion-row>\n\n			<ion-col style="padding:0" *ngIf=DayButton1Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton1" (click)="DayUpdate(\'1\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton1Label}}</label>\n				</button>\n			</ion-col>\n			<ion-col style="padding:0" *ngIf=DayButton2Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton2" (click)="DayUpdate(\'2\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton2Label}}</label>\n				</button>\n			</ion-col>\n			\n			<ion-col style="padding:0" *ngIf=DayButton3Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton3" style="padding:0; margin:0" (click)="DayUpdate(\'3\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton3Label}}</label>\n				</button>\n			</ion-col>\n\n			<ion-col style="padding:0" *ngIf=DayButton4Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton4" style="padding:0; margin:0" (click)="DayUpdate(\'4\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton4Label}}</label>\n				</button>\n			</ion-col>\n			<ion-col style="padding:0" *ngIf=DayButton5Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton5" style="padding:0; margin:0" (click)="DayUpdate(\'5\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton5Label}}</label>\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n	\n	<ion-list style="margin-top:0">\n		<ion-item *ngFor="let session of ProgramListing" (tap)="EventDetails(session.EventID)" id="course-list-item19">\n			<ion-icon item-right name="arrow-dropright"></ion-icon>\n			<h2>{{session.DisplayEventName}}</h2>\n			<p>{{session.DisplayEventTimeDateLocation}}</p>\n			<p>{{session.SpeakerDisplayName}}</p>\n			<p>{{session.DisplaySubjectCodeCECredits}}</p>\n			<p [ngClass]="session.SessionStatusStyle">{{session.SessionStatus}}</p>\n\n			<div class="button-bar">\n\n				<!-- Disabled per LIsa Bollenbach 2018-04-19 -->\n				<button #sessionCard *ngIf=session.btnAgendaShow ion-button outline (tap)="AgendaUpdate(session, session.EventID, sessionCard)" [disabled]=true>\n					<div>\n						<ion-icon name="calendar"></ion-icon>\n						<label>{{session.visAgendaAddRemoveButton}}</label>\n					</div>\n				</button>\n\n				<!--\n					<ion-col col-0>\n						<button *ngIf=session.btnEvalShow ion-button outline (tap)="navToSurvey(session.EventID)">\n							<div>\n								<ion-icon name="checkbox"></ion-icon>\n								<label>Eval</label>\n							</div>\n						</button>\n					</ion-col>\n				-->\n\n				<button ion-button *ngIf=session.btnEmailShow outline (tap)="eMailCourse(session.DisplayEventName)">\n					<div>\n						<ion-icon name="mail"></ion-icon>\n						<label>Email</label>\n					</div>\n				</button>\n\n				<button *ngIf=session.btnNotesShow ion-button outline (tap)="navToNotes(session.EventID)">\n					<div>\n						<ion-icon name="create"></ion-icon>\n						<label>Note</label>\n					</div>\n				</button>\n<!--				\n			</div>\n			\n		</ion-item>\n	<ion-list>\n</ion-content>\n-->'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/listinglevel1/listinglevel1.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */]) === "function" ? _a : Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */]) === "function" ? _b : Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]) === "function" ? _c : Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */]) === "function" ? _d : Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" ? _e : Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */]) === "function" ? _f : Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */]) === "function" ? _g : Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]) === "function" ? _h : Object, typeof (_j = typeof __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]) === "function" ? _j : Object])
], ListingLevel1);

//# sourceMappingURL=listinglevel1.js.map

/***/ })

});
//# sourceMappingURL=7.js.map