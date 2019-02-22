webpackJsonp([23],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Synchronization; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_sqlite__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
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






// Global URL and conference year reference used for all AJAX-to-MySQL calls
var SyncURLReference = "https://aacdmobile.convergence-us.com/cvPlanner.php?";
let Synchronization = class Synchronization {
    constructor(platform, httpCall, alertCtrl, events, sqlite, localstorage) {
        this.platform = platform;
        this.httpCall = httpCall;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.sqlite = sqlite;
        this.localstorage = localstorage;
    }
    // -----------------------------------
    // Push Notification
    // 
    // Sends token, logged in user, device type to database
    // -----------------------------------
    SendPushRecord(ptokenID, pattendeeID, pUserName, pDeviceType, pSyncType) {
        console.log("PushSync Begin Token ID = " + ptokenID + ", Attendee ID = " + pattendeeID + ", User Name = " + pUserName + ", Device Type = " + pDeviceType + ", Sync Type = " + pSyncType);
        let qp = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* URLSearchParams */]();
        qp.set('action', 'push');
        qp.set('TokenID', ptokenID);
        qp.set('AttendeeID', pattendeeID);
        qp.set('UserName', pUserName);
        qp.set('DeviceType', pDeviceType);
        qp.set('SyncType', pSyncType);
        qp.set('acy', '2018');
        let options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ params: qp });
        return new Promise(resolve => {
            this.httpCall.get(SyncURLReference, options).subscribe(response => {
                console.log("PushSync Success Data returned: " + JSON.stringify(response));
                resolve(response.json());
            }, err => {
                console.log("PushSync Error Data returned: " + JSON.stringify(err) + " Status: " + err);
                if (err.status == "412") {
                    console.log("App and API versions don't match.");
                    var emptyJSONArray = {};
                    resolve(emptyJSONArray);
                }
                else {
                    console.log(err.status);
                    console.log("API Error: ", err);
                }
            });
        });
    }
    // -----------------------------------
    // Messaging: Direct Chat Monitoring
    // 
    // Get new message indicators for time period specified
    // 
    // -----------------------------------
    DirectChatMonitor(LastSync, ThisSync) {
        var flags = "ck|0|0|0|" + LastSync + "|" + ThisSync;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        // Perform query against server-based MySQL database
        var url = SyncURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
        //console.log('Sync, Direct Chat Monitoring: ' + url);
        return new Promise(resolve => {
            this.httpCall.get(url).subscribe(data3 => {
                let data = [];
                //console.log('Sync, Direct Chat Monitoring: ' + JSON.stringify(data3.json()));
                data = data3.json();
                //console.log('Sync, Direct Chat Monitoring: Records: ' + data['length']);
                resolve(data);
            }, err => {
                console.log("PushSync Error Data returned: " + JSON.stringify(err) + " Status: " + err);
                if (err.status == "412") {
                    console.log("App and API versions don't match.");
                    var emptyJSONArray = {};
                    resolve(emptyJSONArray);
                }
                else {
                    console.log(err.status);
                    console.log("API Error: ", err);
                }
            });
        });
    }
    // -----------------------------------
    // Database call for M2S
    // -----------------------------------
    DBCallQuery(SQLSelectQuery, SQLInsertQuery, SQLUpdateQuery, SQLQueryDelete) {
        //console.log('DBCall: ' + SQLSelectQuery);
        return new Promise(resolve => {
            this.sqlite.create({ name: 'cvPlanner.db', location: 'default' }).then((db) => {
                this.db = db;
                if (SQLQueryDelete != 'NO') {
                    this.db.executeSql(SQLQueryDelete, {}).then((dataS) => {
                        console.log('DBCall Return: ' + JSON.stringify(dataS));
                        resolve(SQLInsertQuery);
                    })
                        .catch(e => console.log('Sync DBCall: Error selecting (' + SQLSelectQuery + ') base record: ' + JSON.stringify(e)));
                }
                else {
                    this.db.executeSql(SQLSelectQuery, {}).then((dataS) => {
                        console.log('DBCall Return: ' + JSON.stringify(dataS));
                        if (dataS.rows.length > 0) {
                            //console.log('DBCall: ' + SQLUpdateQuery);
                            resolve(SQLUpdateQuery);
                        }
                        else {
                            //console.log('DBCall: ' + SQLInsertQuery);
                            resolve(SQLInsertQuery);
                        }
                    })
                        .catch(e => console.log('Sync DBCall: Error selecting (' + SQLSelectQuery + ') base record: ' + JSON.stringify(e)));
                }
            });
        });
    }
    DBCallQuery2(SQLQuery) {
        //console.log('DBCall2: ' + SQLQuery);
        return new Promise(resolve => {
            this.sqlite.create({ name: 'cvPlanner.db', location: 'default' }).then((db) => {
                this.db = db;
                this.db.executeSql(SQLQuery, {}).then((dataS) => {
                    resolve(SQLQuery);
                })
                    .catch(e => console.log('Sync DBCall2: Error selecting (' + SQLQuery + ') base record: ' + JSON.stringify(e)));
            });
        });
    }
    // -----------------------------------
    // Database call for S2M
    // -----------------------------------
    DBGetData(QueryType, SQLQuery) {
        console.log('DBGetData: ' + SQLQuery);
        return new Promise(resolve => {
            this.sqlite.create({ name: 'cvPlanner.db', location: 'default' }).then((db) => {
                this.db = db;
                let DatabaseResponse = [];
                this.db.executeSql(SQLQuery, {}).then((dataS) => {
                    console.log('DBGetData: Response: ' + JSON.stringify(dataS));
                    if (dataS.rows.length > 0) {
                        if (QueryType == "itinerary") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    mtgID: dataS.rows.item(i).mtgID,
                                    Date_Start: dataS.rows.item(i).Date_Start,
                                    Date_End: dataS.rows.item(i).Date_End,
                                    Time_Start: dataS.rows.item(i).Time_Start,
                                    Time_End: dataS.rows.item(i).Time_End,
                                    Subject: dataS.rows.item(i).Subject,
                                    Location: dataS.rows.item(i).Location,
                                    Description: dataS.rows.item(i).Description,
                                    atID: dataS.rows.item(i).atID,
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    EventID: dataS.rows.item(i).EventID,
                                    LastUpdated: dataS.rows.item(i).LastUpdated,
                                    UpdateType: dataS.rows.item(i).UpdateType
                                });
                            }
                        }
                        if (QueryType == "evaluations") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    session_id: dataS.rows.item(i).session_id,
                                    evaluationType: dataS.rows.item(i).evaluationType,
                                    Q11: dataS.rows.item(i).Q11,
                                    Q12: dataS.rows.item(i).Q12,
                                    Q21: dataS.rows.item(i).Q21,
                                    Q22: dataS.rows.item(i).Q22,
                                    Q23: dataS.rows.item(i).Q23,
                                    Q24: dataS.rows.item(i).Q24,
                                    Q25: dataS.rows.item(i).Q25,
                                    Q26: dataS.rows.item(i).Q26,
                                    Q31: dataS.rows.item(i).Q31,
                                    Q32: dataS.rows.item(i).Q32,
                                    Q33: dataS.rows.item(i).Q33,
                                    Q41: dataS.rows.item(i).Q41,
                                    LastUpdated: dataS.rows.item(i).LastUpdated,
                                    UpdateType: dataS.rows.item(i).UpdateType
                                });
                            }
                        }
                        if (QueryType == "evaluation_conference") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    session_id: dataS.rows.item(i).session_id,
                                    evaluationType: dataS.rows.item(i).evaluationType,
                                    Q1: dataS.rows.item(i).Q1,
                                    Q2: dataS.rows.item(i).Q2,
                                    Q3: dataS.rows.item(i).Q3,
                                    Q4: dataS.rows.item(i).Q4,
                                    Q5: dataS.rows.item(i).Q5,
                                    Q5C: dataS.rows.item(i).Q5C,
                                    Q6: dataS.rows.item(i).Q6,
                                    Q7: dataS.rows.item(i).Q7,
                                    Q7C: dataS.rows.item(i).Q7C,
                                    Q8: dataS.rows.item(i).Q8,
                                    Q9: dataS.rows.item(i).Q9,
                                    Q10: dataS.rows.item(i).Q10,
                                    Q10C: dataS.rows.item(i).Q10C,
                                    Q11: dataS.rows.item(i).Q11,
                                    Q11C: dataS.rows.item(i).Q11C,
                                    LastUpdated: dataS.rows.item(i).LastUpdated,
                                    UpdateType: dataS.rows.item(i).UpdateType
                                });
                            }
                        }
                        if (QueryType == "attendee_notes") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    EventID: dataS.rows.item(i).EventID,
                                    Note: dataS.rows.item(i).Note,
                                    LastUpdated: dataS.rows.item(i).LastUpdated,
                                    UpdateType: dataS.rows.item(i).UpdateType
                                });
                            }
                        }
                        if (QueryType == "activities_feed") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    afDateTime: dataS.rows.item(i).afDateTime,
                                    afChatCounter: dataS.rows.item(i).afChatCounter,
                                    afLikesCounter: dataS.rows.item(i).afLikesCounter,
                                    afMessage: dataS.rows.item(i).afMessage,
                                    afImageAttachment: dataS.rows.item(i).afImageAttachment,
                                    DateAdded: dataS.rows.item(i).DateAdded,
                                    UpdateType: dataS.rows.item(i).UpdateType
                                });
                            }
                        }
                        if (QueryType == "activities_feed_comments") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    afID: dataS.rows.item(i).afID,
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    afcComment: dataS.rows.item(i).afcComment,
                                    afcDateAdded: dataS.rows.item(i).afcDateAdded,
                                    afcUpdateType: dataS.rows.item(i).afcUpdateType
                                });
                            }
                        }
                        if (QueryType == "attendee_bookmarks") {
                            for (let i = 0; i < dataS.rows.length; i++) {
                                DatabaseResponse.push({
                                    AttendeeID: dataS.rows.item(i).AttendeeID,
                                    BookmarkType: dataS.rows.item(i).BookmarkType,
                                    BookmarkID: dataS.rows.item(i).BookmarkID,
                                    DateAdded: dataS.rows.item(i).DateAdded,
                                    UpdateType: dataS.rows.item(i).UpdateType
                                });
                            }
                        }
                        resolve(DatabaseResponse);
                    }
                    else {
                        resolve(DatabaseResponse);
                    }
                })
                    .catch(e => console.log('Sync DBGetData: Error selecting (' + SQLQuery + ') base record: ' + JSON.stringify(e)));
            });
        });
    }
    // -----------------------------------
    // Database Sync
    // 
    // Updated records: MySQL to SQLite
    // 
    // -----------------------------------
    DBSyncUpdateM2S(LastSync, ThisSync) {
        var flags = "UpdateM2S|" + LastSync + "|" + ThisSync;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        // Perform query against server-based MySQL database
        var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
        console.log('Sync UpdateM2S: ' + url);
        return new Promise(resolve => {
            this.httpCall.get(url).subscribe(data3 => {
                let data = [];
                console.log('Sync NewM2S: ' + JSON.stringify(data3.json()));
                data = data3.json();
                console.log('Sync UpdateM2S: Records: ' + data['length']);
                if (data['length'] > 0) {
                    // Parse records and insert into SQLite DB
                    var SQLQuerySelect = "";
                    var SQLQueryInsert = "";
                    var SQLQueryUpdate = "";
                    var SQLQueryDelete = "";
                    var DBCallOutput = "";
                    var DBCallOutput2 = "";
                    for (var i = 0; i < data['length']; i++) {
                        SQLQuerySelect = "";
                        SQLQueryInsert = "";
                        SQLQueryUpdate = "";
                        SQLQueryDelete = "";
                        //console.log('Sync UpdateM2S: Creating query for: ' + data[i].TableName);
                        // Determine query to use based on table name
                        switch (data[i].TableName) {
                            case "courses":
                                SQLQuerySelect = "SELECT * FROM courses WHERE session_id = '" + data[i].session_id + "'";
                                SQLQueryInsert = "INSERT INTO courses(";
                                SQLQueryInsert = SQLQueryInsert + "session_id, session_title, description, ";
                                SQLQueryInsert = SQLQueryInsert + "session_start_time, session_end_time, primary_speaker, ";
                                SQLQueryInsert = SQLQueryInsert + "other_speakers, course_id, subject, ";
                                SQLQueryInsert = SQLQueryInsert + "cs_credits, ce_credits_type, room_number, ";
                                SQLQueryInsert = SQLQueryInsert + "verification_code, nadl_verification, type, ";
                                SQLQueryInsert = SQLQueryInsert + "level, speaker_host_emcee, room_capacity, ";
                                SQLQueryInsert = SQLQueryInsert + "course_topics, ActiveYN, corporate_supporter, ";
                                SQLQueryInsert = SQLQueryInsert + "session_recording, HandoutFilename, CEcreditsL, ";
                                SQLQueryInsert = SQLQueryInsert + "CEcreditsP, SearchField) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].session_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_title + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].description + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_start_time + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_end_time + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].primary_speaker + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].other_speakers + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].course_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].subject + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].cs_credits + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ce_credits_type + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].room_number + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].verification_code + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].nadl_verification + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].type + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].level + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].speaker_host_emcee + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].room_capacity + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].course_topics + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].corporate_supporter + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_recording + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].HandoutFilename + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].CEcreditsL + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].CEcreditsP + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "')";
                                SQLQueryUpdate = "UPDATE courses ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET session_title = '" + data[i].session_title + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "description = '" + data[i].description + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "session_start_time = '" + data[i].session_start_time + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "session_end_time = '" + data[i].session_end_time + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "primary_speaker = '" + data[i].primary_speaker + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "other_speakers = '" + data[i].other_speakers + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "course_id = '" + data[i].course_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "subject = '" + data[i].subject + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "cs_credits = '" + data[i].cs_credits + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ce_credits_type = '" + data[i].ce_credits_type + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "room_number = '" + data[i].room_number + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "verification_code = '" + data[i].verification_code + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "type = '" + data[i].type + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "level = '" + data[i].level + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "speaker_host_emcee = '" + data[i].speaker_host_emcee + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "room_capacity = '" + data[i].room_capacity + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "course_topics = '" + data[i].course_topics + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].ActiveYN + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "corporate_supporter = '" + data[i].corporate_supporter + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "session_recording = '" + data[i].session_recording + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "HandoutFilename = '" + data[i].HandoutFilename + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "CEcreditsL = '" + data[i].CEcreditsL + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "CEcreditsP = '" + data[i].CEcreditsP + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE session_id = '" + data[i].session_id + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "itinerary":
                                SQLQuerySelect = "SELECT * FROM itinerary ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND mtgID = '" + data[i].mtgID + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND EventID = '" + data[i].EventID + "' ";
                                SQLQueryInsert = "INSERT INTO itinerary(";
                                SQLQueryInsert = SQLQueryInsert + "mtgID, Date_Start, ";
                                SQLQueryInsert = SQLQueryInsert + "Date_End, Time_Start, Time_End, ";
                                SQLQueryInsert = SQLQueryInsert + "Subject, Location, Description, ";
                                SQLQueryInsert = SQLQueryInsert + "atID, AttendeeID, EventID, ";
                                SQLQueryInsert = SQLQueryInsert + "LastUpdated, UpdateType) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].mtgID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Date_Start + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Date_End + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Time_Start + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Time_End + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Subject + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Location + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Description + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].atID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].AttendeeID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].EventID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastUpdated + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";
                                SQLQueryUpdate = "UPDATE itinerary ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET Date_Start = '" + data[i].Date_Start + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Date_End = '" + data[i].Date_End + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Time_Start = '" + data[i].Time_Start + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Time_End = '" + data[i].Time_End + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Subject = '" + data[i].Subject + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Location = '" + data[i].Location + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Description = '" + data[i].Description + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "LastUpdated = '" + data[i].LastUpdated + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND mtgID = '" + data[i].mtgID + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND EventID = '" + data[i].EventID + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "attendee_ces":
                                SQLQuerySelect = "SELECT * FROM attendee_ces ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND session_id = '" + data[i].session_id + "' ";
                                SQLQueryInsert = "INSERT INTO attendee_ces(";
                                SQLQueryInsert = SQLQueryInsert + "AttendeeID, session_id, course_id, ";
                                SQLQueryInsert = SQLQueryInsert + "scannedYN, evalID, DateAdded, LastUpdated, ceNotes, ";
                                SQLQueryInsert = SQLQueryInsert + "UpdateType) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].AttendeeID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].course_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].scannedYN + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].evalID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastUpdated + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ceNotes + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";
                                SQLQueryUpdate = "UPDATE attendee_ces ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET AttendeeID = '" + data[i].AttendeeID + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "session_id = '" + data[i].session_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "course_id = '" + data[i].course_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "scannedYN = '" + data[i].scannedYN + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "evalID = '" + data[i].evalID + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "LastUpdated = '" + data[i].LastUpdated + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ceNotes = '" + data[i].ceNotes + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND session_id = '" + data[i].session_id + "' ";
                                SQLQueryDelete = "DELETE FROM attendee_ces ";
                                SQLQueryDelete = SQLQueryDelete + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryDelete = SQLQueryDelete + "AND session_id = '" + data[i].session_id + "' ";
                                break;
                            case "courses_speakers":
                                SQLQuerySelect = "SELECT * FROM courses_speakers WHERE speakerID = '" + data[i].speakerID + "'";
                                SQLQueryInsert = "INSERT INTO courses_speakers(";
                                SQLQueryInsert = SQLQueryInsert + "speakerID, FullName, FirstName, LastName, ";
                                SQLQueryInsert = SQLQueryInsert + "Credentials, Bio, Title, Company, Courses, imageFilename, email, ";
                                SQLQueryInsert = SQLQueryInsert + "Website, SearchField, ActiveYN) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].speakerID + ", ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].FullName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].FirstName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Credentials + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Bio + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Title + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Company + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Courses + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].imageFilename + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].email + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Website + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "')";
                                SQLQueryUpdate = "UPDATE courses_speakers ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET FullName = '" + data[i].FullName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "FirstName = '" + data[i].FirstName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "LastName = '" + data[i].LastName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Credentials = '" + data[i].Credentials + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Bio = '" + data[i].Bio + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Title = '" + data[i].Title + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Company = '" + data[i].Company + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Courses = '" + data[i].Courses + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "imageFilename = '" + data[i].imageFilename + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "email = '" + data[i].email + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Website = '" + data[i].SearchField + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].SearchField + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE speakerID = '" + data[i].speakerID + "' ";
                                SQLQueryDelete = "DELETE FROM courses_speakers ";
                                SQLQueryDelete = SQLQueryDelete + "WHERE speakerID = '" + data[i].speakerID + "' ";
                                break;
                            case "exhibitors":
                                SQLQuerySelect = "SELECT * FROM exhibitors WHERE ExhibitorID = " + data[i].ExhibitorID;
                                SQLQueryInsert = "INSERT INTO exhibitors(";
                                SQLQueryInsert = SQLQueryInsert + "ExhibitorID, ClientExhibitorID, CompanyName, ";
                                SQLQueryInsert = SQLQueryInsert + "AddressLine1, AddressLine2, City, ";
                                SQLQueryInsert = SQLQueryInsert + "State, ZipPostalCode, Country, ";
                                SQLQueryInsert = SQLQueryInsert + "Website, PrimaryOnsiteContactName, PrimaryOnsiteContactEmail, ";
                                SQLQueryInsert = SQLQueryInsert + "PrimaryOnsiteContactPhone, BoothNumber, ProductsServices, ";
                                SQLQueryInsert = SQLQueryInsert + "CompanyDescription, SearchField, SocialMediaFacebook, ";
                                SQLQueryInsert = SQLQueryInsert + "SocialMediaTwitter, SocialMediaGooglePlus, SocialMediaYouTube, ";
                                SQLQueryInsert = SQLQueryInsert + "SocialMediaLinkedIn) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].ExhibitorID + ", ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ClientExhibitorID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].CompanyName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].AddressLine1 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].AddressLine2 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].City + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].State + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ZipPostalCode + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Country + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Website + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].PrimaryOnsiteContactName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].PrimaryOnsiteContactEmail + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].PrimaryOnsiteContactPhone + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].BoothNumber + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ProductsServices + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].CompanyDescription + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaFacebook + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaTwitter + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaGooglePlus + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaYouTube + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SocialMediaLinkedIn + "')";
                                SQLQueryUpdate = "UPDATE exhibitors ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET CompanyName = '" + data[i].CompanyName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "AddressLine1 = '" + data[i].AddressLine1 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "AddressLine2 = '" + data[i].AddressLine2 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "City = '" + data[i].City + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "State = '" + data[i].State + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ZipPostalCode = '" + data[i].ZipPostalCode + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Country = '" + data[i].Country + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Website = '" + data[i].Website + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "PrimaryOnsiteContactName = '" + data[i].PrimaryOnsiteContactName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "PrimaryOnsiteContactEmail = '" + data[i].PrimaryOnsiteContactEmail + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "PrimaryOnsiteContactPhone = '" + data[i].PrimaryOnsiteContactPhone + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "BoothNumber = '" + data[i].BoothNumber + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ProductsServices = '" + data[i].ProductsServices + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "CompanyDescription = '" + data[i].CompanyDescription + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SocialMediaFacebook = '" + data[i].SocialMediaFacebook + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SocialMediaTwitter = '" + data[i].SocialMediaTwitter + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SocialMediaGooglePlus = '" + data[i].SocialMediaGooglePlus + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SocialMediaYouTube = '" + data[i].SocialMediaYouTube + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SocialMediaLinkedIn = '" + data[i].SocialMediaLinkedIn + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE ExhibitorID = " + data[i].ExhibitorID + " ";
                                SQLQueryDelete = "NO";
                                break;
                            case "attendee_courses":
                                SQLQuerySelect = "SELECT * FROM attendee_courses ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE ct_id = '" + data[i].ct_id + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND session_id = '" + data[i].session_id + "' ";
                                SQLQueryInsert = "INSERT INTO attendee_courses(";
                                SQLQueryInsert = SQLQueryInsert + "ct_id, bt_imis_id, st_imis_id, ";
                                SQLQueryInsert = SQLQueryInsert + "quantity, subevent_id, session_id, waitlist, test) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].ct_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].bt_imis_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].st_imis_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].quantity + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].subevent_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].waitlist + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].test + "')";
                                SQLQueryUpdate = "UPDATE attendee_courses ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET bt_imis_id = '" + data[i].bt_imis_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "st_imis_id = '" + data[i].st_imis_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "quantity = '" + data[i].quantity + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "subevent_id = '" + data[i].subevent_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "session_id = '" + data[i].session_id + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "waitlist = '" + data[i].waitlist + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "test = '" + data[i].test + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE ct_id = '" + data[i].ct_id + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND session_id = '" + data[i].session_id + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "attendee_notes":
                                SQLQuerySelect = "SELECT * FROM attendee_notes ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND EventID = '" + data[i].session_id + "' ";
                                SQLQueryInsert = "INSERT INTO attendee_notes(";
                                SQLQueryInsert = SQLQueryInsert + "AttendeeID, EventID, Note, ";
                                SQLQueryInsert = SQLQueryInsert + "LastUpdated, UpdateType) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].AttendeeID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].EventID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Note + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastUpdated + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";
                                SQLQueryUpdate = "UPDATE attendee_notes ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET Note = '" + data[i].Date_Start + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "LastUpdated = '" + data[i].Date_End + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].Time_Start + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND EventID = '" + data[i].EventID + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "evaluations":
                                SQLQuerySelect = "SELECT * FROM evaluations WHERE AttendeeID = '" + data[i].AttendeeID + "' AND evaluationType = '" + data[i].evaluationType + "' AND session_id = '" + data[i].session_id + "'";
                                SQLQueryInsert = "INSERT INTO evaluations(";
                                SQLQueryInsert = SQLQueryInsert + "AttendeeID, evalID, session_id, evaluationType, ";
                                SQLQueryInsert = SQLQueryInsert + "Q11, Q12, Q21, Q22, Q23, Q24, Q25, Q26, ";
                                SQLQueryInsert = SQLQueryInsert + "Q31, Q32, Q33, Q41) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].AttendeeID + ", ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].evalID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].session_id + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].evaluationType + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q11 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q12 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q21 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q22 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q23 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q24 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q25 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q26 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q31 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q32 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q33 + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Q41 + "')";
                                SQLQueryUpdate = "UPDATE evaluations ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET Q11 = '" + data[i].Q11 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q12 = '" + data[i].Q12 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q21 = '" + data[i].Q21 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q22 = '" + data[i].Q22 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q23 = '" + data[i].Q23 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q24 = '" + data[i].Q24 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q25 = '" + data[i].Q25 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q26 = '" + data[i].Q26 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q31 = '" + data[i].Q31 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q32 = '" + data[i].Q32 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q33 = '" + data[i].Q33 + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Q41 = '" + data[i].Q41 + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND session_id = '" + data[i].session_id + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND evaluationType = '" + data[i].evaluationType + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "activities_feed":
                                SQLQuerySelect = "SELECT afID FROM activities_feed ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE afID = '" + data[i].afID + "' ";
                                SQLQueryInsert = "INSERT INTO activities_feed(";
                                SQLQueryInsert = SQLQueryInsert + "afID, AttendeeID, afDateTime, afChatCounter, ";
                                SQLQueryInsert = SQLQueryInsert + "afLikesCounter, afMessage, afImageAttachment, DateAdded, UpdateType) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].afID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].AttendeeID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].afDateTime + "', ";
                                SQLQueryInsert = SQLQueryInsert + " " + data[i].afChatCounter + ", ";
                                SQLQueryInsert = SQLQueryInsert + " " + data[i].afLikesCounter + ", ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].afMessage.replace(/'/g, "''") + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].afImageAttachment + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";
                                SQLQueryUpdate = "UPDATE activities_feed ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET afChatCounter = " + data[i].afChatCounter + ", ";
                                SQLQueryUpdate = SQLQueryUpdate + "afLikesCounter = " + data[i].afLikesCounter + ", ";
                                SQLQueryUpdate = SQLQueryUpdate + "afMessage = '" + data[i].afMessage.replace(/'/g, "''") + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "afImageAttachment = '" + data[i].afImageAttachment + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE afID = '" + data[i].afID + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "attendees":
                                SQLQuerySelect = "SELECT AttendeeID FROM attendees ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryInsert = "INSERT INTO attendees(";
                                SQLQueryInsert = SQLQueryInsert + "AttendeeID, FirstName, LastName, Title, ";
                                SQLQueryInsert = SQLQueryInsert + "Company, ActiveYN, City, State, Country, avatarFilename, badge, SearchField, ";
                                SQLQueryInsert = SQLQueryInsert + "smTwitter, showTwitter, smFaceBook, showFacebook, ";
                                SQLQueryInsert = SQLQueryInsert + "smLinkedIn, showLinkedIn, smInstagram, showInstagram, smPinterest, showPinterest) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].AttendeeID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].FirstName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].LastName + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Title + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Company + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].ActiveYN + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].City + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].State + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].Country + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].avatarFilename + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].badge + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].SearchField + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].smTwitter + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].showTwitter + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].smFaceBook + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].showFacebook + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].smLinkedIn + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].showLinkedIn + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].smInstagram + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].showInstagram + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].smPinterest + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].showPinterest + "')";
                                SQLQueryUpdate = "UPDATE attendees ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET FirstName = '" + data[i].FirstName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "LastName = '" + data[i].LastName + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Title = '" + data[i].Title + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Company = '" + data[i].Company + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "ActiveYN = '" + data[i].ActiveYN + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "City = '" + data[i].City + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "State = '" + data[i].State + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "Country = '" + data[i].Country + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "avatarFilename = '" + data[i].avatarFilename + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "badge = '" + data[i].badge + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "SearchField = '" + data[i].SearchField + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "smTwitter = '" + data[i].smTwitter + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "showTwitter = '" + data[i].showTwitter + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "smFaceBook = '" + data[i].smFaceBook + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "showFacebook = '" + data[i].showFacebook + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "smLinkedIn = '" + data[i].smLinkedIn + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "showLinkedIn = '" + data[i].showLinkedIn + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "smInstagram = '" + data[i].smInstagram + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "showInstagram = '" + data[i].showInstagram + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "smPinterest = '" + data[i].smPinterest + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "showPinterest = '" + data[i].showPinterest + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryDelete = "NO";
                                break;
                            case "notifications":
                                SQLQuerySelect = "SELECT * FROM attendee_push_notifications ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE pushTitle = '" + data[i].pushTitle + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND pushMessage = '" + data[i].pushMessage + "' ";
                                //SQLQuerySelect = SQLQuerySelect + "AND pushDateTimeReceived = '" + data[i].pushDateTimeReceived + "' ";
                                SQLQueryInsert = "INSERT INTO attendee_push_notifications(";
                                SQLQueryInsert = SQLQueryInsert + "pnID, pushTitle, pushMessage, pushDateTimeReceived) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES('" + data[i].pnID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].pushTitle + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].pushMessage + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].pushDateTimeReceived + "')";
                                SQLQueryUpdate = "NO";
                                SQLQueryDelete = "NO";
                                console.log('DB, Notifications, SQLQuerySelect: ' + SQLQuerySelect + ', SQLQueryInsert: ' + SQLQueryInsert);
                                break;
                            case "attendee_bookmarks":
                                SQLQuerySelect = "SELECT * FROM attendee_bookmarks ";
                                SQLQuerySelect = SQLQuerySelect + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND BookmarkType = '" + data[i].BookmarkType + "' ";
                                SQLQuerySelect = SQLQuerySelect + "AND BookmarkID = '" + data[i].BookmarkID + "' ";
                                SQLQueryInsert = "INSERT INTO attendee_bookmarks(";
                                SQLQueryInsert = SQLQueryInsert + "abID, AttendeeID, BookmarkType, BookmarkID, ";
                                SQLQueryInsert = SQLQueryInsert + "DateAdded, UpdateType) ";
                                SQLQueryInsert = SQLQueryInsert + "VALUES(" + data[i].abID + ", ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].AttendeeID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].BookmarkType + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].BookmarkID + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].DateAdded + "', ";
                                SQLQueryInsert = SQLQueryInsert + "'" + data[i].UpdateType + "')";
                                SQLQueryUpdate = "UPDATE attendee_bookmarks ";
                                SQLQueryUpdate = SQLQueryUpdate + "SET BookmarkType = '" + data[i].BookmarkType + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "BookmarkID = '" + data[i].BookmarkID + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "DateAdded = '" + data[i].DateAdded + "', ";
                                SQLQueryUpdate = SQLQueryUpdate + "UpdateType = '" + data[i].UpdateType + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND BookmarkType = '" + data[i].BookmarkType + "' ";
                                SQLQueryUpdate = SQLQueryUpdate + "AND BookmarkID = '" + data[i].BookmarkID + "' ";
                                SQLQueryDelete = "DELETE FROM attendee_bookmarks ";
                                SQLQueryDelete = SQLQueryDelete + "WHERE AttendeeID = '" + data[i].AttendeeID + "' ";
                                SQLQueryDelete = SQLQueryDelete + "AND BookmarkType = '" + data[i].BookmarkType + "' ";
                                SQLQueryDelete = SQLQueryDelete + "AND BookmarkID = '" + data[i].BookmarkID + "' ";
                                break;
                            case "duplicateexhibitors":
                                SQLQuerySelect = "SELECT COUNT(*) FROM exhibitors";
                                SQLQueryInsert = "SELECT COUNT(*) FROM exhibitors";
                                SQLQueryUpdate = "DELETE FROM exhibitors WHERE rowid NOT IN (SELECT max(rowid) FROM exhibitors GROUP BY ExhibitorID)";
                                SQLQueryDelete = "NO";
                                break;
                            case "duplicatecourses":
                                SQLQuerySelect = "SELECT COUNT(*) FROM courses";
                                SQLQueryInsert = "SELECT COUNT(*) FROM courses";
                                SQLQueryUpdate = "DELETE FROM courses WHERE rowid NOT IN (SELECT max(rowid) FROM courses GROUP BY session_id)";
                                SQLQueryDelete = "NO";
                                break;
                            case "duplicatespeakers":
                                SQLQuerySelect = "SELECT COUNT(*) FROM courses_speakers";
                                SQLQueryInsert = "SELECT COUNT(*) FROM courses_speakers";
                                SQLQueryUpdate = "DELETE FROM courses_speakers WHERE rowid NOT IN (SELECT max(rowid) FROM courses_speakers GROUP BY speakerID)";
                                SQLQueryDelete = "NO";
                                break;
                            case "duplicateces":
                                SQLQuerySelect = "SELECT COUNT(*) FROM attendee_ces";
                                SQLQueryInsert = "SELECT COUNT(*) FROM attendee_ces";
                                SQLQueryUpdate = "DELETE FROM attendee_ces WHERE rowid NOT IN (SELECT max(rowid) FROM attendee_ces GROUP BY AttendeeID, session_id)";
                                SQLQueryDelete = "NO";
                                break;
                            case "duplicateattendeecourses":
                                SQLQuerySelect = "SELECT COUNT(*) FROM attendee_courses";
                                SQLQueryInsert = "SELECT COUNT(*) FROM attendee_courses";
                                SQLQueryUpdate = "DELETE FROM attendee_courses WHERE rowid NOT IN (SELECT max(rowid) FROM attendee_courses GROUP BY ct_id, session_id)";
                                SQLQueryDelete = "NO";
                                break;
                        }
                        // Execute the custom SQL query to insert or update a record in the local database
                        this.DBCallQuery(SQLQuerySelect, SQLQueryInsert, SQLQueryUpdate, SQLQueryDelete).then(DBCallOutput => {
                            //console.log('DBCallOutput: ' + DBCallOutput);
                            //console.log('DBCallQuery output: ' + DBCallOutput);
                            this.DBCallQuery2(DBCallOutput);
                        });
                    }
                }
                // Done
                if (data['length'] > 0) {
                    // Send event notice to update left hand menu
                    this.events.publish('user:Status', 'Sync Update');
                    // Send event notice to update CE Tracker list
                    //this.events.publish('sync:Status', 'Sync Update');
                }
                resolve("Done");
            }, err => {
                if (err.status == "412") {
                    console.log("App and API versions don't match.");
                    resolve("Error");
                }
                else {
                    console.log(err.status);
                    console.log("API Error: ", JSON.stringify(err));
                }
            });
        });
    }
    // -----------------------------------
    // Database Sync
    // 
    // Updated records: SQLite to MySQL
    // 
    // -----------------------------------
    DBSyncUpdateS2M(LastSync, ThisSync) {
        var flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var SQLQuery = "";
        var QueryType = "";
        // Get changed records in SQLite
        // Sync Itinerary
        SQLQuery = "SELECT * FROM itinerary ";
        SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
        SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
        QueryType = "itinerary";
        console.log('Sync UpdateS2M: Starting sync');
        return new Promise(resolve => {
            console.log('Sync UpdateS2M: Itinerary query: ' + SQLQuery);
            this.DBGetData(QueryType, SQLQuery).then(data => {
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
                        flags = flags + "|itinerary";
                        flags = flags + "|" + data[i].mtgID;
                        flags = flags + "|" + data[i].Date_Start;
                        flags = flags + "|" + data[i].Date_End;
                        flags = flags + "|" + data[i].Time_Start;
                        flags = flags + "|" + data[i].Time_End;
                        flags = flags + "|" + data[i].Subject;
                        flags = flags + "|" + data[i].Location;
                        flags = flags + "|" + data[i].Description;
                        flags = flags + "|" + data[i].atID;
                        flags = flags + "|" + data[i].AttendeeID;
                        flags = flags + "|" + data[i].EventID;
                        flags = flags + "|" + data[i].LastUpdated;
                        flags = flags + "|" + data[i].UpdateType;
                        var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
                        //return new Promise(resolve => {
                        console.log('Sync UpdateS2M: Itinerary URL: ' + url);
                        this.httpCall.get(url).subscribe(data3 => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
                            //resolve("Done");
                        }, err => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
                            //resolve("Error");
                        });
                        //});
                    }
                }
            });
            // Sync Evaluations (lectures/workshops)
            SQLQuery = "SELECT session_id, evaluationType, Q11, Q12, Q21, Q22, Q23, Q24, Q25, Q26, Q31, Q32, Q33, Q41, LastUpdated, UpdateType FROM evaluations ";
            SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
            //SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
            QueryType = "evaluations";
            console.log('Sync UpdateS2M: Evaluations (lectures/workshops) query: ' + SQLQuery);
            this.DBGetData(QueryType, SQLQuery).then(data => {
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
                        flags = flags + "|evaluations";
                        flags = flags + "|" + data[i].AttendeeID;
                        flags = flags + "|" + data[i].session_id;
                        flags = flags + "|" + data[i].evaluationType;
                        flags = flags + "|" + data[i].Q11;
                        flags = flags + "|" + data[i].Q12;
                        flags = flags + "|" + data[i].Q21;
                        flags = flags + "|" + data[i].Q22;
                        flags = flags + "|" + data[i].Q23;
                        flags = flags + "|" + data[i].Q24;
                        flags = flags + "|" + data[i].Q25;
                        flags = flags + "|" + data[i].Q26;
                        flags = flags + "|" + data[i].Q31;
                        flags = flags + "|" + data[i].Q32;
                        flags = flags + "|" + data[i].Q33;
                        flags = flags + "|" + data[i].Q41;
                        flags = flags + "|" + data[i].LastUpdated;
                        flags = flags + "|" + data[i].UpdateType;
                        var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
                        //return new Promise(resolve => {
                        console.log('Sync UpdateS2M: Evaluations (lectures/workshops) URL: ' + url);
                        this.httpCall.get(url).subscribe(data3 => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
                            //resolve("Done");
                        }, err => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
                            //resolve("Error");
                        });
                        //});
                    }
                }
            });
            // Sync Evaluations (conference)
            SQLQuery = "SELECT * FROM evaluation_conference ";
            SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
            //SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
            QueryType = "evaluation_conference";
            console.log('Sync UpdateS2M: Evaluations (conference) query: ' + SQLQuery);
            this.DBGetData(QueryType, SQLQuery).then(data => {
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
                        flags = flags + "|evaluation_conference";
                        flags = flags + "|" + data[i].AttendeeID;
                        flags = flags + "|" + data[i].session_id;
                        flags = flags + "|" + data[i].evaluationType;
                        flags = flags + "|" + data[i].Q1;
                        flags = flags + "|" + data[i].Q2;
                        flags = flags + "|" + data[i].Q3;
                        flags = flags + "|" + data[i].Q4;
                        flags = flags + "|" + data[i].Q5;
                        flags = flags + "|" + data[i].Q5C;
                        flags = flags + "|" + data[i].Q6;
                        flags = flags + "|" + data[i].Q7;
                        flags = flags + "|" + data[i].Q7C;
                        flags = flags + "|" + data[i].Q8;
                        flags = flags + "|" + data[i].Q9;
                        flags = flags + "|" + data[i].Q10;
                        flags = flags + "|" + data[i].Q10C;
                        flags = flags + "|" + data[i].Q11;
                        flags = flags + "|" + data[i].Q11C;
                        flags = flags + "|" + data[i].LastUpdated;
                        flags = flags + "|" + data[i].UpdateType;
                        var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
                        //return new Promise(resolve => {
                        console.log('Sync UpdateS2M: Evaluations (conference) URL: ' + url);
                        this.httpCall.get(url).subscribe(data3 => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
                            //resolve("Done");
                        }, err => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
                            //resolve("Error");
                        });
                        //});
                    }
                }
            });
            // Sync Notes
            SQLQuery = "SELECT * FROM attendee_notes ";
            SQLQuery = SQLQuery + "WHERE AttendeeID = '" + AttendeeID + "' ";
            SQLQuery = SQLQuery + "AND LastUpdated BETWEEN '" + LastSync + "' AND '" + ThisSync + "'";
            QueryType = "attendee_notes";
            console.log('Sync UpdateS2M: Notes query: ' + SQLQuery);
            this.DBGetData(QueryType, SQLQuery).then(data => {
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        flags = "UpdateS2M|" + LastSync + "|" + ThisSync;
                        flags = flags + "|attendee_notes";
                        flags = flags + "|" + data[i].AttendeeID;
                        flags = flags + "|" + data[i].EventID;
                        flags = flags + "|" + data[i].Note;
                        flags = flags + "|" + data[i].LastUpdated;
                        flags = flags + "|" + data[i].UpdateType;
                        var url = SyncURLReference + "action=sync&flags=" + flags + "&AttendeeID=" + AttendeeID;
                        //return new Promise(resolve => {
                        console.log('Sync UpdateS2M: Notes URL: ' + url);
                        this.httpCall.get(url).subscribe(data3 => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(data3));
                            //resolve("Done");
                        }, err => {
                            console.log('Sync UpdateS2M: Response: ' + JSON.stringify(err));
                            //resolve("Error");
                        });
                        //});
                    }
                }
            });
        });
        // Done
        //resolve("Done");
    }
};
Synchronization = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_sqlite__["a" /* SQLite */],
        __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__["a" /* Localstorage */]])
], Synchronization);

//# sourceMappingURL=synchronization.js.map

/***/ }),

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_synchronization_synchronization__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_Rx__ = __webpack_require__(621);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_sqlite__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__more_more__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__help_help__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__program_program__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__conferencecity_conferencecity__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__social_social__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__speakers_speakers__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__map_map__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__exhibitors_exhibitors__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__notes_notes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__myagenda_myagenda__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__login_login__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__networking_networking__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__activity_activity__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__profile_profile__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__educationdetails_educationdetails__ = __webpack_require__(62);
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










// Preload Pages















let HomePage = class HomePage {
    constructor(navCtrl, alertCtrl, nav, loadingCtrl, toastCtrl, storage, databaseprovider, syncprovider, cd, pltfrm, sqlite, localstorage) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.syncprovider = syncprovider;
        this.cd = cd;
        this.pltfrm = pltfrm;
        this.sqlite = sqlite;
        this.localstorage = localstorage;
        this.morePage = __WEBPACK_IMPORTED_MODULE_9__more_more__["a" /* MorePage */];
        this.helpPage = __WEBPACK_IMPORTED_MODULE_10__help_help__["a" /* HelpPage */];
        this.programPage = __WEBPACK_IMPORTED_MODULE_11__program_program__["a" /* ProgramPage */];
        this.conferenceCityPage = __WEBPACK_IMPORTED_MODULE_12__conferencecity_conferencecity__["a" /* ConferenceCityPage */];
        this.socialPage = __WEBPACK_IMPORTED_MODULE_13__social_social__["a" /* SocialPage */];
        this.speakersPage = __WEBPACK_IMPORTED_MODULE_14__speakers_speakers__["a" /* SpeakersPage */];
        this.mapPage = __WEBPACK_IMPORTED_MODULE_15__map_map__["a" /* MapPage */];
        this.exhibitorsPage = __WEBPACK_IMPORTED_MODULE_16__exhibitors_exhibitors__["a" /* ExhibitorsPage */];
        this.notesPage = __WEBPACK_IMPORTED_MODULE_17__notes_notes__["a" /* NotesPage */];
        this.myAgendaPage = __WEBPACK_IMPORTED_MODULE_18__myagenda_myagenda__["a" /* MyAgenda */];
        this.loginPage = __WEBPACK_IMPORTED_MODULE_19__login_login__["a" /* LoginPage */];
        // Setup Menu Style variables
        this.DisplayMenuVertical = false;
        this.DisplayMenuGrid = false;
        this.DisplayMenuDashboard = false;
        this.upcomingAgendaItems = [];
        this.i = 0;
        this.NewMessagesIndicator = false;
        // Determine platform that the app is running on
        pltfrm.ready().then(() => {
            console.log('Home: Platform android: ' + pltfrm.is('android'));
            console.log('Home: Platform cordova: ' + pltfrm.is('cordova'));
            console.log('Home: Platform core: ' + pltfrm.is('core'));
            console.log('Home: Platform ios: ' + pltfrm.is('ios'));
            console.log('Home: Platform ipad: ' + pltfrm.is('ipad'));
            console.log('Home: Platform iphone: ' + pltfrm.is('iphone'));
            console.log('Home: Platform mobile: ' + pltfrm.is('mobile'));
            console.log('Home: Platform mobileweb: ' + pltfrm.is('mobileweb'));
            console.log('Home: Platform phablet: ' + pltfrm.is('phablet'));
            console.log('Home: Platform tablet: ' + pltfrm.is('tablet'));
            console.log('Home: Platform windows: ' + pltfrm.is('windows'));
            this.DevicePlatform = "Browser";
            var DevicePlatform2 = "Device";
            if (pltfrm.is('android') && pltfrm.is('mobileweb') == false) {
                console.log("Home: Running on an Android device!");
                this.DevicePlatform = "Android";
                this.connectToDb();
            }
            if (pltfrm.is('android') && pltfrm.is('mobileweb') == true) {
                console.log("Home: Running on an Android device!");
                this.DevicePlatform = "Browser";
                this.connectToDb();
            }
            if (pltfrm.is('ios') == true && pltfrm.is('mobileweb') == false) {
                console.log("Home: Running the app on an iOS device!");
                this.DevicePlatform = "iOS";
                this.connectToDb();
            }
            if (pltfrm.is('ios') == true && pltfrm.is('mobileweb') == true) {
                console.log("Home: Running on browser on an iOS device!");
                this.DevicePlatform = "Browser";
                this.connectToDb();
            }
            //if (pltfrm.is('cordova')==false && pltfrm.is('mobileweb')==false) {
            //	console.log("Home: Running on browser using Ionic Serve!");
            //	DevicePlatform2 = "Ionic";
            //	this.connectToDb();
            //}
            console.log("Home: App platform: " + this.DevicePlatform);
            this.localstorage.setLocalValue('DevicePlatform', this.DevicePlatform);
            this.localstorage.setLocalValue('DevicePlatform2', DevicePlatform2);
        }).catch(function () {
            console.log("Home: Promise Rejected");
        });
    }
    connectToDb() {
        console.log('Home: Connecting to DB...');
        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
            console.log('Home: Connected.');
            this.db = db;
            this.createTables();
        });
    }
    createTables() {
        console.log('Home: Creating tables...');
        var SQLquery = 'CREATE TABLE IF NOT EXISTS attendees (id integer primary key, AttendeeID text, CustID integer, Prefix text, FirstName text, MiddleInitial text, LastName text, Suffix text, BadgeName text, DegreesHeld text, Affiliation text, Employer text, Title text, ImageURLThumbnail text, ImageURLFull text, Biography text, SearchField text)';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Home: Executed SQL'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery1 = 'CREATE TABLE IF NOT EXISTS attendee_courses (acID integer, ct_id text, bt_imis_id text, st_imis_id text, quantity text, subevent_id text, session_id text, waitlist text, test text)';
        this.db.executeSql(SQLquery1, {}).then(() => console.log('Home: Executed SQL1'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery2 = 'CREATE TABLE IF NOT EXISTS attendee_ces (ceID integer primary key, AttendeeID text, session_id text, scannedYN text, ceStatusTIS text, evalID text, LastUpdated text)';
        this.db.executeSql(SQLquery2, {}).then(() => console.log('Home: Executed SQL2'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery3 = 'CREATE TABLE IF NOT EXISTS itinerary (itID integer primary key, mtgID text, Date_Start text, Date_End text, Time_Start text, Time_End text, Subject text, Location text, Description text, atID text, AttendeeID text, EventID text, LastUpdated text, UpdateType text)';
        this.db.executeSql(SQLquery3, {}).then(() => console.log('Home: Executed SQL3'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery4 = 'CREATE TABLE IF NOT EXISTS attendee_notes (atnID integer primary key, AttendeeID text, EventID text, Note text, LastUpdated text)';
        this.db.executeSql(SQLquery4, {}).then(() => console.log('Home: Executed SQL4'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery5 = 'CREATE TABLE IF NOT EXISTS evaluations (evalID integer primary key, AttendeeID text, session_id text, evaluationType text, Q11 text, Q12 text, Q21 text, Q22 text, Q23 text, Q24 text, Q25 text, Q26 text, Q31 text, Q32 text, Q33 text, Q41 text, LastUpdated text)';
        this.db.executeSql(SQLquery5, {}).then(() => console.log('Home: Executed SQL5'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery6 = 'CREATE TABLE IF NOT EXISTS evaluation_conference (evalID integer primary key, AttendeeID text, session_id text, evaluationType text, Q1 text, Q2 text, Q3 text, Q4 text, Q5 text, Q5C text, Q6 text, Q7 text, Q7C text, Q8 text, Q9 text, Q10 text, Q10C text, Q11 text, Q11C text, LastUpdated text)';
        this.db.executeSql(SQLquery6, {}).then(() => console.log('Home: Executed SQL6'))
            .catch(e => console.log(JSON.stringify(e)));
        // App tables
        var SQLquery7 = 'CREATE TABLE IF NOT EXISTS record_deletes (id integer primary key, AttendeeID text, TableName text, WhereField text, WhereValue text, LastUpdated text)';
        this.db.executeSql(SQLquery7, {}).then(() => console.log('Home: Executed SQL7'))
            .catch(e => console.log(JSON.stringify(e)));
        // Session tables
        var SQLquery8 = 'CREATE TABLE IF NOT EXISTS courses (session_id text, session_title text, description text, session_start_time text, session_end_time text, primary_speaker text, other_speakers text, course_id text, subject text, cs_credits text, ce_credits_type text, room_number text, verification_code text, nadl_verification text, type text, level text, speaker_host_emcee text, room_capacity text, course_topics text, ActiveYN text, corporate_supporter text, session_recording text, HandoutFilename text, CEcreditsL text, CEcreditsP text, SearchField text)';
        this.db.executeSql(SQLquery8, {}).then(() => console.log('Home: Executed SQL8'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery9 = 'CREATE TABLE IF NOT EXISTS courses_speakers (speakerID integer, FullName text, FirstName text, LastName text, Credentials text, Bio text, Title text, Courses text, imageFilename text, email text, SearchField text)';
        this.db.executeSql(SQLquery9, {}).then(() => console.log('Home: Executed SQL9'))
            .catch(e => console.log(JSON.stringify(e)));
        // Exhibitor tables
        var SQLquery10 = "CREATE TABLE IF NOT EXISTS exhibitors (ExhibitorID integer, ClientExhibitorID text, ";
        SQLquery10 = SQLquery10 + "CompanyName text, AddressLine1 text, AddressLine2 text, City text, State text, Province text, ZipPostalCode text, Country text, ";
        SQLquery10 = SQLquery10 + "Website text, PrimaryContactFirstName text, PrimaryContactLastName text, PrimaryContactEmail text, PrimaryContactPhone text, ";
        SQLquery10 = SQLquery10 + "PrimaryOnsiteContactName text, PrimaryOnsiteContactEmail text, PrimaryOnsiteContactPhone text, ";
        SQLquery10 = SQLquery10 + "BoothNumber text, BoothX integer, BoothY integer, ";
        SQLquery10 = SQLquery10 + "SocialMediaFacebook text, SocialMediaTwitter text, SocialMediaLinkedIn text, SocialMediaSkype text, SocialMediaYouTube text, SocialMediaGooglePlus text, SocialMediaRSS text, ";
        SQLquery10 = SQLquery10 + "CompanyDescription text, CompanyLogoFilename text, ProductsServices text, SearchField text)";
        this.db.executeSql(SQLquery10, {}).then(() => console.log('Home: Executed SQL10'))
            .catch(e => console.log(JSON.stringify(e)));
        var SQLquery11 = 'CREATE TABLE IF NOT EXISTS booth_mapping (BoothNumber integer primary key, BoothY integer, BoothX integer)';
        this.db.executeSql(SQLquery11, {}).then(() => console.log('Home: Executed SQL11'))
            .catch(e => console.log(JSON.stringify(e)));
    }
    ionViewWillEnter() {
        // Activate menu style accoridng to stored value
        console.log('Home: ionViewWillEnter: HomePage');
        var HomeLayoutStyle = this.localstorage.getLocalValue('HomeLayoutStyle');
        switch (HomeLayoutStyle) {
            case "List":
                this.DisplayMenuVertical = true;
                this.DisplayMenuGrid = false;
                this.DisplayMenuDashboard = false;
                break;
            case "Grid":
                this.DisplayMenuVertical = false;
                this.DisplayMenuGrid = true;
                this.DisplayMenuDashboard = false;
                break;
            case "Dashboard":
                this.DisplayMenuVertical = false;
                this.DisplayMenuGrid = false;
                this.DisplayMenuDashboard = true;
                break;
            default:
                this.DisplayMenuVertical = true;
                this.DisplayMenuGrid = false;
                this.DisplayMenuDashboard = false;
                break;
        }
        var HomeBackground = this.localstorage.getLocalValue('HomeBackground');
        this.MenuBackground = HomeBackground || 'bgCityscape';
        /* Determine currently logged in user */
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var LoginName = this.localstorage.getLocalValue('LoginFullName');
        var LoginNameInitials = this.localstorage.getLocalValue('LoginNameInitials');
        if (LoginNameInitials == '' || LoginNameInitials == null || LoginNameInitials == 'undefined') {
            // Do nothing
        }
        else {
            var Fullname = LoginName;
            var n = Fullname.indexOf(',');
            Fullname = Fullname.substring(0, n != -1 ? n : Fullname.length);
            var initials = Fullname.match(/\b\w/g) || [];
            var initials2 = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            this.localstorage.setLocalValue("LoginNameInitials", initials2);
            LoginNameInitials = initials2;
        }
        if (AttendeeID == '' || AttendeeID == null) {
            console.log('Home: AttendeeID blank');
            this.LogInOutIcon = 'log-in';
        }
        else {
            console.log('Home: Stored AttendeeID: ' + AttendeeID);
            this.LogInOutIcon = '';
        }
        if (LoginName != '' && LoginName != null && LoginName != 'undefined') {
            console.log('Home: Stored LoginName: ' + LoginName);
            //this.LoggedInUser = LoginName;
            this.AttendeeInitials = LoginNameInitials;
        }
        else {
            console.log('Home: User not logged in');
            this.LoggedInUser = 'Sign In';
            this.localstorage.setLocalValue('LoginName', '');
            this.localstorage.setLocalValue('LoginFullName', '');
            this.localstorage.setLocalValue('AttendeeID', '');
            this.localstorage.setLocalValue("loginUsername", '');
            this.localstorage.setLocalValue("loginPassword", '');
            this.localstorage.setLocalValue("LoginNameInitials", '');
            // Temporary hard coding when not logged in
            this.localstorage.setLocalValue("AgendaDays", "4");
            this.localstorage.setLocalValue("AgendaDates", "2019-04-24|2019-04-25|2019-04-26|2019-04-27|");
            this.localstorage.setLocalValue("AgendaDayButtonLabels", "4/24|4/25|4/26|4/27|");
        }
        this.upcomingAgendaItems = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        var visStartTime;
        var visEndTime;
        var eventIcon;
        var visEventName;
        var maxRecs;
        // Reset mass variables
        this.localstorage.setLocalValue("MassAdd", "0");
        this.localstorage.setLocalValue("MassEval", "0");
        this.localstorage.setLocalValue("MassContact", "0");
        this.localstorage.setLocalValue("MassEmail", "0");
        this.localstorage.setLocalValue("MassAgenda", "0");
        this.localstorage.setLocalValue("MassNotes", "0");
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            console.log('Home: Attendee logged in, dashboard data loading...');
            flags = "li|2019-04-24";
            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                //console.log("getAgendaData: " + JSON.stringify(data));
                this.upcomingAgendaItems = [];
                this.cd.markForCheck();
                if (data['length'] > 0) {
                    if (data['length'] > 3) {
                        maxRecs = 3;
                    }
                    else {
                        maxRecs = data['length'];
                    }
                    for (var i = 0; i < maxRecs; i++) {
                        var dbEventDateTime = data[i].EventDate.substring(5, 10);
                        var DisplayDateTime = dbEventDateTime.replace(/-/g, '/');
                        visStartTime = formatTime(data[i].EventStartTime);
                        visEndTime = formatTime(data[i].EventEndTime);
                        DisplayDateTime = DisplayDateTime + " from " + visStartTime + " to " + visEndTime;
                        if (data[i].EventID == "0") {
                            eventIcon = "time";
                            visEventName = data[i].EventName;
                        }
                        else {
                            eventIcon = "list-box";
                            visEventName = data[i].EventName;
                        }
                        this.upcomingAgendaItems.push({
                            EventName: visEventName,
                            visEventTimeframe: DisplayDateTime,
                            visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                            EventLocation: data[i].EventLocation,
                            eventTypeIcon: eventIcon
                        });
                    }
                }
                else {
                    this.upcomingAgendaItems.push({
                        EventName: "No upcoming agenda entries",
                        visEventTimeframe: "",
                        EventLocation: "",
                        visEventID: "'0|0'",
                        eventTypeIcon: "remove-circle"
                    });
                }
                this.cd.markForCheck();
            }).catch(function () {
                console.log("Home: Promise Rejected");
            });
            this.databaseprovider.getCETrackerData(AttendeeID).then(data => {
                //console.log("Home: getCETrackerData: " + JSON.stringify(data));
                var sumCreditsL = 0;
                var sumCreditsP = 0;
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        var EvalType = data[i].ce_credits_type.substring(0, 1);
                        var iconSet = 0;
                        if (EvalType == "") { // Evals that don't require an eval are completed
                            iconSet = 1;
                            sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
                            sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
                        }
                        if (data[i].ceStatusScan == "0" && iconSet == 0) { // No scan (shouldn't happen with AACD)
                            iconSet = 1;
                        }
                        if ((data[i].Evaluated == "0" || data[i].Evaluated === null) && iconSet == 0) { // Eval not completed
                            iconSet = 1;
                        }
                        if (iconSet == 0) { // Otherwise mark as completed
                            sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
                            sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
                        }
                    }
                }
                this.creditsTypeL = sumCreditsL.toFixed(2);
                this.creditsTypeP = sumCreditsP.toFixed(2);
                this.cd.markForCheck();
            }).catch(function () {
                console.log("Home: Promise Rejected");
            });
        }
        else {
            console.log('Home: Attendee not logged in, dashboard data not loaded');
            this.upcomingAgendaItems = [];
            this.cd.markForCheck();
            this.upcomingAgendaItems.push({
                EventName: "You need to be logged in to see your agenda",
                visEventTimeframe: "",
                EventLocation: "",
                visEventID: "'0|0'",
                eventTypeIcon: "remove-circle"
            });
        }
    }
    ionViewDidEnter() {
        console.log('Home: ionViewDidEnter: HomePage');
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var LoginName = this.localstorage.getLocalValue('LoginName');
        var AutoSync = this.localstorage.getLocalValue('AutoSync');
        var DirectChatMonitoring = this.localstorage.getLocalValue('DirectChatMonitoring');
        this.localstorage.setLocalValue('DevicePlatform', this.DevicePlatform);
        // Check to start AutoSync if not running a browser and user is logged in
        //if ((this.DevicePlatform != "Browser") && (AttendeeID !== null && AttendeeID != '')) {
        if (this.DevicePlatform != "Browser") {
            // If AutoSync = 0 then it has been disabled
            if (AutoSync != '0') {
                var LastDirectChatCheck = this.localstorage.getLocalValue('LastDirectChatCheck');
                if (LastDirectChatCheck == '' || LastDirectChatCheck === null) {
                    LastDirectChatCheck = '2019-01-01T00:00:01Z';
                }
                if (AutoSync == '' || AutoSync == null) {
                    console.log('Home: First AutoSync');
                    // Set localstorage value with length in minutes
                    this.localstorage.setLocalValue('AutoSync', '10');
                    // First time startup of AutoSync
                    this.startAutoSync();
                }
                else {
                    // Reset AutoSync when entering the Home page (either from fresh start
                    // or coming back within the same instance of the app)
                    this.stopAutoSync();
                    this.startAutoSync();
                }
            }
        }
        else {
            console.log('Home: AutoSync disabled because platform is browser');
        }
        // Check on first run in order to reset AutoSync
        var AutoSyncReset = this.localstorage.getLocalValue('AutoSyncReset');
        if (AutoSyncReset == '' || AutoSyncReset == null) {
            // If first run, check if platform is not web browser			
            if (this.DevicePlatform != "Browser") {
                // Reset AutoSync and then disbale this section of code by setting 
                // the localstorage value to 1
                this.localstorage.setLocalValue('LastSync', '2019-01-01T00:00:01Z');
                this.localstorage.setLocalValue('AutoSyncReset', '1');
            }
        }
        // If DirectChatMonitoring = 0 then it has been disabled
        //DirectChatMonitoring = '0';
        if (DirectChatMonitoring != '0') {
            if (DirectChatMonitoring == '' || DirectChatMonitoring == null) {
                console.log('Home: First DirectChatMonitoring');
                // Set localstorage value with length in minutes
                this.localstorage.setLocalValue('DirectChatMonitoring', '10');
                // First time startup of DirectChatMonitoring
                this.startDirectChatMonitoring();
            }
            else {
                // Reset DirectChatMonitoring when entering the Home page (either from fresh start
                // or coming back within the same instance of the app)
                this.stopDirectChatMonitoring();
                this.startDirectChatMonitoring();
            }
        }
        // Check on first run in order to Vacuum database (aka Shrink)
        /*
        var SQLVacuum = this.localstorage.getLocalValue('SQLVacuum');
        
        if (SQLVacuum == '' || SQLVacuum == null) {

            // If first run, check if platform is not web browser
            if (this.DevicePlatform != "Browser") {
                
                // Reset AutoSync and then disbale this section of code by setting
                // the localstorage value to 1
                console.log('Performing SQLite vacuum function');
                this.localstorage.setLocalValue('SQLVacuum', '1');
                this.syncprovider.DBCallQuery2('VACUUM');
            
            }
            
        }
        */
        /*
        // Check on first run in order to Vacuum database (aka Shrink)
        var SpeakerReset = this.localstorage.getLocalValue('SpeakerReset');
        
        if (SpeakerReset == '' || SpeakerReset == null) {

            // If first run, check if platform is not web browser
            if (this.DevicePlatform != "Browser") {
                
                this.localstorage.setLocalValue('SpeakerReset', '1');
                this.syncprovider.DBCallQuery2('DELETE FROM courses_speakers WHERE rowid NOT IN (SELECT max(rowid) FROM courses_speakers GROUP BY FirstName, LastName)');
            
            }
            
        }
        */
    }
    startDirectChatMonitoring() {
        console.log('Start Direct Chat Monitoring');
        // Set sync interval
        // Entry is in milliseconds
        // 600000 for every 10 minutes
        // 60000 for every minute
        // 30000 for every 30 seconds (for testing)
        this.DCsubscription = __WEBPACK_IMPORTED_MODULE_7_rxjs_Rx__["Observable"].interval(10000).subscribe(x => {
            // Previously successful sync time
            var LastDirectChatCheck = this.localstorage.getLocalValue('LastDirectChatCheck');
            if (LastDirectChatCheck == '' || LastDirectChatCheck === null) {
                LastDirectChatCheck = '2019-01-01T00:00:01Z';
            }
            // Current sync time in UTC
            var ThisDirectChatCheck2 = new Date().toUTCString();
            var ThisDirectChatCheck = dateFormat(ThisDirectChatCheck2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            //var ThisDirectChatCheck = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log('Home: Direct Chat Monitoring event: ' + this.i);
            this.i++;
            // Call AutoSync service in providers
            this.syncprovider.DirectChatMonitor(LastDirectChatCheck, ThisDirectChatCheck).then(data => {
                //console.log('Home: Executed Direct Chat Monitoring');
                this.localstorage.setLocalValue('DirectChatMonitoringString', JSON.stringify(data));
                if (data[0].NewMessages == "0") {
                    //console.log('No new messages');
                    if (this.NewMessagesIndicator != false) {
                        this.NewMessagesIndicator = false;
                        this.cd.markForCheck();
                    }
                }
                else {
                    //console.log('New messages!');
                    if (this.NewMessagesIndicator != true) {
                        this.NewMessagesIndicator = true;
                        this.cd.markForCheck();
                    }
                }
                // Update LastSync date for next run
                this.localstorage.setLocalValue('LastDirectChatCheck', ThisDirectChatCheck);
            }).catch(function () {
                console.log("Home: Direct Chat Monitoring Promise Rejected");
            });
        });
    }
    stopDirectChatMonitoring() {
        if (this.DCsubscription != null) {
            console.log('Home: Stop Direct Chat Monitoring');
            this.DCsubscription.unsubscribe();
        }
    }
    startAutoSync() {
        console.log('Start AutoSync');
        // Set sync interval
        // Entry is in milliseconds
        // 600000 for every 10 minutes
        // 60000 for every minute
        // 30000 for every 30 seconds (for testing)
        this.subscription = __WEBPACK_IMPORTED_MODULE_7_rxjs_Rx__["Observable"].interval(60000).subscribe(x => {
            // Previously successful sync time
            var LastSync3 = this.localstorage.getLocalValue('LastSync');
            if (LastSync3 == '' || LastSync3 === null) {
                LastSync3 = '2019-01-01T00:00:01Z';
            }
            var LastSync2 = new Date(LastSync3).toUTCString();
            var LastSync = dateFormat(LastSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            // Current sync time in UTC
            var ThisSync2 = new Date().toUTCString();
            var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            console.log('Home: AutoSync event: ' + this.i);
            console.log('Sync period: ' + LastSync + ' to ' + ThisSync);
            this.i++;
            // Call AutoSync service in providers
            this.syncprovider.DBSyncUpdateM2S(LastSync, ThisSync).then(data => {
                console.log('Home: Executed UpdateM2S Sync: ' + data);
                // Update LastSync date for next run
                this.localstorage.setLocalValue('LastSync', ThisSync);
            }).catch(function () {
                console.log("Home: UpdateM2S Sync Promise Rejected");
            });
            this.syncprovider.DBSyncUpdateS2M(LastSync, ThisSync).then(data => {
                console.log('Home: Executed UpdateS2M Sync: ' + data);
                // Update LastSync date for next run
                this.localstorage.setLocalValue('LastSync', ThisSync);
            }).catch(function () {
                console.log("Home: UpdateS2M Sync Promise Rejected");
            });
        });
    }
    stopAutoSync() {
        if (this.subscription != null) {
            console.log('Home: Stop AutoSync');
            this.subscription.unsubscribe();
        }
    }
    ManualSync() {
        // Previously successful sync time
        var LastSync3 = this.localstorage.getLocalValue('LastSync');
        if (LastSync3 == '' || LastSync3 === null) {
            LastSync3 = '2019-01-01T00:00:01Z';
        }
        var LastSync2 = new Date(LastSync3).toUTCString();
        var LastSync = dateFormat(LastSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
        // Current sync time in UTC
        var ThisSync2 = new Date().toUTCString();
        var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
        console.log('Home: AutoSync event: ' + this.i);
        this.i++;
        // Call AutoSync service in providers
        this.syncprovider.DBSyncUpdateM2S(LastSync, ThisSync).then(data => {
            console.log('Home: Executed UpdateM2S Sync: ' + data);
            // Update LastSync date for next run
            this.localstorage.setLocalValue('LastSync', ThisSync);
        }).catch(function () {
            console.log("Home: UpdateM2S Sync Promise Rejected");
        });
        this.syncprovider.DBSyncUpdateS2M(LastSync, ThisSync).then(data => {
            console.log('Home: Executed UpdateS2M Sync: ' + data);
            // Update LastSync date for next run
            this.localstorage.setLocalValue('LastSync', ThisSync);
        }).catch(function () {
            console.log("Home: UpdateS2M Sync Promise Rejected");
        });
    }
    // The following pages require the user to be logged in.
    // If not, go to login page before continuing on
    // otherwise, go to requested page.
    NavigateToAuthenticatedPage(PageID) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            this.localstorage.setLocalValue('LoginWarning', '0');
            this.localstorage.setLocalValue('ForwardingPage', '');
            switch (PageID) {
                case "MyAgenda":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_18__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' });
                    break;
                case "CETracking":
                    this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' });
                    break;
                case "Notes":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_17__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Networking":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_20__networking_networking__["a" /* NetworkingPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "ActivityFeed":
                    var flags = "cn";
                    this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
                        if (data[0].Status == "Connected") {
                            // Navigate to Activity Feed page
                            this.localstorage.setLocalValue('ActivityFeedID', '0');
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_21__activity_activity__["a" /* ActivityPage */], {}, { animate: true, direction: 'forward' });
                        }
                        else {
                            let alert = this.alertCtrl.create({
                                title: 'Internet Error',
                                subTitle: 'You need to have Internet access in order to use that feature.',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    });
                    break;
            }
        }
        else {
            this.localstorage.setLocalValue('ForwardingPage', PageID);
            this.localstorage.setLocalValue('LoginWarning', '1');
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_19__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
    }
    AvatarNavigation() {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_22__profile_profile__["a" /* ProfilePage */], {}, { animate: true, direction: 'forward' });
        }
        else {
            this.localstorage.setLocalValue('LoginWarning', '0');
            this.localstorage.setLocalValue('ForwardingPage', 'Home');
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_19__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
    }
    NavigateToLoginPage() {
        this.localstorage.setLocalValue('LoginWarning', '0');
        this.localstorage.setLocalValue('ForwardingPage', '');
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_19__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
    }
    EventDetails(EventID) {
        console.log("Btn ID: " + EventID);
        var IDSplit = EventID.split("|");
        var storeEventID = IDSplit[0].replace("'", "");
        var storePersonalEventID = IDSplit[1].replace("'", "");
        console.log("Home: storeEventID: " + storeEventID);
        console.log("Home: storePersonalEventID: " + storePersonalEventID);
        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        }
        else {
            if (storeEventID == "0") {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);
                // Navigate to Education Details page
                this.navCtrl.push('MyAgendaPersonal', { EventID: storePersonalEventID }, { animate: true, direction: 'forward' });
            }
            else {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('EventID', storeEventID);
                // Navigate to Education Details page
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_23__educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: storeEventID }, { animate: true, direction: 'forward' });
            }
        }
    }
    ;
};
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-home',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/home/home.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button icon-only menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n\n		<ion-title>\n			AACD San Diego 2019\n		</ion-title>\n\n		<ion-buttons end>\n	\n			<button style="background:transparent!important">\n				<ion-avatar>\n					<ion-text-avatar class="avatar" color="secondary" style="z-index: 10;" (click)="AvatarNavigation()">{{AttendeeInitials}}\n						<ion-icon end name="{{LogInOutIcon}}" color="light" style="z-index: 1000;">\n						</ion-icon>\n					</ion-text-avatar>\n				</ion-avatar>\n			</button>\n\n		</ion-buttons>\n\n\n		<!--\n		<ion-buttons end>\n			<button ion-button icon-only color="light" (click)="NavigateToLoginPage()">\n				{{LoggedInUser}} <ion-icon name="{{LogInOutIcon}}"></ion-icon>\n			</button>\n		</ion-buttons>\n		-->\n	</ion-navbar>\n</ion-header>\n\n\n\n<!-- <ion-content style="background:url(assets/img/bgBlue.jpg)no-repeat center;background-size:cover;"> -->\n<ion-content class="{{MenuBackground}}" >\n\n	<!-- Disabled 2018-03-11 Due to being redundant with Social Media menu option on home page\n	<ion-fab top right edge>\n		<button ion-fab mini><ion-icon name="add"></ion-icon></button>\n		<ion-fab-list>\n			<button ion-fab><ion-icon name="logo-facebook"></ion-icon></button>\n			<button ion-fab><ion-icon name="logo-twitter"></ion-icon></button>\n			<button ion-fab><ion-icon name="logo-vimeo"></ion-icon></button>\n			<button ion-fab><ion-icon name="logo-googleplus"></ion-icon></button>\n		</ion-fab-list>\n	</ion-fab>\n	-->\n	\n	<img src="assets/img/header1.png">\n\n	<div id="MenuVertical" *ngIf="DisplayMenuVertical">\n\n		<ion-list no-lines class="bgCityscape">\n			<button ion-item class="opacity" [navPush]="programPage">\n				<p class="myFontSize26">Program</p>\n				<ion-icon name="list" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="speakersPage">\n				<p class="myFontSize26">Speakers</p>\n				<ion-icon name="mic" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" (click)="NavigateToAuthenticatedPage(\'MyAgenda\')">\n				<p class="myFontSize26">My Agenda</p>\n				<ion-icon name="calendar" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="exhibitorsPage">\n				<p class="myFontSize26">Exhibitors</p>\n				<ion-icon name="people" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" (click)="NavigateToAuthenticatedPage(\'CETracking\')">\n				<p class="myFontSize26">CE Tracking</p>\n				<ion-icon name="school" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" (click)="NavigateToAuthenticatedPage(\'Networking\')">\n				<p class="myFontSize26">Networking</p>\n				<ion-icon name="contacts" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="mapPage">\n				<p class="myFontSize26">Map</p>\n				<ion-icon name="map" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" onclick="window.open(\'https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Faacd.ejoinme.org%2FMyEvents%2FGiveBackaSmileSilentAuction2018%2Ftabid%2F886099%2FDefault.aspx&data=02%7C01%7Clisab%40aacd.com%7C3affa1cb6109443e9e2808d5a16dd04d%7C867291cda2d943f284571ed60b355ed5%7C0%7C0%7C636592415380677523&sdata=gvaFvM0Ce2X9QYhrsE1PcRiiQroR1MLaMRzdpVpNi9A%3D&reserved=0\', \'_system\', \'location=yes\'); return false;">\n				<p class="myFontSize26">GBAS Silent Auction</p>\n				<ion-icon name="happy" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="conferenceCityPage">\n				<p class="myFontSize26">San Diego</p>\n				<ion-icon name="plane" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="socialPage">\n				<p class="myFontSize26">Social Media</p>\n				<ion-icon name="text" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="helpPage">\n				<p class="myFontSize26">Help</p>\n				<ion-icon name="help" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" (click)="NavigateToAuthenticatedPage(\'Notes\')">\n				<p class="myFontSize26">Notes</p>\n				<ion-icon name="create" item-left></ion-icon>\n			</button>\n\n			<button ion-item class="opacity" [navPush]="morePage">\n				<p class="myFontSize26">More</p>\n				<ion-icon name="more" item-left></ion-icon>\n			</button>\n		</ion-list>\n\n\n\n\n\n	</div>\n\n	<div id="MenuGrid" *ngIf="DisplayMenuGrid">\n\n		<div class="row" style="padding-top:20px; padding-bottom:0; margin-top:20px; margin-bottom:0">\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img (click)="NavigateToAuthenticatedPage(\'MyAgenda\')" src="assets/img/calendar2.png" width="50%" height="auto" style="display: block; margin-left:auto; margin-right:auto; margin-top:0">\n                <p id="" style="color:#FFFFFF;text-align:center;font-weight:bold"  class=""><span style="">YourAgenda</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img [navPush]="programPage" src="assets/img/schedule.png" width="50%" height="auto" style="display: block; margin-left: auto; margin-right: auto; margin-top:0">\n                <p id="" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Program</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img [navPush]="speakersPage" src="assets/img/educator1.png" width="50%" height="auto" style="display: block; margin-left: auto; margin-right: auto;">\n                <p id="home-markdown6" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Educators</span></p>\n            </div>\n          </div>\n\n        <div class="row" style="padding-top:10px; padding-bottom:0; margin-top:10px; margin-bottom:0">\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0;">\n                <img (click)="NavigateToAuthenticatedPage(\'CETracking\')" src="assets/img/ce.png" width="50%" height="auto" style="display: block; margin-top:0; margin-left: auto; margin-right: auto;">\n                <p id="" style="color:#ffffff;text-align:center;font-weight:bold" class=""><span style="">CE Tracker</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n\n              <img [navPush]="programPage" src="assets/img/book.png" width="50%" height="auto" style="display: block; margin-top:0; margin-left: auto; margin-right: auto;">\n                <p id="" style="color:#ffffff;text-align:center;font-weight:bold" class=""><span style="">Course Locations</span></p>\n            </div>\n\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img src="assets/img/gift.png" href="#" onclick="window.open(\'https://aacd.ejoinme.org/MyEvents/GiveBackaSmileSilentAuction2017/tabid/811205/Default.aspx\', \'_system\', \'location=yes\'); return false;" width="50%" height="auto" style="display: block; margin-left: auto; margin-right: auto;">\n                <p id="" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">GBAS Auction</span></p>\n            </div>\n          </div>\n\n        <div class="row" style="padding-top:10px; padding-bottom:0; margin-top:10px; margin-bottom:0">\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img [navPush]="exhibitorsPage" src="assets/img/exhibitors1.png" width="50%" height="auto" style="display: block; margin-left: auto; margin-right: auto;">\n                <p id="" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Exhibitors</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img src="assets/img/person1.png" href="#" onclick="window.open(\'https://www.aacd.com/index.php?module=login\', \'_system\', \'location=yes\'); return false;" width="50%" height="auto" style="display: block; margin-top:0; margin-left: auto; margin-right: auto;">\n                <p id="home-markdown3" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Your AACD</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img [navPush]="mapPage" src="assets/img/map.png" width="50%" height="auto" style="display: block; margin-top:0; margin-left: auto; margin-right: auto; padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <p id="home-markdown6"  style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Maps</span></p>\n            </div>\n        </div>\n	</div>\n\n	<div id="MenuDashboard" *ngIf="DisplayMenuDashboard">\n\n        <div class="row" style="width:100%; padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n			<ion-list no-lines>\n				<ion-item class="steel" (click)="NavigateToAuthenticatedPage(\'MyAgenda\')">\n					Upcoming Agenda Items\n					<ion-icon name="calendar" item-left></ion-icon>\n				</ion-item>\n				<ion-item style="border-color: rgba(0, 0, 0, 0);background-color: rgba(0, 0, 0, 0);color: white; padding-bottom:-30px; margin-bottom:-30px;" (click)="EventDetails(upcomingAgenda.visEventID)" *ngFor="let upcomingAgenda of upcomingAgendaItems" id="upcomingAgenda-list-item19" >\n					<div>\n						<div class="row">\n							<div class="col">\n								<div style="float: left; padding-right: 10px;">\n									<ion-icon name="{{upcomingAgenda.eventTypeIcon}}"></ion-icon>\n								</div>\n								<div>\n									<p class="myLabelBold" style="color: white;">\n										{{upcomingAgenda.EventName}}\n									</p>\n									<p style="color: white;">\n										{{upcomingAgenda.visEventTimeframe}}\n										<br/>\n										{{upcomingAgenda.EventLocation}}\n									</p>\n								</div>\n								<div style="float: right; color: white;">\n									<ion-icon name="{{upcomingAgenda.navigationArrow}}"></ion-icon>\n								</div>\n							</div>\n						</div>\n					</div>\n				</ion-item>\n				<ion-item class="steel" (click)="NavigateToAuthenticatedPage(\'CETracking\')">\n					CE Credits Completed\n					<ion-icon name="school" item-left></ion-icon>\n				</ion-item>\n				<ion-item style="border-color: rgba(0, 0, 0, 0);background-color: rgba(0, 0, 0, 0);color: white;" (click)="NavigateToAuthenticatedPage(\'CETracking\')" id="cetrackervalue-list" >\n					<div>\n						<div class="row">\n							<div class="col">\n								<div>\n									<p class="myLabelBold" style="color: white;font-size:1.8em">\n										{{creditsTypeL}}L / {{creditsTypeP}}P\n									</p>\n								</div>\n							</div>\n						</div>\n					</div>\n				</ion-item>\n				<ion-item class="steel">\n					Announcements\n					<ion-icon name="bookmarks" item-left></ion-icon>\n				</ion-item>\n				<ion-item style="border-color: rgba(0, 0, 0, 0);background-color: rgba(0, 0, 0, 0);color: white;" id="announcement-list" >\n					<div>\n						<div class="row">\n							<div class="col">\n								<div style="float: left; padding-right: 10px;">\n									<ion-icon name="bookmark"></ion-icon>\n								</div>\n								<div>\n									<p class="myLabelBold" style="color: white;">\n										12:30pm<br/>\n										Head over now to the Exhibit Hall to see Dr. Phil Smith\n									</p>\n								</div>\n							</div>\n						</div>\n					</div>\n				</ion-item>\n			</ion-list>\n        </div>\n\n        <div class="row" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0; position: fixed; bottom:0%;">\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img [navPush]="programPage" src="assets/img/schedule.png" width="50%" height="auto" style="display: block; margin-left: auto; margin-right: auto; margin-top:0">\n                <p id="" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Program</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0">\n                <img [navPush]="exhibitorsPage" src="assets/img/exhibitors1.png" width="50%" height="auto" style="display: block; margin-left: auto; margin-right: auto;">\n                <p id="" style="color:#FFFFFF;text-align:center;font-weight:bold" class=""><span style="">Exhibitors</span></p>\n            </div>\n\n            <div class="col" style="padding-top:0; padding-bottom:0; margin-top:0; margin-bottom:0;">\n                <img (click)="NavigateToAuthenticatedPage(\'CETracking\')" src="assets/img/ce.png" width="50%" height="auto" style="display: block; margin-top:0; margin-left: auto; margin-right: auto;">\n                <p id="" style="color:#ffffff;text-align:center;font-weight:bold" class=""><span style="">CE Tracker</span></p>\n            </div>\n\n		</div>\n\n	</div>\n\n\n</ion-content>\n\n<ion-footer>\n		\n	<button ion-button block color="secondary" style="margin:0" (click)="NavigateToAuthenticatedPage(\'ActivityFeed\')">Activity Feed</button>\n\n</ion-footer>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/home/home.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["y" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_6__providers_synchronization_synchronization__["a" /* Synchronization */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_8__ionic_native_sqlite__["a" /* SQLite */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the Help page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let HelpPage = class HelpPage {
    constructor(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad HelpPage');
    }
};
HelpPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-help',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/help/help.html"*/'<!--\n  Generated template for the Help page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Help</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n\n      <ion-item>\n        <ion-label floating>Name</ion-label>\n        <ion-input type="text"></ion-input>\n      </ion-item>\n    \n      <ion-item>\n        <ion-label floating>Email</ion-label>\n        <ion-input type="password"></ion-input>\n      </ion-item>\n    \n      <ion-item>\n      <ion-label floating>Phone</ion-label>\n      <ion-input type="text"></ion-input>\n      </ion-item>\n \n      <ion-item>\n    <ion-label floating>Comments</ion-label>\n    <ion-input type="text"></ion-input>\n      </ion-item>\n\n      <div text-center>\n        <button ion-button style="background:#2196f3" (click)="sendEmail()">\n          Request Assistance\n        </button>\n      </div>\n      \n \n\n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="calendar" item-left></ion-icon>\n    <h4>Add Session/Event</h4>\n    <p>Include item on your MyAgenda page</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="mic" item-left></ion-icon>\n    <h4>Speaker/Session Evaluation</h4>\n    <p>Provide your rating of the session</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="mail" item-left></ion-icon>\n    <h4>Send Email</h4>\n    <p>Use to follow up with the session speaker(s)</p>\n      </ion-item>\n    \n      <ion-item [navPush]="notesPage">\n    <ion-icon color="secondary" name="create" item-left></ion-icon>\n    <h4>Session Notes</h4>\n    <p>Let\'s you take notes associated with that session</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="more" item-left></ion-icon>\n    <h4>More Menu Options</h4>\n    <p>Look here for additional app functions</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="calendar" item-left></ion-icon>\n    <h4>Browse to Website</h4>\n    <p>Link to exhibitors website</p>\n      </ion-item>\n    \n      <ion-item [navPush]="personalPage">\n    <ion-icon color="secondary" name="person-add" item-left></ion-icon>\n    <h4>Add Personal Schedule Item</h4>\n    <p>Allows the inclusion of personal schedule items</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="eye" item-left></ion-icon>\n    <h4>View All</h4>\n    <p>See your entire schedule at a glance</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="list-box" item-left></ion-icon>\n    <h4>Session</h4>\n    <p>Get additional session information details</p>\n      </ion-item>\n    \n      <ion-item [navPush]="exhibitorPage">\n    <ion-icon color="secondary" name="pin" item-left></ion-icon>\n    <h4>Exhibit Hall Booth Locator</h4>\n    <p>Map pin showing exhibitor booth location</p>\n      </ion-item>\n    \n      <ion-item [navPush]="morePage">\n    <ion-icon color="secondary" name="document" item-left></ion-icon>\n    <h4>Handout/View PDF</h4>\n    <p>View or print a PDF handout</p>\n      </ion-item>\n    \n  \n    \n    \n    \n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/help/help.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */]])
], HelpPage);

//# sourceMappingURL=help.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EvaluationConference; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__home_home__ = __webpack_require__(101);
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







// Pages

let EvaluationConference = class EvaluationConference {
    constructor(navCtrl, navParams, nav, storage, cd, zone, loadingCtrl, alertCtrl, databaseprovider, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nav = nav;
        this.storage = storage;
        this.cd = cd;
        this.zone = zone;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.databaseprovider = databaseprovider;
        this.localstorage = localstorage;
        // Eval question variables
        this.eventSurveyQ1 = "";
        this.eventSurveyQ2 = "";
        this.eventSurveyQ3 = "";
        this.eventSurveyQ4 = "";
        this.eventSurveyQ5 = "";
        this.eventSurveyQ5C = "";
        this.eventSurveyQ6 = "";
        this.eventSurveyQ7 = "";
        this.eventSurveyQ7C = "";
        this.eventSurveyQ8 = "";
        this.eventSurveyQ9 = "";
        this.eventSurveyQ10 = "";
        this.eventSurveyQ10C = "";
        this.eventSurveyQ11 = "";
        this.eventSurveyQ11C = "";
    }
    mcqAnswer(value) {
        console.log(value);
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad: EvaluationConference');
        //this.LoadData();
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: EvaluationConference');
        // Load / refresh data when coming to this page
        //this.LoadData();
    }
    ngOnInit() {
        this.cd.markForCheck();
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var EventID = "0";
        var flags;
        flags = "ec|" + EventID + "|Conference|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0";
        this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
            console.log("getEvaluationData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                console.log('Using previously saved answers');
                this.eventSurveyQ1 = data[0].Q1;
                this.eventSurveyQ2 = data[0].Q2;
                this.eventSurveyQ3 = data[0].Q3;
                this.eventSurveyQ4 = data[0].Q4;
                this.eventSurveyQ5 = data[0].Q5;
                this.eventSurveyQ5C = data[0].Q5C;
                this.eventSurveyQ6 = data[0].Q6;
                this.eventSurveyQ7 = data[0].Q7;
                this.eventSurveyQ7C = data[0].Q7C;
                this.eventSurveyQ8 = data[0].Q8;
                this.eventSurveyQ9 = data[0].Q9;
                this.eventSurveyQ10 = data[0].Q10;
                this.eventSurveyQ10C = data[0].Q10C;
                this.eventSurveyQ11 = data[0].Q11;
                this.eventSurveyQ11C = data[0].Q11C;
            }
            this.cd.markForCheck();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    SubmitEvaluation() {
        console.log('Save evaluation (Conference)...');
        // Saving progress
        let saving = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Saving...'
        });
        // Alert for successful save
        let savealert = this.alertCtrl.create({
            title: 'Evaluation',
            subTitle: 'Evaluation has been saved.',
            buttons: ['Ok']
        });
        // Alert for failed save
        let failalert = this.alertCtrl.create({
            title: 'Evaluation Entry',
            subTitle: 'Unable to save your evaluation at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        // Alert for required fields
        let requiredalert = this.alertCtrl.create({
            title: 'Evaluation Entry',
            subTitle: 'All questions are required to be completed before saving.',
            buttons: ['Ok']
        });
        let requiredalert2 = this.alertCtrl.create({
            title: 'Evaluation Entry',
            subTitle: 'All questions are required to be completed before saving.  Some questions, when selecting No, require an additional comment to be entered.',
            buttons: ['Ok']
        });
        // Show saving progress
        saving.present();
        var Q1 = this.eventSurveyQ1;
        var Q2 = this.eventSurveyQ2;
        var Q3 = this.eventSurveyQ3;
        var Q4 = this.eventSurveyQ4;
        var Q5 = this.eventSurveyQ5;
        var Q5C = this.eventSurveyQ5C || '';
        var Q6 = this.eventSurveyQ6;
        var Q7 = this.eventSurveyQ7;
        var Q7C = this.eventSurveyQ7C || '';
        var Q8 = this.eventSurveyQ8;
        var Q9 = this.eventSurveyQ9;
        var Q10 = this.eventSurveyQ10;
        var Q10C = this.eventSurveyQ10C || '';
        var Q11 = this.eventSurveyQ11;
        var Q11C = this.eventSurveyQ11C || '';
        var EventID = "0";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var flags;
        // Validation checks
        var ValidationPass = true;
        var ValidationReason = "";
        if (this.eventSurveyQ1 == null || this.eventSurveyQ1 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ2 == null || this.eventSurveyQ2 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ3 == null || this.eventSurveyQ3 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ4 == null || this.eventSurveyQ4 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ5 == null || this.eventSurveyQ5 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ5 == "No") {
            if (this.eventSurveyQ5C == null || this.eventSurveyQ5C == "") {
                ValidationPass = false;
                ValidationReason = "No";
            }
        }
        if (this.eventSurveyQ6 == null || this.eventSurveyQ6 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ7 == null || this.eventSurveyQ7 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ7 == "No") {
            if (this.eventSurveyQ7C == null || this.eventSurveyQ7C == "") {
                ValidationPass = false;
                ValidationReason = "No";
            }
        }
        if (this.eventSurveyQ8 == null || this.eventSurveyQ8 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ9 == null || this.eventSurveyQ9 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ10 == null || this.eventSurveyQ10 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ10 == "No") {
            if (this.eventSurveyQ10C == null || this.eventSurveyQ10C == "") {
                ValidationPass = false;
                ValidationReason = "No";
            }
        }
        if (this.eventSurveyQ11 == null || this.eventSurveyQ11 == "") {
            ValidationPass = false;
        }
        if (this.eventSurveyQ11 == "Other") {
            if (this.eventSurveyQ11C == null || this.eventSurveyQ11C == "") {
                ValidationPass = false;
                ValidationReason = "No";
            }
        }
        if (ValidationPass == false) {
            saving.dismiss();
            if (ValidationReason == "") {
                requiredalert.present();
            }
            else {
                requiredalert2.present();
            }
        }
        else {
            // Get last update performed by this app
            var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
            if (LastUpdateDate == null) {
                // If never, then set variable and localStorage item to NA
                LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
            }
            flags = "es|" + EventID + "|Conference|" + Q1 + "|" + Q2 + "|" + Q3 + "|" + Q4 + "|" + Q5 + "|" + Q5C + "|" + Q6 + "|" + Q7 + "|" + Q7C + "|" + Q8 + "|" + Q9;
            flags = flags + "|" + Q10 + "|" + Q10C + "|" + Q11 + "|" + Q11C + "|" + LastUpdateDate;
            console.log('Save Evaluation (Conference) flags: ' + flags);
            this.databaseprovider.getEvaluationData(flags, AttendeeID).then(data => {
                console.log("getEvaluationData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].EVStatus == "Success") {
                        // Saved
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                    }
                    else {
                        // Not saved
                        console.log("Query: " + data[0].EVQuery);
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
};
EvaluationConference = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-evaluationconference',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/evaluationconference/evaluationconference.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n\n		<button ion-button menuToggle>\n\n			<ion-icon name="menu"></ion-icon>\n\n		</button>\n\n		<ion-title>Event Survey</ion-title>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider2"><h2>1.	What did you like the most about the conference?</h2></ion-item>\n\n	<label class="item item-input " id="survey-textarea2"></label>\n\n	<ion-item class="lmargin10" id="survey-textarea2">\n\n			<ion-textarea type="text" placeholder="Comments" [(ngModel)]="eventSurveyQ1" rows="3" name="Qu1"></ion-textarea>\n\n	</ion-item>\n\n\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider2"><h2>2.	What did you like least about the conference?</h2></ion-item>\n\n	<label class="item item-input " id="survey-textarea2"></label>\n\n	<ion-item class="lmargin10" id="survey-textarea2">\n\n			<ion-textarea type="text" placeholder="Comments" [(ngModel)]="eventSurveyQ2" rows="3" name="Qu2"></ion-textarea>\n\n	</ion-item>\n\n\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider2"><h2>3.	What could we have done to make your conference experience better?</h2></ion-item>\n\n	<label class="item item-input " id="survey-textarea2"></label>\n\n	<ion-item class="lmargin10" id="survey-textarea2">\n\n			<ion-textarea type="text" placeholder="Comments" [(ngModel)]="eventSurveyQ3" rows="3" name="Qu3"></ion-textarea>\n\n	</ion-item>\n\n\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider2"><h2>4.	What was your goal for attending the conference?</h2></ion-item>\n\n	<label class="item item-input " id="survey-textarea2"></label>\n\n	<ion-item class="lmargin10" id="survey-textarea2">\n\n			<ion-textarea type="text" placeholder="Comments" [(ngModel)]="eventSurveyQ4" rows="3" name="Qu4"></ion-textarea>\n\n	</ion-item>\n\n	\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider6"><h2>5. Did you meet your goal?</h2></ion-item>\n\n	<ion-list radio-group [(ngModel)]="eventSurveyQ5" name="Qu5" (ionChange)="mcqAnswer($event)">\n\n		<ion-item>\n\n			<ion-label>Yes</ion-label>\n\n			<ion-radio value="Yes"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>No</ion-label>\n\n			<ion-radio value="No"></ion-radio>\n\n		</ion-item>\n\n		<ion-item class="lmargin10" id="survey-textarea6">\n\n			<ion-textarea type="text" placeholder="If no, why were your goals not met?"[(ngModel)]="eventSurveyQ5C" rows="3" name="Qu5C"></ion-textarea>\n\n		</ion-item>\n\n	</ion-list>\n\n\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider7"><h2>6. What’s the idea you heard that you were most excited to take back to the office?</h2></ion-item>\n\n	<label class="item item-input" id="survey-textarea7"></label>\n\n	<ion-item class="lmargin10" id="survey-textarea7a">\n\n			<ion-textarea type="text" placeholder="Comments"[(ngModel)]="eventSurveyQ6" rows="3" name="Qu6"></ion-textarea>\n\n	</ion-item>\n\n	\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider8"><h2>7. If you attended the complex case presentations, did it meet your learning objectives:</h2></ion-item>\n\n	<ion-list radio-group [(ngModel)]="eventSurveyQ7" name="Qu7">\n\n		<ion-item>\n\n			<ion-label>Yes</ion-label>\n\n			<ion-radio value="Yes"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>No</ion-label>\n\n			<ion-radio value="No"></ion-radio>\n\n		</ion-item>\n\n		<ion-item class="lmargin10" id="survey-textarea8">\n\n			<ion-textarea type="text" placeholder="If no, why not?"[(ngModel)]="eventSurveyQ7C" rows="3" name="Qu7C"></ion-textarea>\n\n		</ion-item>\n\n	</ion-list>\n\n\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider9"><h2>8. What other educational topics would you like to have added to the program?</h2></ion-item>\n\n	<label class="item item-input " id="survey-textarea9"></label>\n\n	<ion-item class="lmargin10" id="survey-textarea9a">\n\n			<ion-textarea type="text" placeholder="Comments"[(ngModel)]="eventSurveyQ8" rows="3" name="Qu8"></ion-textarea>\n\n	</ion-item>\n\n	\n\n	<ion-item text-wrap class="item-divider" id="survey-list-item-divider10"><h2>9. Do you plan to attend the conference next year?</h2></ion-item>\n\n	<ion-list radio-group [(ngModel)]="eventSurveyQ9" name="Qu9">\n\n		<ion-item>\n\n			<ion-label>Yes</ion-label>\n\n			<ion-radio value="Yes"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>No</ion-label>\n\n			<ion-radio value="No"></ion-radio>\n\n		</ion-item>\n\n	</ion-list>\n\n\n\n	<ion-item text-wrap class="item-divider item-text-wrap" id="survey-list-item-divider11"><h2>10. Would you recommend this conference to your peers to attend next year?</h2></ion-item>\n\n	<ion-list radio-group [(ngModel)]="eventSurveyQ10" name="Qu10">\n\n		<ion-item>\n\n			<ion-label>Yes</ion-label>\n\n			<ion-radio value="Yes"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>No</ion-label>\n\n			<ion-radio value="No"></ion-radio>\n\n		</ion-item>\n\n		<ion-item class="lmargin10" id="survey-textarea9">\n\n			<ion-textarea type="text" placeholder="If no, why not?"[(ngModel)]="eventSurveyQ10C" rows="3" name="Qu10C"></ion-textarea>\n\n		</ion-item>\n\n	</ion-list>\n\n\n\n	<ion-item text-wrap class="item-divider item-text-wrap" id="survey-list-item-divider12"><h2>11. How did you learn about the conference?</h2></ion-item>\n\n	<ion-list radio-group [(ngModel)]="eventSurveyQ11" name="Qu11">\n\n		<ion-item>\n\n			<ion-label>E-mail from AACD</ion-label>\n\n			<ion-radio value="Email"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>Recommendation from a colleague</ion-label>\n\n			<ion-radio value="Recommendation"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>Website search</ion-label>\n\n			<ion-radio value="Website"></ion-radio>\n\n		</ion-item>\n\n		<ion-item>\n\n			<ion-label>Other</ion-label>\n\n			<ion-radio value="Other"></ion-radio>\n\n		</ion-item>\n\n		<ion-item class="lmargin10" id="survey-textarea12C">\n\n			<ion-textarea type="text" placeholder="Please specify"[(ngModel)]="eventSurveyQ11C" rows="3" name="Qu11C"></ion-textarea>\n\n		</ion-item>\n\n	</ion-list>\n\n\n\n\n\n	<div text-center>\n\n		<button ion-button style="background:#2196f3" (click)="SubmitEvaluation()">\n\n			SUBMIT\n\n		</button>\n\n	</div>\n\n\n\n	<div class="spacer" style="width:320px; height: 16px;"></div>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/evaluationconference/evaluationconference.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], EvaluationConference);

//# sourceMappingURL=evaluationconference.js.map

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SpeakersPage; });
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






let SpeakersPage = class SpeakersPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.SpeakerListing = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SpeakersPage');
    }
    handleKeyboardEvent(event) {
        if (event.key == 'Enter') {
            console.log('Enter key detected');
            this.GetSearchResults();
        }
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.SpeakerListing = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags = "li|Alpha|0";
        var DisplayName = "";
        var visDisplayCredentials = "";
        var SpeakerDividerCharacter = "";
        // Get the data
        this.databaseprovider.getSpeakerData(flags, "0").then(data => {
            //console.log("getSpeakerData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    DisplayName = "";
                    // Concatenate fields to build displayable name
                    DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
                    // AACD does not have middle name/initial for speakers
                    //if (data[i].MiddleInitial != "") {
                    //    DisplayName = DisplayName + " " + data[i].MiddleInitial;
                    //}
                    // Add credentials
                    visDisplayCredentials = "";
                    if (data[i].Credentials != "") {
                        visDisplayCredentials = data[i].Credentials;
                    }
                    //var imageAvatar = data[i].imageFilename;
                    //imageAvatar = imageAvatar.substr(0, imageAvatar.length - 3) + 'png';
                    //console.log("imageAvatar: " + imageAvatar);
                    //imageAvatar = "assets/img/speakers/" + imageAvatar;
                    var imageAvatar = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Speakers/" + data[i].imageFilename;
                    if (data[i].LastName.charAt(0) != SpeakerDividerCharacter) {
                        // Display the divider
                        this.SpeakerListing.push({
                            SpeakerID: 0,
                            DisplayNameLastFirst: data[i].LastName.charAt(0),
                            DisplayCredentials: "",
                            Affiliation: "",
                            speakerIcon: "nothing",
                            speakerAvatar: "assets/img/SpeakerDivider.png",
                            speakerClass: "",
                            navigationArrow: "nothing",
                        });
                        // Set the new marker point
                        SpeakerDividerCharacter = data[i].LastName.charAt(0);
                        // Show the current record
                        this.SpeakerListing.push({
                            SpeakerID: data[i].speakerID,
                            DisplayNameLastFirst: DisplayName,
                            DisplayCredentials: visDisplayCredentials,
                            Affiliation: "",
                            speakerIcon: "person",
                            speakerAvatar: imageAvatar,
                            speakerClass: "",
                            navigationArrow: "arrow-dropright",
                        });
                    }
                    else {
                        // Add current record to the list
                        this.SpeakerListing.push({
                            SpeakerID: data[i].speakerID,
                            DisplayNameLastFirst: DisplayName,
                            DisplayCredentials: visDisplayCredentials,
                            Affiliation: "",
                            speakerIcon: "person",
                            speakerAvatar: imageAvatar,
                            speakerClass: "",
                            navigationArrow: "arrow-dropright",
                        });
                    }
                }
            }
            else {
                // No records to show
                this.SpeakerListing.push({
                    SpeakerID: 0,
                    DisplayNameLastFirst: "No records available",
                    Affiliation: "",
                    speakerIcon: "",
                    speakerAvatar: "assets/img/personIcon.png",
                    speakerClass: "myLabelBold",
                    navigationArrow: "",
                });
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    SpeakerDetails(SpeakerID) {
        if (SpeakerID != 0) {
            // Navigate to Speaker Details page
            this.navCtrl.push('SpeakerDetailsPage', { SpeakerID: SpeakerID }, { animate: true, direction: 'forward' });
        }
    }
    ;
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
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('document:keypress', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], SpeakersPage.prototype, "handleKeyboardEvent", null);
SpeakersPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-speakers',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/speakers/speakers.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Speakers</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n	<ion-list id="speakers-list3">\n\n		<!-- Search input -->\n		<ion-grid>\n			<ion-row>\n				<ion-col col-9>	\n\n					<ion-item class="item-input; shadow">\n						<ion-icon name="search" item-left></ion-icon>\n						<ion-input name="srchBarEntry" id="srchBarEntry" \n						type="text" placeholder="Search" [(ngModel)]="EntryTerms"></ion-input>\n					</ion-item>\n				</ion-col>\n				<ion-col col-3>\n					<button ion-button full class="buttonPadding" (tap)="GetSearchResults()">Submit</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n\n		<!-- Speaker listing -->\n		<ion-list>\n			<ion-item (tap)="SpeakerDetails(speaker.SpeakerID)" *ngFor="let speaker of SpeakerListing" id="speaker-list-item19">\n				<div style="float: left; padding-right: 10px;">\n					<!-- <ion-icon name="{{speaker.speakerIcon}}"></ion-icon> -->\n					<ion-avatar item-start>\n						<img src="{{speaker.speakerAvatar}}" onerror="this.src=\'assets/img/personIcon.png\'">\n					</ion-avatar>\n				</div>\n				<ion-icon item-right name="{{speaker.navigationArrow}}"></ion-icon>\n				<h2 style="padding-top: 7px;">{{speaker.DisplayNameLastFirst}}</h2>\n				<p>{{speaker.DisplayCredentials}}</p>\n			</ion-item>\n		</ion-list>\n\n	</ion-list>\n\n</ion-content>\n\n\n\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/speakers/speakers.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], SpeakersPage);

//# sourceMappingURL=speakers.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SocialPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the Social page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let SocialPage = class SocialPage {
    constructor(navCtrl, navParams, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SocialPage');
    }
    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modify your album',
            buttons: [
                {
                    text: 'Destructive',
                    role: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                }, {
                    text: 'Archive',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }
};
SocialPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-social',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/social/social.html"*/'<!--\n  Generated template for the Social page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Social Media</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content has tabs>\n\n<div class="">\n            <img src="assets/img/social.jpg" width="100%" height="auto" style="display: block; margin-left: auto; margin-right: auto;">\n        </div>\n\n\n        <ion-list>\n          <ion-item href="#" onclick="window.open(\'https://www.facebook.com/theaacd25/\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left >\n              <img src="assets/img/facebook.png">\n            </ion-avatar>\n            <h2>Facebook</h2>\n          </ion-item>\n\n          <ion-item href="#" onclick="window.open(\'https://twitter.com/TheAACD?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/twitter.png">\n            </ion-avatar>\n            <h2>Twitter</h2>\n          </ion-item>\n\n          <ion-item href="#" onclick="window.open(\'https://www.linkedin.com/company/american-academy-of-cosmetic-dentistry\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/linkedin.png">\n            </ion-avatar>\n            <h2>Linkedin</h2>\n          </ion-item>\n\n          <ion-item href="#" onclick="window.open(\'https://www.instagram.com/theaacd/\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/instagram.jpeg">\n            </ion-avatar>\n            <h2>Instagram</h2>\n          </ion-item>\n\n\n          <ion-item href="#" onclick="window.open(\'https://www.flickr.com/photos/theaacd/\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/flickr.png">\n            </ion-avatar>\n            <h2>Flickr</h2>\n          </ion-item>\n\n          <ion-item href="#" onclick="window.open(\'https://www.pinterest.com/theaacd/\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/pinterest.png">\n            </ion-avatar>\n            <h2>Pinterest</h2>\n          </ion-item>\n\n          <ion-item href="#" onclick="window.open(\'https://www.youtube.com/user/AACD123\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/youtube.png">\n            </ion-avatar>\n            <h2>YouTube</h2>\n          </ion-item>\n\n          <ion-item href="#" onclick="window.open(\'https://www.aacd.com/index.php?module=login\', \'_system\', \'location=yes\'); return false;">\n            <ion-avatar item-left>\n              <img src="assets/img/myaacd.png">\n            </ion-avatar>\n            <h2>MyAACD</h2>\n          </ion-item>\n\n        </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/social/social.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
], SocialPage);

//# sourceMappingURL=social.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(54);
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






// Preload Pages

let ProfilePage = class ProfilePage {
    constructor(navCtrl, navParams, databaseprovider, loadingCtrl, alertCtrl, modal, imageLoaderConfig, _DomSanitizer, cd, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.databaseprovider = databaseprovider;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.modal = modal;
        this.imageLoaderConfig = imageLoaderConfig;
        this._DomSanitizer = _DomSanitizer;
        this.cd = cd;
        this.localstorage = localstorage;
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter ProfilePage');
        this.cd.markForCheck();
    }
    ngOnInit() {
        console.log('ProfilePage: ngOnInit');
        // Get AttendeeID
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
        if (DevicePlatform != 'Browser') {
            console.log('Set avatar to device');
            this.avatarDevice = true;
            this.avatarBrowser = false;
        }
        else {
            console.log('Set avatar to browser');
            this.avatarDevice = false;
            this.avatarBrowser = true;
        }
        // Setup defaul tprofile image
        this.imageLoaderConfig.setFallbackUrl('assets/img/personIcon.png');
        this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
        // Get profile image if available
        let rand = Math.floor(Math.random() * 20) + 1; // Prevents server caching of the image
        this.visualImageURL = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/" + AttendeeID + '.jpg?rnd=' + rand;
        console.log(this.visualImageURL);
        this.cd.markForCheck();
        // Get profile data
        var flags = "pr|";
        this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
            if (data['length'] > 0) {
                console.log('SocialMedia: ' + JSON.stringify(data));
                // Display attendee information
                this.prAttendeeName = data[0].FirstName + " " + data[0].LastName;
                this.prAttendeeTitle = data[0].Title;
                this.prAttendeeOrganization = data[0].Company;
                // Save current values to determine if a change was made
                this.localstorage.setLocalValue('prAttendeeTitle', data[0].Title);
                this.localstorage.setLocalValue('prAttendeeOrganization', data[0].Company);
                // Set color indications for social media icons
                if (data[0].showTwitter == "Y") {
                    this.statusTwitter = "green";
                }
                else {
                    this.statusTwitter = "gray";
                }
                if (data[0].showFacebook == "Y") {
                    this.statusFacebook = "green";
                }
                else {
                    this.statusFacebook = "gray";
                }
                if (data[0].showLinkedIn == "Y") {
                    this.statusLinkedIn = "green";
                }
                else {
                    this.statusLinkedIn = "gray";
                }
                if (data[0].showInstagram == "Y") {
                    this.statusInstagram = "green";
                }
                else {
                    this.statusInstagram = "gray";
                }
                if (data[0].showPinterest == "Y") {
                    this.statusPinterest = "green";
                }
                else {
                    this.statusPinterest = "gray";
                }
            }
            this.cd.markForCheck();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    UploadImage() {
        this.navCtrl.push('ProfileImagePage', {}, { animate: true, direction: 'forward' });
    }
    SignOut() {
        this.localstorage.setLocalValue('LoginWarning', '0');
        this.localstorage.setLocalValue('ForwardingPage', 'HomePage');
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
    }
    SaveProfileChanges() {
        // Saving progress
        let saving = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Saving...'
        });
        // Alert for successful save
        let savealert = this.alertCtrl.create({
            title: 'Profile Changes',
            subTitle: 'The changes to your Title and Organziation have been saved.',
            buttons: ['Ok']
        });
        // Alert for failed save
        let failalert = this.alertCtrl.create({
            title: 'Profile Changes',
            subTitle: 'Unable to save your changes at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        // Alert for no changes
        let nochangealert = this.alertCtrl.create({
            title: 'Profile Changes',
            subTitle: 'No changes have been made so there is nothing to save.',
            buttons: ['Ok']
        });
        // Get originally stored values
        var originalTitle = this.localstorage.getLocalValue('prAttendeeTitle');
        var originalCompany = this.localstorage.getLocalValue('prAttendeeOrganization');
        if (originalTitle == null || originalTitle === null || originalTitle == 'null') {
            originalTitle = '';
        }
        if (originalCompany == null || originalCompany === null || originalCompany == 'null') {
            originalCompany = '';
        }
        // Get currently entered values
        var prTitle = this.prAttendeeTitle;
        var prOrg = this.prAttendeeOrganization;
        if (prTitle == null || prTitle === null || prTitle == 'null') {
            prTitle = '';
        }
        if (prOrg == null || prOrg === null || prOrg == 'null') {
            prOrg = '';
        }
        console.log('originalTitle: ' + originalTitle);
        console.log('originalCompany: ' + originalCompany);
        console.log('prTitle: ' + prTitle);
        console.log('prOrg: ' + prOrg);
        if (originalTitle == prTitle && originalCompany == prOrg) {
            saving.dismiss();
            nochangealert.present();
        }
        else {
            // Send data to update database with disable
            var flags = 'ps|0|0|' + prTitle + '|' + prOrg;
            var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
            this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
                console.log("getDatabaseStats: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].Status == "Success") {
                        saving.dismiss();
                        savealert.present();
                    }
                    else {
                        saving.dismiss();
                        failalert.present();
                    }
                }
            }).catch(function () {
                console.log("ProfileSocialMediaEntryPage Promise Rejected");
                saving.dismiss();
            });
        }
    }
    EditSocialMediaLinks(smSocialMediaType) {
        this.localstorage.setLocalValue('SocialMediaType', smSocialMediaType);
        const AddProfileSocialMediaModalOptions = {
            enableBackdropDismiss: false
        };
        const AddProfileSocialMediaModal = this.modal.create('ProfileSocialMediaEntryPage', {}, AddProfileSocialMediaModalOptions);
        AddProfileSocialMediaModal.present();
        AddProfileSocialMediaModal.onDidDismiss((data) => {
            console.log('Post-closeModal, Returned status: ' + data);
            var ReturnedValues = data.split("|");
            if (ReturnedValues[0] == "Save") {
                var smButtonName = ReturnedValues[1];
                console.log('Post-closeModal, Button Name: ' + ReturnedValues[1]);
                console.log('Post-closeModal, Button Status: ' + ReturnedValues[3]);
                if (ReturnedValues[3] == 'Y') {
                    this[smButtonName] = "green";
                    this.cd.markForCheck();
                }
                else {
                    this[smButtonName] = "gray";
                    this.cd.markForCheck();
                }
            }
        });
    }
    toggleSocialMedia(smSocialMediaType) {
        if (this[smSocialMediaType] == "green") {
            // Disable onscreen button
            this[smSocialMediaType] = "gray";
            // Send data to update database with disable
            var flags = 'pd|' + smSocialMediaType + '|';
            var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
            this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
                console.log("getDatabaseStats: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log("Return status: " + data[0].Status);
                }
            }).catch(function () {
                console.log("ProfileSocialMediaEntryPage Promise Rejected");
            });
        }
        else {
            // Set indicator to green and request link
            this[smSocialMediaType] = "green";
            this.localstorage.setLocalValue('SocialMediaType', smSocialMediaType);
            const AddProfileSocialMediaModalOptions = {
                enableBackdropDismiss: false
            };
            const AddProfileSocialMediaModal = this.modal.create('ProfileSocialMediaEntryPage', {}, AddProfileSocialMediaModalOptions);
            AddProfileSocialMediaModal.present();
            AddProfileSocialMediaModal.onDidDismiss((data) => {
                console.log('Returned status: ' + data);
                // If saved, then re-run ngOnInit to refresh the listing
                if (data == "Save") {
                    this.ngOnInit();
                }
                if (data == "NoEntry") {
                    console.log('Updating: ' + smSocialMediaType);
                    this[smSocialMediaType] = "gray";
                    this.cd.markForCheck();
                }
            });
        }
    }
};
ProfilePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-profile',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/profile/profile.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Your Profile</ion-title>\n	</ion-navbar>\n</ion-header>\n\n\n<ion-content class="bg-style" padding>\n\n\n    <ion-grid>\n		<!-- Avatar row to show ehen using a device; allows updating image -->\n        <ion-row  *ngIf=avatarDevice>\n      \n            <ion-col>\n              <ion-item no-lines style="background:transparent">\n                  <ion-avatar>\n					<img [src]="_DomSanitizer.bypassSecurityTrustUrl(visualImageURL)" (click)="UploadImage()" onerror="this.src=\'assets/img/missing-image.png\'">\n                  </ion-avatar>\n                 </ion-item>\n                </ion-col>\n                \n                <ion-col style="background:transparent;color:#444">\n                    <ion-item no-lines style="background:transparent;color:#444">\n                        <p text-wrap style="background:transparent;color:#444;font-size:14px;font-weight:600">Tap the image to change your profile picture</p>\n                    </ion-item>\n                </ion-col>\n            </ion-row>\n        </ion-grid>\n\n\n        <ion-grid>\n		<!-- Avatar row to show when using a browser; static image -->\n        <ion-row style="background:transparent" *ngIf=avatarBrowser>\n    \n          <ion-col col-6>\n              <ion-item no-lines style="background:transparent">\n                  <ion-avatar>\n					<img [src]="visualImageURL" onerror="this.src=\'assets/img/missing-image.png\'">\n                  </ion-avatar>\n                </ion-item>\n            </ion-col>\n\n                  <ion-col col-6>\n                        <ion-item no-lines style="background:transparent; margin-top:10%">\n                            <p text-wrap style="background:transparent;color:#fff;font-size:14px"></p>\n                        </ion-item>\n                    </ion-col>\n                </ion-row>\n            </ion-grid>\n\n\n\n\n<ion-grid>\n        <ion-row>\n			<ion-col>\n				<p style="text-align:center;color:#444">Edit information that other attendees see when viewing your profile.<span *ngIf=avatarBrowser>&nbsp;\n				Update your profile image from your mobile device.</span></p>\n			</ion-col>\n        </ion-row>\n        <ion-row style="margin-left:10px; margin-right:10px">\n            <ion-col>\n				<ion-item style="color:#000">{{prAttendeeName}}</ion-item>\n            </ion-col>\n        </ion-row>\n        <ion-row style="margin-left:10px; margin-right:10px">\n            <ion-col>\n				<ion-item>\n					<ion-input class="InputBoxW" type="text" placeholder="Job Title" (input)=\'prAttendeeTitle = $event.target.value\' name="prAttendeeTitle" [value]="prAttendeeTitle" id="prAttendeeTitle"></ion-input>\n				</ion-item>\n            </ion-col>\n        </ion-row>\n        <ion-row style="margin-left:10px; margin-right:10px">\n            <ion-col>\n				<ion-item>\n					<ion-input class="InputBoxW" type="text" placeholder="Organization Name" (input)=\'prAttendeeOrganization = $event.target.value\' name="prAttendeeOrganization" [value]="prAttendeeOrganization" id="prAttendeeOrganization"></ion-input>\n				</ion-item>\n            </ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-col>\n				<ion-grid>\n					<ion-row>\n						<ion-col>\n							<button ion-button block style="background:#2196f3" (click)="SaveProfileChanges()">\n								Save\n							</button>\n						</ion-col>\n						<ion-col>\n							<button ion-button block style="background:#2196f3" (click)="SignOut()">\n								Sign Out\n							</button>\n						</ion-col>\n					</ion-row>\n				</ion-grid>\n            </ion-col>\n        </ion-row>\n\n        <ion-row style="margin:0">\n		<ion-col col-11 style="margin:0">\n			<p style="text-align:center;color:#444">Tap an icon to enter your URL and show the link in your profile.</p>\n        </ion-col>\n    </ion-row>\n\n\n        <ion-row>\n            <ion-col col-1>\n            </ion-col>\n            <ion-col col-2>\n                <ion-icon [color]=statusTwitter name="logo-twitter" (tap)="EditSocialMediaLinks(\'statusTwitter\')"></ion-icon>\n            </ion-col>\n            <ion-col col-2>\n                <ion-icon [color]=statusFacebook name="logo-facebook" (tap)="EditSocialMediaLinks(\'statusFacebook\')"></ion-icon>\n            </ion-col>\n            <ion-col col-2>\n                <ion-icon [color]=statusLinkedIn name="logo-linkedin" (tap)="EditSocialMediaLinks(\'statusLinkedIn\')"></ion-icon>\n            </ion-col>\n            <ion-col col-2>\n                <ion-icon [color]=statusInstagram name="logo-instagram" (tap)="EditSocialMediaLinks(\'statusInstagram\')"></ion-icon>\n            </ion-col>\n            <ion-col col-2>\n                <ion-icon [color]=statusPinterest name="logo-pinterest" (tap)="EditSocialMediaLinks(\'statusPinterest\')"></ion-icon>\n            </ion-col>\n        </ion-row>\n      </ion-grid>\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/profile/profile.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_3_ionic_image_loader__["a" /* ImageLoaderConfig */],
        __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["c" /* DomSanitizer */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_2__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ProfilePage);

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Localstorage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let Localstorage = class Localstorage {
    // Store the key-value pair passed to this function
    setLocalValue(itemID, itemValue) {
        localStorage.setItem(itemID, itemValue);
        console.log('Localstorage provider: Set ' + itemID + ' to ' + itemValue);
    }
    // Get the stored value for the key passed to this function
    getLocalValue(itemID) {
        var itemValue = localStorage.getItem(itemID);
        console.log('Localstorage provider: Retrieved ' + itemID + ': ' + itemValue);
        return itemValue;
    }
};
Localstorage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], Localstorage);

//# sourceMappingURL=localstorage.js.map

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProgramPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__speakers_speakers__ = __webpack_require__(111);
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




// Pages

let ProgramPage = class ProgramPage {
    constructor(navCtrl, navParams, nav, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nav = nav;
        this.localstorage = localstorage;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad: ProgramPage');
    }
    DisplayListing(listingType) {
        // Store selection in localStorage for the next page
        this.localstorage.setLocalValue('ListingType', listingType);
        console.log('Listing Type: ' + listingType);
        switch (listingType) {
            case "Speakers":
                // Navigate to Speakers page
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__speakers_speakers__["a" /* SpeakersPage */], {}, { animate: true, direction: 'forward' });
                break;
            case "SearchbyTopic":
                // Navigate to Speakers page
                this.navCtrl.push('SearchByTopicPage', {}, { animate: true, direction: 'forward' });
                break;
            default:
                // Navigate to Listing page
                this.navCtrl.push('ListingLevel1', { listingType: listingType }, { animate: true, direction: 'forward' });
                break;
        }
    }
    navToClientWebsite() {
        var WebsiteURL = "https://www.aacd.com/index.php?module=aacd.websiteforms&cmd=aacdconvergenceauth";
        var u = this.localstorage.getLocalValue('loginUsername');
        var p = this.localstorage.getLocalValue('loginPassword');
        // Create URL string
        WebsiteURL = WebsiteURL + "&u=" + u + "&p=" + p;
        // Open website
        window.open(WebsiteURL, '_system');
    }
};
ProgramPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-program',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/program/program.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Program</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<!-- Search input \n	<div class="list marginTB0">\n		<div class="item item-input">\n			<i class="icon {{tabSearch}} iconSize"></i>\n			<input id="srchBarEntry" type="text" placeholder="Search" ngModel="search.EntryTerms">\n			<button class="button button-small blue" ngClick="GetSearchResults()">\n				Submit\n			</button>\n		</div>\n	</div>\n	-->\n\n	<div class="myPaddingLR" style="background:#f9f9f9; color:#444;padding-top:10px!important; padding-bottom:10px!important">\n\n		<h3>Getting Started!</h3>\n		<h6>  Step 1: Login to populate your pre-registered sessions.</h6> \n		<h6>  Step 2: Add sessions by using the button below.</h6>\n		<h6>  Step 3: New sessions should be shown within 30 mins.</h6>\n		<!-- Disabled per LIsa Bollenbach 2018-04-19 -->\n		<!--<p style="font-size:14px; margin-top:0px">Note: If you do not see a confirmed session, use the add button for that session.</p>-->\n	\n\n    <div text-center>\n			<button ion-button style="background:#2196f3" (click)="navToClientWebsite()">\n			  Edit / Select Courses \n			</button>\n		  </div>\n		</div>\n\n	<!-- Program Overview -->\n	<ion-list>\n		<!--\n		<ion-item class="item-icon-left item-icon-right wineBG myTextWhite" ngClick="navToClientWebsite()" >\n			<i class="icon {{tabRegistration}}"></i>Edit/Select Courses\n			<i class="icon {{navigationRightArrow}}"></i>\n		</ion-item>\n		-->\n\n	\n		<button ion-item (click)="DisplayListing(\'SearchbyTopic\')" id="program-list-item1">\n			<ion-icon color="secondary" item-left name="search"></ion-icon>\n			<ion-icon color="secondary" item-right name="arrow-dropright"></ion-icon>\n			<h2>Search by Topic</h2>\n		</button>\n\n\n		<button ion-item (click)="DisplayListing(\'Lectures\')" id="program-list-item3">\n			<ion-icon color="secondary" item-left name="list"></ion-icon>\n			<ion-icon color="secondary" item-right name="arrow-dropright"></ion-icon>\n			<h2>Lectures</h2>\n		</button>\n\n		<button ion-item (click)="DisplayListing(\'Participation\')" id="program-list-item4">\n			<ion-icon color="secondary" item-left name="list"></ion-icon>\n			<ion-icon color="secondary" item-right name="arrow-dropright"></ion-icon>\n			<h2>Workshops</h2>\n		</button>\n\n		<button ion-item (click)="DisplayListing(\'Receptions\')" id="program-list-item5">\n			<ion-icon color="secondary" item-left name="people"></ion-icon>\n			<ion-icon color="secondary" item-right name="arrow-dropright"></ion-icon>\n			<h2>Receptions and Other Events</h2>\n		</button>\n\n		<button ion-item (click)="DisplayListing(\'Speakers\')" id="program-list-item2">\n			<ion-icon color="secondary" item-left name="mic"></ion-icon>\n			<ion-icon color="secondary" item-right name="arrow-dropright"></ion-icon>\n			<h2>Speakers</h2>\n		</button>\n\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/program/program.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ProgramPage);

//# sourceMappingURL=program.js.map

/***/ }),

/***/ 167:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConferenceCityPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let ConferenceCityPage = class ConferenceCityPage {
    constructor(navCtrl) {
        this.navCtrl = navCtrl;
    }
};
ConferenceCityPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-conferencecity',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/conferencecity/conferencecity.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      San Diego\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n    <div class="">\n            <img src="assets/img/gaslamp.jpg" width="100%" height="auto" style="display: block; margin-left: auto; margin-right: auto;">\n        </div>\n\n\n  <ion-list id="lasvegas-list11" class=" ">\n            <ion-item class="item-avatar item-icon-right  " id="lasvegas-list-item30" href="#" onclick="window.open(\'https://www.san.org/\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/ohareAP.jpg">\n                    </ion-avatar>\n                <h2>San Diego International Airport</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n            <ion-item class="item-avatar item-icon-right  " id="anaheim-list-item33" href="#" \n            onclick="window.open(\'https://www.zagat.com/san-diego\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/Zagat_Logo.jpeg">\n                      </ion-avatar>\n                <h2>Restaurants</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n            <ion-item class="item-avatar item-icon-right  " id="anaheim-list-item54" href="#" \n            onclick="window.open(\'https://www.marriott.com/hotels/travel/sandt-marriott-marquis-san-diego-marina/\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/marquis.jpg">\n                      </ion-avatar>\n                <h2>Hotels</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n\n\n            <ion-item class="item-avatar item-icon-right  " id="anaheim-list-item54" href="#" \n            onclick="window.open(\'https://www.sandiego.org/articles/shopping/san-diego-comprehensive-shopping-guide.aspx\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/chicagoShop.jpg">\n                      </ion-avatar>\n                <h2>Shopping</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n\n\n            <ion-item class="item-avatar item-icon-right  " id="anaheim-list-item55" href="#" \n            onclick="window.open(\'https://weather.com/weather/tenday/l/USCA0982:1:US\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/nicubunu-Weather-Symbols-Sun.png">\n                      </ion-avatar>\n                <h2>Weather</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n            <ion-item class="item-avatar item-icon-right  " id="anaheim-list-item56" href="#" \n            onclick="window.open(\'https://www.yelp.com/city/san-diego\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/yelp.png">\n                      </ion-avatar>\n                <h2>Yelp!</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n            <ion-item class="item-avatar item-icon-right  " id="anaheim-list-item57" href="#" onclick="window.open(\'https://www.uber.com/\', \'_system\', \'location=yes\'); return false;">\n  <ion-avatar item-left>\n                <img src="assets/img/Uber_Logo_1.png">\n                      </ion-avatar>\n                <h2>Uber</h2>\n                <i class="icon ion-ios-arrow-right"></i>\n            </ion-item>\n\n        </ion-list>\n    </ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/conferencecity/conferencecity.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */]])
], ConferenceCityPage);

//# sourceMappingURL=conferencecity.js.map

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_leaflet__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_leaflet__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let MapPage = class MapPage {
    constructor(navCtrl, platform) {
        this.navCtrl = navCtrl;
        this.platform = platform;
    }
    ngOnInit() {
        // -----------------
        // Show Level 1
        // -----------------
        this.myMap2 = __WEBPACK_IMPORTED_MODULE_2_leaflet__["map"]('mapLevel2', {
            crs: __WEBPACK_IMPORTED_MODULE_2_leaflet__["CRS"].Simple,
            minZoom: -1,
            maxZoom: 1,
            zoomControl: true
        });
        var bounds = __WEBPACK_IMPORTED_MODULE_2_leaflet__["latLngBounds"]([0, 0], [1900, 1700]); // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
        var image = __WEBPACK_IMPORTED_MODULE_2_leaflet__["imageOverlay"]('assets/img/overview.png', bounds, {
            attribution: 'Convergence'
        }).addTo(this.myMap2);
        this.myMap2.fitBounds(bounds);
        this.myMap2.setMaxBounds(bounds);
        // -----------------
        // Show Level 2
        // -----------------
        this.myMap3 = __WEBPACK_IMPORTED_MODULE_2_leaflet__["map"]('mapLevel3', {
            crs: __WEBPACK_IMPORTED_MODULE_2_leaflet__["CRS"].Simple,
            minZoom: -1,
            maxZoom: 1,
            zoomControl: true
        });
        var bounds = __WEBPACK_IMPORTED_MODULE_2_leaflet__["latLngBounds"]([0, 0], [1500, 1700]); // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
        var image = __WEBPACK_IMPORTED_MODULE_2_leaflet__["imageOverlay"]('assets/img/groundlevel.png', bounds, {
            attribution: 'Convergence'
        }).addTo(this.myMap3);
        this.myMap3.fitBounds(bounds);
        this.myMap3.setMaxBounds(bounds);
        // -----------------
        // Show Level 3
        // -----------------
        this.myMap4 = __WEBPACK_IMPORTED_MODULE_2_leaflet__["map"]('mapLevel4', {
            crs: __WEBPACK_IMPORTED_MODULE_2_leaflet__["CRS"].Simple,
            minZoom: -1,
            maxZoom: 1,
            zoomControl: true
        });
        var bounds = __WEBPACK_IMPORTED_MODULE_2_leaflet__["latLngBounds"]([0, 0], [1500, 1700]); // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
        var image = __WEBPACK_IMPORTED_MODULE_2_leaflet__["imageOverlay"]('assets/img/mezzaninelevel.png', bounds, {
            attribution: 'Convergence'
        }).addTo(this.myMap4);
        this.myMap4.fitBounds(bounds);
        this.myMap4.setMaxBounds(bounds);
        // -----------------
        // Show Concourse
        // -----------------
        this.myMap5 = __WEBPACK_IMPORTED_MODULE_2_leaflet__["map"]('mapLevel5', {
            crs: __WEBPACK_IMPORTED_MODULE_2_leaflet__["CRS"].Simple,
            minZoom: -1,
            maxZoom: 1,
            zoomControl: true
        });
        var bounds = __WEBPACK_IMPORTED_MODULE_2_leaflet__["latLngBounds"]([0, 0], [1200, 1700]); // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
        var image = __WEBPACK_IMPORTED_MODULE_2_leaflet__["imageOverlay"]('assets/img/upperlevel.png', bounds, {
            attribution: 'Convergence'
        }).addTo(this.myMap5);
        this.myMap5.fitBounds(bounds);
        this.myMap5.setMaxBounds(bounds);
    }
};
MapPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-map',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/map/map.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Maps</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n\n<ion-content padding>\n\n	<ion-card>\n		<ion-card-header style="background:#283593; color:#fff">\n			Overview\n		</ion-card-header>\n        <div id="mapLevel2" style="width:100%; height:500px;"></div>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header style="background:#283593; color:#fff">\n			Ground Level\n		</ion-card-header>\n        <div id="mapLevel3" style="width:100%; height:500px;"></div>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header style="background:#283593; color:#fff">\n			Mezzanine Level\n		</ion-card-header>\n        <div id="mapLevel4" style="width:100%; height:500px;"></div>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header style="background:#283593; color:#fff">\n			Ballroom Level\n		</ion-card-header>\n        <div id="mapLevel5" style="width:100%; height:500px;"></div>\n	</ion-card>\n\n	\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/map/map.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* Platform */]])
], MapPage);

//# sourceMappingURL=map.js.map

/***/ }),

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExhibitorsPage; });
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






let ExhibitorsPage = class ExhibitorsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.ExhibitorListing = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ExhibitorsPage');
    }
    handleKeyboardEvent(event) {
        if (event.key == 'Enter') {
            console.log('Enter key detected');
            this.GetSearchResults();
        }
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.ExhibitorListing = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags = "li|Alpha|0";
        var dayID;
        var DisplayLocation = "";
        var ExhibitorDividerCharacter = "";
        // Get the data
        this.databaseprovider.getExhibitorData(flags).then(data => {
            console.log("getExhibitorData: " + JSON.stringify(data));
            // If data was returned, the create list
            if (data['length'] > 0) {
                // Loop through data
                for (var i = 0; i < data['length']; i++) {
                    // Construct location based on US or International
                    if ((data[i].Country != "United States") && (data[i].Country != "")) {
                        DisplayLocation = data[i].City + ", " + data[i].Country;
                    }
                    else {
                        DisplayLocation = data[i].City + ", " + data[i].State;
                    }
                    // If Exhibitor is not in same grouping, create new divider bar
                    if (data[i].CompanyName.charAt(0) != ExhibitorDividerCharacter) {
                        // Display the divider
                        this.ExhibitorListing.push({
                            ExhibitorID: 0,
                            CompanyName: data[i].CompanyName.charAt(0),
                            DisplayCityState: "",
                            BoothNumber: "",
                            exhibitorIcon: "nothing",
                            exhibitorClass: "wineDivider",
                            navigationArrow: "nothing"
                        });
                        // Set the new marker point
                        ExhibitorDividerCharacter = data[i].CompanyName.charAt(0);
                        // Show the current record
                        this.ExhibitorListing.push({
                            ExhibitorID: data[i].ExhibitorID,
                            CompanyName: data[i].CompanyName,
                            DisplayCityState: DisplayLocation,
                            BoothNumber: "Booth: " + data[i].BoothNumber,
                            exhibitorIcon: "people",
                            exhibitorClass: "myLabelBold",
                            navigationArrow: "arrow-dropright"
                        });
                    }
                    else {
                        this.ExhibitorListing.push({
                            ExhibitorID: data[i].ExhibitorID,
                            CompanyName: data[i].CompanyName,
                            DisplayCityState: DisplayLocation,
                            BoothNumber: "Booth: " + data[i].BoothNumber,
                            exhibitorIcon: "people",
                            exhibitorClass: "myLabelBold",
                            navigationArrow: "arrow-dropright"
                        });
                    }
                }
            }
            else {
                this.ExhibitorListing.push({
                    ExhibitorID: 0,
                    CompanyName: "No records available",
                    DisplayCityState: "",
                    BoothNumber: "",
                    exhibitorIcon: "",
                    exhibitorClass: "myLabelBold",
                    navigationArrow: ""
                });
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    ExhibitorDetails(ExhibitorID) {
        if (ExhibitorID != 0) {
            // Navigate to Exhibitor Details page
            this.navCtrl.push('ExhibitorDetailsPage', { ExhibitorID: ExhibitorID }, { animate: true, direction: 'forward' });
        }
    }
    ;
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
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('document:keypress', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], ExhibitorsPage.prototype, "handleKeyboardEvent", null);
ExhibitorsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-exhibitors',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/exhibitors/exhibitors.html"*/'<ion-header>\n\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Exhibitors</ion-title>\n	</ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n	<ion-list id="Exhibitors-list3">\n\n		<!-- Search input -->\n		<ion-grid>\n			<ion-row>\n				<ion-col col-9>	\n\n					<ion-item>\n						<ion-icon name="search" item-left></ion-icon>\n						<ion-input name="srchBarEntry" id="srchBarEntry" \n						type="text" placeholder="Search" [(ngModel)]="EntryTerms"></ion-input>\n					</ion-item>\n				</ion-col>\n				<ion-col col-3>\n					<button ion-button full style="background:#2196f3; margin:0" (tap)="GetSearchResults()">Submit</button>\n				</ion-col>\n			</ion-row>\n		</ion-grid>\n\n		<!-- Exhibitor listing -->\n		<ion-list>\n			<ion-item (tap)="ExhibitorDetails(exhibitor.ExhibitorID)" *ngFor="let exhibitor of ExhibitorListing" id="exhibitors-list-item19">\n				<ion-icon color="secondary" item-left name="{{exhibitor.exhibitorIcon}}"></ion-icon>\n				<ion-icon color="secondary" item-right name="{{exhibitor.navigationArrow}}"></ion-icon>\n				<h2>{{exhibitor.CompanyName}}</h2>\n				<p>{{exhibitor.DisplayCityState}}</p>\n				<p>{{exhibitor.BoothNumber}}</p>\n			</ion-item>\n		</ion-list>\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/exhibitors/exhibitors.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ExhibitorsPage);

//# sourceMappingURL=exhibitors.js.map

/***/ }),

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NetworkingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__attendees_attendees__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__profile_profile__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__notifications_notifications__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__activity_activity__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__social_social__ = __webpack_require__(112);
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




// Pages

//import { ConversationsPage } from '../conversations/conversations';
//import { ConversationsPage } from '../conversations/conversations';




let NetworkingPage = class NetworkingPage {
    constructor(navCtrl, navParams, nav, databaseprovider, alertCtrl, cd, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nav = nav;
        this.databaseprovider = databaseprovider;
        this.alertCtrl = alertCtrl;
        this.cd = cd;
        this.localstorage = localstorage;
        this.NewMessagesIndicator = false;
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: NetworkingPage');
        var DCArrayString = this.localstorage.getLocalValue('DirectChatMonitoringString');
        console.log('DCArrayString: ' + DCArrayString);
        if (DCArrayString !== null) {
            var data2 = JSON.parse(DCArrayString);
            if (data2['length'] > 0) {
                console.log('data2, NewMessages: ' + data2[0].NewMessages);
                this.NewMessagesCounter = data2[0].NewMessages;
                if (data2[0].NewMessages == "0") {
                    this.NewMessagesIndicator = false;
                }
                else {
                    this.NewMessagesIndicator = true;
                }
            }
            else {
                this.NewMessagesIndicator = false;
            }
        }
        else {
            this.NewMessagesIndicator = true;
        }
        this.cd.markForCheck();
    }
    NavigateTo(page) {
        if (page == 'Conversations' || page == 'ActivityFeed') {
            var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
            var flags = "cn";
            this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
                if (data[0].Status == "Connected") {
                    switch (page) {
                        case "Conversations":
                            // Navigate to Conversations page
                            this.navCtrl.push('ConversationsPage', {}, { animate: true, direction: 'forward' });
                            break;
                        case "ActivityFeed":
                            // Navigate to Activity Feed page
                            this.localstorage.setLocalValue('ActivityFeedID', '0');
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__activity_activity__["a" /* ActivityPage */], {}, { animate: true, direction: 'forward' });
                            break;
                        case "Attendees":
                            // Navigate to Activity Feed page
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__attendees_attendees__["a" /* AttendeesPage */], {}, { animate: true, direction: 'forward' });
                            break;
                        case "MyProfile":
                            // Navigate to Activity Feed page
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__profile_profile__["a" /* ProfilePage */], {}, { animate: true, direction: 'forward' });
                            break;
                    }
                }
                else {
                    let alert = this.alertCtrl.create({
                        title: 'Internet Error',
                        subTitle: 'You need to have Internet access in order to use that feature.',
                        buttons: ['OK']
                    });
                    alert.present();
                }
            });
        }
        else {
            switch (page) {
                case "Attendees":
                    // Navigate to Attendees page
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__attendees_attendees__["a" /* AttendeesPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Conversations":
                    // Navigate to Conversations page
                    this.navCtrl.push('ConversationsPage', {}, { animate: true, direction: 'forward' });
                    break;
                case "MyProfile":
                    // Navigate to Profile page
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__profile_profile__["a" /* ProfilePage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Notifications":
                    // Navigate to Notifications page
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__notifications_notifications__["a" /* NotificationsPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "SocialMedia":
                    // Navigate to Social Media page
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__social_social__["a" /* SocialPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "ActivityFeed":
                    // Navigate to Activity Feed page
                    this.localstorage.setLocalValue('ActivityFeedID', '0');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__activity_activity__["a" /* ActivityPage */], {}, { animate: true, direction: 'forward' });
                    break;
            }
        }
    }
};
NetworkingPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-networking',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/networking/networking.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Networking</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="networking" style="background:#0b172a">\n\n	<ion-grid>\n	\n		<ion-row style="background:#283593">\n			<ion-col align-self-center style="background:#283593; height:100%">\n				<ion-item no-lines detail-none class="buttonShape" style="background:#283593" (click)="NavigateTo(\'Attendees\')" id="program-list-item1">\n					<ion-icon name="contacts" class="buttonIconsL"></ion-icon>\n					<h2>Attendees</h2>\n				</ion-item>\n			</ion-col>\n\n			<ion-col align-self-center style="background:#2196f3; height:100%">\n				<ion-item no-lines detail-none class="buttonShape" style="background:#2196f3"  (click)="NavigateTo(\'Conversations\')" id="program-list-item3">\n					<ion-icon name="chatbubbles" class="buttonIconsL"></ion-icon>\n					<h2>Conversations</h2>\n					<p *ngIf=NewMessagesIndicator style="color:#fff;">{{NewMessagesCounter}} New Messages</p>\n				</ion-item>\n			</ion-col>\n		</ion-row>\n		\n		<ion-row style="background:#2196f3"> \n			<ion-col align-self-center style="background:#2196f3; height:100%">\n				<button ion-item no-lines detail-none class="buttonShape" style="background:#2196f3;" (click)="NavigateTo(\'MyProfile\')" id="program-list-item5">\n					<ion-icon name="contact" class="buttonIconsL"></ion-icon>\n					<h2>My Profile</h2>\n				</button>\n			</ion-col>\n			\n			<ion-col align-self-center style="background:#283593; height:100%">\n				<button ion-item no-lines detail-none class="buttonShape" style="background:#283593" (click)="NavigateTo(\'Notifications\')" id="program-list-item2">\n					<ion-icon name="alert" class="buttonIconsL"></ion-icon>\n					<h2>Notifications</h2>\n				</button>\n			</ion-col>\n		</ion-row>\n		\n		<ion-row style="background:#283593">\n			<ion-col align-self-center style="background:#283593; height:100%">\n				<button ion-item no-lines detail-none class="buttonShape" style="background:#283593" (click)="NavigateTo(\'ActivityFeed\')" id="program-list-item5">\n					<ion-icon name="chatboxes" class="buttonIconsL"></ion-icon>\n					<h2>Activities Feed</h2>\n				</button>\n			</ion-col>\n			\n			<ion-col align-self-center style="background:#2196f3; height:100%">\n				<button ion-item no-lines detail-none class="buttonShape" style="background:#2196f3;" (click)="NavigateTo(\'SocialMedia\')" id="program-list-item2">\n					<ion-icon name="text" class="buttonIconsL"></ion-icon>\n					<h2>Social Media</h2>\n				</button>\n			</ion-col>\n		</ion-row>\n			\n	</ion-grid>\n\n</ion-content>\n\n\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/networking/networking.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_2__providers_localstorage_localstorage__["a" /* Localstorage */]])
], NetworkingPage);

//# sourceMappingURL=networking.js.map

/***/ }),

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivityPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_moment__);
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










let ActivityPage = class ActivityPage {
    constructor(navCtrl, navParams, storage, databaseprovider, imageLoaderConfig, modal, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.imageLoaderConfig = imageLoaderConfig;
        this.modal = modal;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.activityFeedListing = [];
    }
    ionViewWillEnter() {
        console.log('ionViewWillEnter ActivityPage');
        // Update Comment count here when coming back from a posting
        //var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        //var ActivityFeedIDCCount = this.localstorage.getLocalValue('ActivityFeedIDCCount');
        //var ActivityFeedArrayString = this.localstorage.getLocalValue('ActivityFeedObject');
        //this.LoadData();
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter ActivityPage');
        // Update Comment count here when coming back from a posting
        var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        var ActivityFeedIDCCount = this.localstorage.getLocalValue('ActivityFeedIDCCount');
        var ActivityFeedArrayString = this.localstorage.getLocalValue('ActivityFeedObject');
        this.LoadData();
    }
    timeDifference(laterdate, earlierdate) {
        //console.log('Moment timeDifference input, laterdate: ' + laterdate + ', earlierdate: ' + earlierdate);
        //console.log('Moment timeDifference output: ' + moment(earlierdate).fromNow());
        return __WEBPACK_IMPORTED_MODULE_7_moment__(earlierdate).fromNow();
    }
    //ngOnInit() {
    //	this.LoadData();
    //}
    LoadData() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.activityFeedListing = [];
        this.cd.markForCheck();
        this.imageLoaderConfig.setFallbackUrl('assets/img/personIcon.png');
        // Temporary use variables
        var flags = "li|Alpha|0";
        var DisplayName = "";
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
        var afWebLink;
        var ActivityFeedID = this.localstorage.getLocalValue('ActivityFeedID');
        // Get the data
        this.databaseprovider.getActivityFeedData(flags, "0").then(data => {
            console.log("getActivityFeedData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    console.log('Processing afID: ' + data[i].afID);
                    var imageAvatar = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].AttendeeID + ".jpg";
                    console.log(imageAvatar);
                    var imageAttachment = data[i].afImageAttachment;
                    var imageAttached = false;
                    if (imageAttachment != "") {
                        imageAttachment = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/ActivityFeedAttachments/" + imageAttachment;
                        imageAttached = true;
                    }
                    console.log('Activity Feed, imageAttached: ' + imageAttached);
                    console.log('Activity Feed, imageAttachment: ' + imageAttachment);
                    DisplayName = data[i].PosterFirst + " " + data[i].PosterLast;
                    console.log('Activity Feed, DisplayName: ' + DisplayName);
                    afWebLink = false;
                    if (data[i].LinkedURL != "" && data[i].LinkedURL !== null) {
                        afWebLink = true;
                    }
                    console.log('Activity Feed, Linked URL available: ' + afWebLink);
                    console.log('Activity Feed, Linked URL: ' + data[i].LinkedURL);
                    dbEventDateTime = data[i].Posted.substring(0, 19);
                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                    SQLDate = new Date(dbEventDateTime);
                    DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                    console.log('Activity Feed, DisplayDateTime: ' + DisplayDateTime);
                    var CurrentDateTime2 = new Date().toUTCString();
                    console.log('Activity Feed, CurrentDateTime2: ' + CurrentDateTime2);
                    var CurrentDateTime = dateFormat(CurrentDateTime2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
                    console.log('Activity Feed, CurrentDateTime: ' + CurrentDateTime);
                    //console.log('Activity Feed, afDateTime: ' + data[i].afDateTime);
                    dbEventDateTime = data[i].afDateTime.substring(0, 19);
                    dbEventDateTime = dbEventDateTime.replace(' ', 'T');
                    dbEventDateTime = dbEventDateTime + 'Z';
                    console.log('Activity Feed, dbEventDateTime: ' + dbEventDateTime);
                    var PostedDate2 = new Date(dbEventDateTime);
                    console.log('Activity Feed, PostedDate2: ' + PostedDate2);
                    var PostedDate = dateFormat(PostedDate2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
                    console.log('Activity Feed, PostedDate: ' + PostedDate);
                    var TimeDifference = this.timeDifference(CurrentDateTime, PostedDate);
                    console.log('Activity Feed, TimeDifference: ' + TimeDifference);
                    // Show the current record
                    this.activityFeedListing.push({
                        afID: data[i].afID,
                        ActivityFeedCommentAvatar: imageAvatar,
                        AttendeeID: data[i].AttendeeID,
                        ActivityFeedCommentBy: DisplayName,
                        ActivityFeedCommentPosted: DisplayDateTime,
                        ActivityFeedAttachment: imageAttachment,
                        ActivityFeedComment: data[i].afMessage,
                        ActivityFeedLikesCounter: data[i].afLikesCounter,
                        ActivityFeedCommentsCounter: data[i].CommentsCount,
                        ActivityFeedCommentPostedDuration: TimeDifference,
                        ActivityFeedAttached: imageAttached,
                        ActivityFeedLinkedURL: data[i].LinkedURL,
                        showActivityFeedLinkedURL: afWebLink
                    });
                }
                this.cd.markForCheck();
                // Scroll back to last viewed entry when 
                // coming back from a posting
                if (parseInt(ActivityFeedID) > 0) {
                    setTimeout(() => {
                        this.scrollTo("afID" + ActivityFeedID);
                    });
                }
            }
            else {
                // No records to show
                this.activityFeedListing.push({
                    afID: 0,
                    ActivityFeedCommentAvatar: "No records found",
                    AttendeeID: 0,
                    ActivityFeedCommentBy: "",
                    ActivityFeedCommentPosted: "",
                    ActivityFeedAttachment: "",
                    ActivityFeedComment: "",
                    ActivityFeedLikesCounter: "",
                    ActivityFeedCommentsCounter: "",
                    ActivityFeedCommentPostedDuration: "",
                    ActivityFeedAttached: false,
                    ActivityFeedLinkedURL: data[i].LinkedURL,
                    showActivityFeedLinkedURL: false
                });
                this.cd.markForCheck();
            }
            //loading.dismiss();
        }).catch(function () {
            console.log("Activity Feed Promise Rejected");
            //loading.dismiss();
        });
    }
    scrollTo(element) {
        let elem = document.getElementById(element);
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var top = box.top + scrollTop - clientTop;
        var cDim = this.content.getContentDimensions();
        var scrollOffset = Math.round(top) + cDim.scrollTop - cDim.contentTop;
        this.content.scrollTo(0, scrollOffset, 500);
    }
    UpdateLikes(activityFeedItem, activityfeedID) {
        console.log('Likes button tapped');
        this.localstorage.setLocalValue('ActivityFeedLikesButton', '1');
        var flags = "lu|" + activityfeedID;
        // Get the data
        this.databaseprovider.getActivityFeedData(flags, "0").then(data => {
            console.log(JSON.stringify(data));
            if (data['length'] > 0) {
                if (data[0].Status = "Saved") {
                    activityFeedItem.ActivityFeedLikesCounter = data[0].NewLikes;
                    this.cd.markForCheck();
                }
            }
        }).catch(function () {
            console.log("UpdateLikes Promise Rejected");
        });
    }
    //	goActivityfeeddetails()
    //{
    // this.navCtrl.push(ActivityfeeddetailsPage);
    //}
    ActivityFeedDetails(activityFeedItem, activityfeedID) {
        this.localstorage.setLocalValue('ActivityFeedObject', JSON.stringify(activityFeedItem));
        console.log('Activity details requested');
        if (activityfeedID != 0) {
            var LikesButton = "";
            LikesButton = this.localstorage.getLocalValue('ActivityFeedLikesButton');
            console.log('Likes button check: ' + LikesButton);
            if (LikesButton == '1') {
                this.localstorage.setLocalValue('ActivityFeedLikesButton', '0');
            }
            else {
                console.log('Going to activity feed: ' + activityfeedID);
                // Navigate to Activity Feed Details page
                this.localstorage.setLocalValue('ActivityFeedID', activityfeedID);
                this.navCtrl.push('ActivityFeedDetailsPage', { ActivityFeedID: activityfeedID }, { animate: true, direction: 'forward' });
            }
        }
    }
    ;
    AttendeeDetails(oAttendeeID) {
        console.log('oAttendeeID: ' + oAttendeeID);
        this.localstorage.setLocalValue("oAttendeeID", oAttendeeID);
        this.navCtrl.push('AttendeesProfilePage', { oAttendeeID: oAttendeeID }, { animate: true, direction: 'forward' });
    }
    AddPosting(fab) {
        // Disable other click event
        this.localstorage.setLocalValue('afFABClicked', '1');
        console.log('Set FAB Override, AddPosting');
        const AddPostingModalOptions = {
            enableBackdropDismiss: false
        };
        const AddPostingModal = this.modal.create('ActivityFeedPostingPage', {}, AddPostingModalOptions);
        AddPostingModal.present();
        AddPostingModal.onDidDismiss((data) => {
            this.localstorage.setLocalValue('afFABClicked', '0');
            // If saved, then re-run ngOnInit to refresh the listing
            if (data == "Save") {
                this.LoadData();
            }
        });
        fab.close();
    }
    ViewLeaderboard(fab) {
        // Disable other click event
        this.localstorage.setLocalValue('afFABClicked', '1');
        console.log('Set FAB Override, ViewLeaderboard');
        const ViewLeaderboardModalOptions = {
            enableBackdropDismiss: false
        };
        const ViewLeaderboardModal = this.modal.create('ActivityFeedLeaderboardPage', {}, ViewLeaderboardModalOptions);
        ViewLeaderboardModal.present();
        ViewLeaderboardModal.onDidDismiss((data) => {
            this.localstorage.setLocalValue('afFABClicked', '0');
        });
        fab.close();
    }
    navToWeb(wURL) {
        if (wURL != "") {
            if ((wURL.substring(0, 7).toLowerCase() != "http://") && (wURL.substring(0, 8).toLowerCase() != "https://")) {
                wURL = "http://" + wURL;
            }
            console.log('Attendee Profile Details: Navigating to: ' + wURL);
            window.open(wURL, '_system');
        }
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Content */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Content */])
], ActivityPage.prototype, "content", void 0);
ActivityPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-activity',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/activity/activity.html"*/'\n<ion-header no-border>\n	<ion-navbar color="primary">\n		<ion-title>Activities Feed</ion-title>\n	</ion-navbar>\n</ion-header>\n   \n<ion-content fullscreen>\n   \n\n	<!-- List of attendee postings -->\n	<ion-card *ngFor="let activityFeedItem of activityFeedListing; index as i">\n		\n\n\n		<!-- Attendee avatar and name -->\n		<ion-item id="afID{{activityFeedItem.afID}}">\n			<ion-avatar item-start (click)="AttendeeDetails(activityFeedItem.AttendeeID)">\n				<!--<img-loader [src]="activityFeedItem.ActivityFeedCommentAvatar" useImg [spinner]=false [fallbackAsPlaceholder]=true></img-loader>-->\n				<img src="{{activityFeedItem.ActivityFeedCommentAvatar}}" onerror="this.src=\'assets/img/personIcon.png\'">\n			</ion-avatar>\n			<div (click)="ActivityFeedDetails(activityFeedItem, activityFeedItem.afID)">\n			<h2>{{activityFeedItem.ActivityFeedCommentBy}}</h2>\n			<p>{{activityFeedItem.ActivityFeedCommentPosted}}</p>\n			</div>\n		</ion-item>\n\n\n\n\n		<!-- Posting picture attachment -->\n		<!--<img-loader *ngIf=activityFeedItem.ActivityFeedAttached [src]="activityFeedItem.ActivityFeedAttachment" useImg [spinner]=false></img-loader>-->\n		<img src="{{activityFeedItem.ActivityFeedAttachment}}" (click)="ActivityFeedDetails(activityFeedItem, activityFeedItem.afID)">\n\n		<!-- Attendee\'s comment -->\n		<ion-card-content (click)="ActivityFeedDetails(activityFeedItem, activityFeedItem.afID)">\n			<p>{{activityFeedItem.ActivityFeedComment}}</p>\n		</ion-card-content>\n\n		<!-- Linked URL (Only for promoted postings entered via the Admin Gateway) -->\n		<ion-list *ngIf=activityFeedItem.showActivityFeedLinkedURL>\n			<button ion-item (click)="navToWeb(activityFeedItem.ActivityFeedLinkedURL)">\n				<ion-icon name="globe" item-start></ion-icon>\n				{{activityFeedItem.ActivityFeedLinkedURL}}\n			</button>\n		</ion-list>\n\n\n		<!-- Footer with details -->\n		<ion-row>\n			<ion-col>\n				<button style="color:#2196f3" ion-button icon-left clear small activityCard (click)="UpdateLikes(activityFeedItem, activityFeedItem.afID, activityCard)">\n					<ion-icon name="thumbs-up"></ion-icon>\n					<div>{{activityFeedItem.ActivityFeedLikesCounter}} Likes</div>\n				</button>\n			</ion-col>\n			<ion-col>\n				<button style="color:#2196f3" ion-button icon-left clear small (click)="ActivityFeedDetails(activityFeedItem, activityFeedItem.afID)">\n			\n				\n					<ion-icon name="text"></ion-icon>\n					<div>{{activityFeedItem.ActivityFeedCommentsCounter}} Comments</div>\n				</button>\n			</ion-col>\n			<ion-col center text-center (click)="ActivityFeedDetails(activityFeedItem, activityFeedItem.afID)">\n				<ion-note style="color:#000">\n					{{activityFeedItem.ActivityFeedCommentPostedDuration}}\n				</ion-note>\n			</ion-col>\n		</ion-row>\n\n	</ion-card>\n	\n	<!-- Floating button menu for adding new comment -->\n    <ion-fab bottom right #fab>\n		<button ion-fab color="secondary" ion-fab>\n			<ion-icon name="add"></ion-icon>\n		</button>\n		<ion-fab-list side="top">\n			<button ion-fab (click)="ViewLeaderboard(fab)">\n				<ion-icon name="trophy"></ion-icon>\n				<div class="fabdivbutton">View Leaderboard</div>\n			</button>\n			<button ion-fab (click)="AddPosting(fab)">\n				<ion-icon name="chatboxes"></ion-icon>\n				<div class="fabdivbutton">Add Posting</div>\n			</button>\n		</ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/activity/activity.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__["a" /* ImageLoaderConfig */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], ActivityPage);

//# sourceMappingURL=activity.js.map

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__ = __webpack_require__(61);
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







let AttendeesPage = class AttendeesPage {
    constructor(navCtrl, navParams, storage, databaseprovider, imageLoaderConfig, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.imageLoaderConfig = imageLoaderConfig;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.AttendeeListing = [];
        this.currentPageClass = this;
    }
    // Style 2 data pull
    ngOnInit() {
        this.LoadAttendees();
    }
    LoadAttendees() {
        // Load initial data set here
        let loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Please wait...'
        });
        loading.present();
        // Blank and show loading info
        this.AttendeeListing = [];
        this.cd.markForCheck();
        this.imageLoaderConfig.setFallbackUrl('assets/img/personIcon.png');
        // Temporary use variables
        var flags = "al|0|0|";
        var DisplayName = "";
        var visDisplayTitle = "";
        var visDisplayCompany = "";
        var AttendeeDividerCharacter = "";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var SpeakerDividerCharacter = "";
        // Get the data
        this.databaseprovider.getMessagingData(flags, AttendeeID).then(data => {
            console.log("getMessagingData, Attendee Listing Count: " + data['length']);
            if (data['length'] > 0) {
                console.log('getMessagingData, Attendee Listing, starting data record loop');
                for (var i = 0; i < data['length']; i++) {
                    DisplayName = "";
                    // Concatenate fields to build displayable name
                    DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
                    // Show Title and Company/Association
                    visDisplayTitle = "";
                    if (data[i].Title != "") {
                        visDisplayTitle = data[i].Title;
                    }
                    visDisplayCompany = "";
                    if (data[i].Company != "") {
                        visDisplayCompany = data[i].Company;
                    }
                    var imageAvatar = "";
                    //console.log('avatarFilename for ' + data[i].AttendeeID + ': ' + data[i].avatarFilename);
                    if (data[i].avatarFilename != 'undefined' && data[i].avatarFilename != undefined && data[i].avatarFilename != '' && data[i].avatarFilename.length > 0) {
                        imageAvatar = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].avatarFilename;
                        //console.log('imageAvatar: ' + imageAvatar);
                    }
                    else {
                        imageAvatar = "assets/img/personIcon.png";
                        //console.log('imageAvatar: ' + imageAvatar);
                    }
                    if (data[i].LastName.charAt(0) != AttendeeDividerCharacter) {
                        // Display the divider
                        this.AttendeeListing.push({
                            AttendeeID: 0,
                            AttendeeName: data[i].LastName.charAt(0),
                            AttendeeTitle: "",
                            AttendeeOrganization: "",
                            AttendeeAvatar: "assets/img/SpeakerDivider.png",
                            navigationArrow: "nothing",
                            ShowHideAttendeeIcon: false,
                        });
                        // Set the new marker point
                        AttendeeDividerCharacter = data[i].LastName.charAt(0);
                        // Add current record to the list
                        this.AttendeeListing.push({
                            AttendeeID: data[i].AttendeeID,
                            AttendeeName: DisplayName,
                            AttendeeTitle: visDisplayTitle,
                            AttendeeOrganization: visDisplayCompany,
                            AttendeeAvatar: imageAvatar,
                            navigationArrow: "arrow-dropright",
                            ShowHideAttendeeIcon: true,
                        });
                    }
                    else {
                        // Add current record to the list
                        this.AttendeeListing.push({
                            AttendeeID: data[i].AttendeeID,
                            AttendeeName: DisplayName,
                            AttendeeTitle: visDisplayTitle,
                            AttendeeOrganization: visDisplayCompany,
                            AttendeeAvatar: imageAvatar,
                            navigationArrow: "arrow-dropright",
                            ShowHideAttendeeIcon: true,
                        });
                    }
                }
                this.cd.markForCheck();
                console.log('Built data array: ' + JSON.stringify(this.AttendeeListing));
            }
            else {
                console.log("getMessagingData, Attendee Listing, No records");
                // No records to show
                this.AttendeeListing.push({
                    AttendeeID: 0,
                    AttendeeName: "No attendees available",
                    AttendeeTitle: "",
                    AttendeeOrganization: "",
                    AttendeeAvatar: "",
                    navigationArrow: "nothing",
                    ShowHideAttendeeIcon: false,
                });
                this.cd.markForCheck();
                console.log('Built data array: ' + JSON.stringify(this.AttendeeListing));
            }
            loading.dismiss();
            console.log('getMessagingData, Attendee Listing, done loading names');
        }).catch(function () {
            console.log("Attendee Listing Style 2 Promise Rejected");
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad AttendeesPage');
    }
    handleKeyboardEvent(event) {
        if (event.key == 'Enter') {
            console.log('Enter key detected');
            this.GetSearchResults();
        }
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
    AttendeeDetails(oAttendeeID) {
        console.log('oAttendeeID: ' + oAttendeeID);
        if (oAttendeeID != '0') {
            this.localstorage.setLocalValue("oAttendeeID", oAttendeeID);
            this.navCtrl.push('AttendeesProfilePage', { oAttendeeID: oAttendeeID }, { animate: true, direction: 'forward' });
        }
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('document:keypress', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], AttendeesPage.prototype, "handleKeyboardEvent", null);
AttendeesPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-attendees',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/attendees/attendees.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Attendees</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="attendees-page">\n\n	<ion-grid style="padding:0; margin:0">\n		<ion-row>\n			<ion-col col-9>	\n				<ion-item class="item-input">\n					<ion-icon color="secondary" name="search" item-left></ion-icon>\n					<ion-input name="srchBarEntry" id="srchBarEntry" \n					type="text" placeholder="Search" [(ngModel)]="EntryTerms"></ion-input>\n				</ion-item>\n			</ion-col>\n			<ion-col col-3>\n				<button ion-button full style="padding:0; margin:0; background:#2196f3" (tap)="GetSearchResults()">Submit</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n	<!-- Attendee Listing -->\n	<ion-grid>\n		<ion-row>\n			<ion-col>	\n				<ion-list>\n					<ion-item tappable (click)="AttendeeDetails(attendee.AttendeeID)" *ngFor="let attendee of AttendeeListing" id="Attendee-list19">\n						<div style="float: left; padding-right: 10px;">\n							<ion-avatar item-start>\n								<img *ngIf=attendee.ShowHideAttendeeIcon [src]="attendee.AttendeeAvatar" src="assets/img/personIcon.png" onerror="this.src=\'assets/img/personIcon.png\'">\n							</ion-avatar>\n						</div>\n						<ion-icon item-right name="{{attendee.navigationArrow}}"></ion-icon>\n							<h2 style="padding-top: 7px;">{{attendee.AttendeeName}}</h2>\n							<h3>{{attendee.AttendeeTitle}}</h3>\n							<h3>{{attendee.AttendeeOrganization}}</h3>\n					</ion-item>\n				</ion-list>\n			</ion-col>\n\n		</ion-row>\n\n	</ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/attendees/attendees.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__["a" /* ImageLoaderConfig */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], AttendeesPage);

;
//# sourceMappingURL=attendees.js.map

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationsPage; });
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






let NotificationsPage = class NotificationsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, loadingCtrl, cd, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.loadingCtrl = loadingCtrl;
        this.cd = cd;
        this.localstorage = localstorage;
        this.NotificationListing = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationsPage');
    }
    ngOnInit() {
        // Load initial data set here
        let loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Loading...'
        });
        loading.present();
        // Blank info
        this.NotificationListing = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        var visReceivedDate;
        var visReceivedTime;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        flags = "pn|0";
        this.databaseprovider.getMessagingData(flags, AttendeeID).then(data => {
            console.log("getMessagingData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    var dbEventDateTime = data[i].pushDateTimeReceived;
                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                    var SQLDate = new Date(dbEventDateTime);
                    var DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                    this.NotificationListing.push({
                        pushTitle: data[i].pushTitle,
                        pushDateTime: DisplayDateTime,
                        pushMessage: data[i].pushMessage
                    });
                }
            }
            else {
                this.NotificationListing.push({
                    pushTitle: "No push notifications received on this device",
                    pushDateTime: "",
                    pushMessage: ""
                });
            }
            this.cd.markForCheck();
            loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
            loading.dismiss();
        });
    }
};
NotificationsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-notifications',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/notifications/notifications.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Notifications</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-item text-wrap>\n		<h2>Below are the conference notifications that have been sent:</h2>\n	</ion-item>\n\n	<ion-card>\n			<ion-card-content>\n			<ion-item text-wrap *ngFor="let notification of NotificationListing">\n				<ion-icon item-left color=secondary name="text"></ion-icon>\n				<h2 style="font-weight:500">{{notification.pushTitle}}</h2>\n				<h4>{{notification.pushDateTime}}</h4>\n				<p>{{notification.pushMessage}}</p>\n			</ion-item>\n		</ion-card-content>\n	</ion-card>\n	\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/notifications/notifications.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], NotificationsPage);

//# sourceMappingURL=notifications.js.map

/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Database; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
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





// Global URL and conference year reference used for all AJAX-to-MySQL calls
var APIURLReference = "https://aacdmobile.convergence-us.com/cvPlanner.php?acy=2019&";
var AttendeeListing = 'Offline';
let Database = class Database {
    constructor(pltfrm, httpCall, alertCtrl, sqlite) {
        this.pltfrm = pltfrm;
        this.httpCall = httpCall;
        this.alertCtrl = alertCtrl;
        this.sqlite = sqlite;
        if (!this.isOpen) {
            // Determine platform that the app is running on
            this.DevicePlatform = "Browser";
            pltfrm.ready().then(() => {
                if (pltfrm.is('android')) {
                    console.log("Database: Running on Android device");
                    this.DevicePlatform = "Android";
                }
                if (pltfrm.is('ios')) {
                    console.log("Database: Running on iOS device");
                    this.DevicePlatform = "iOS";
                }
                console.log("Database: App DB platform: " + this.DevicePlatform);
                if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
                    this.isOpen = true;
                    console.log("Database: Local SQLite database is now available.");
                }
                else {
                    this.isOpen = true;
                    console.log("Database: Network database is now available.");
                }
            });
        }
    }
    // -----------------------------------
    // 
    // Messaging Functions
    // 
    // -----------------------------------
    getMessagingData(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        console.log("AttendeeID passed: " + AttendeeID);
        var flagValues = flags.split("|");
        var listingType = flagValues[0];
        var sortingType = flagValues[1];
        var receiverID = flagValues[2];
        var pnTitle = flagValues[3];
        var pnMessage = flagValues[4];
        var DateTimeReceived = flagValues[5];
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            if (listingType == "li") { // List of conversations
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                var emptyJSONArray = {};
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        console.log('msgquery response: ' + JSON.stringify(response.json()));
                        resolve(response.json());
                    }, err => {
                        if (err.status == "412") {
                            console.log("App and API versions don't match.");
                            resolve(emptyJSONArray);
                        }
                        else {
                            console.log(err.status);
                            console.log("API Error: ", err);
                            resolve(emptyJSONArray);
                        }
                    });
                });
                /*
                var SQLquery = "";
                SQLquery = "SELECT DISTINCT m.ct_id, m.last_name, m.first_name, m.company ";
                SQLquery = SQLquery + "FROM ( ";
                SQLquery = SQLquery + "SELECT DISTINCT a.ct_id, a.last_name, a.first_name, a.company, am.DateTimeSent ";
                SQLquery = SQLquery + "FROM attendee_messaging am ";
                SQLquery = SQLquery + "INNER JOIN attendees a ON a.ct_id = am.ReceiverAttendeeID ";
                SQLquery = SQLquery + "WHERE am.SenderAttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "UNION ";
                SQLquery = SQLquery + "SELECT DISTINCT a.ct_id, a.last_name, a.first_name, a.company, am.DateTimeSent ";
                SQLquery = SQLquery + "FROM attendee_messaging am ";
                SQLquery = SQLquery + "INNER JOIN attendees a ON a.ct_id = am.SenderAttendeeID ";
                SQLquery = SQLquery + "WHERE am.ReceiverAttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + ") AS m ";
                
                if (sortingType == "Time") {
                    SQLquery = SQLquery + "ORDER BY m.DateTimeSent DESC";
                }
                if (sortingType == "Alpha") {
                    SQLquery = SQLquery + "ORDER BY m.LastName, m.FirstName";
                }
                
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    
                    this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

                        console.log('Database: Opened DB for Messaging query');
                        
                        this.db = db;
                        
                        console.log('Database: Set Messaging query db variable');
                        
                        this.db.executeSql(SQLquery, <any>{}).then((data) => {
                            //console.log('Database: Messaging query: ' + JSON.stringify(data));
                            console.log('Database: Messaging query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if(data.rows.length > 0) {
                                for(let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        ConversationAttendeeID: data.rows.item(i).ct_id,
                                        LastName: data.rows.item(i).last_name,
                                        FirstName: data.rows.item(i).first_name,
                                        Company: data.rows.item(i).company
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        })
                        .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)))
                    });
                    console.log('Database: Stats query complete');

                });
                */
            }
            if (listingType == "pn") { // List of push notifications received
                var SQLquery = "";
                SQLquery = "SELECT pushTitle, pushMessage, datetime(pushDateTimeReceived, 'localtime') AS localDateTime ";
                SQLquery = SQLquery + "FROM attendee_push_notifications ";
                SQLquery = SQLquery + "ORDER BY pushDateTimeReceived ";
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                        console.log('Database: Opened DB for Messaging query');
                        this.db = db;
                        console.log('Database: Set Messaging query db variable');
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Messaging query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if (data.rows.length > 0) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        pushTitle: data.rows.item(i).pushTitle,
                                        pushMessage: data.rows.item(i).pushMessage,
                                        pushDateTimeReceived: data.rows.item(i).localDateTime
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        })
                            .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                    });
                    console.log('Database: Stats query complete');
                });
            }
            if (listingType == "ps") { // Save push notification received
                var SQLquery = "";
                SQLquery = "INSERT INTO attendee_push_notifications(pushTitle, pushMessage, pushDateTimeReceived) ";
                SQLquery = SQLquery + "VALUES('" + pnTitle + "','" + pnMessage + "','" + DateTimeReceived + "')";
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                        console.log('Database: Opened DB for Messaging query');
                        this.db = db;
                        console.log('Database: Set Messaging query db variable');
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Messaging query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if (data.rowsAffected == "1") {
                                DatabaseResponse.push({
                                    status: "Saved"
                                });
                            }
                            else {
                                DatabaseResponse.push({
                                    status: "Failed"
                                });
                            }
                            resolve(DatabaseResponse);
                        })
                            .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                    });
                    console.log('Database: Stats query complete');
                });
            }
            if (listingType == "al" || listingType == "sr") { // Attendee Listing
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    var emptyJSONArray = {};
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            console.log('msgquery response: ' + JSON.stringify(response.json()));
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                                resolve(emptyJSONArray);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    SQLquery = "SELECT AttendeeID, LastName, FirstName, Title, Company, avatarFilename ";
                    SQLquery = SQLquery + "FROM attendees ";
                    SQLquery = SQLquery + "WHERE ActiveYN = 'Y' ";
                    SQLquery = SQLquery + "AND badge = '1' ";
                    if (listingType == "sr") { // If searching, then add where clause criteria
                        // Split search terms by space to create WHERE clause
                        var whereClause = 'AND (';
                        var searchTerms = pnTitle.split(" ");
                        for (var i = 0; i < searchTerms.length; i++) {
                            whereClause = whereClause + 'SearchField LIKE "%' + searchTerms[i] + '%" AND ';
                        }
                        // Remove last AND from where clause
                        whereClause = whereClause.substring(0, whereClause.length - 5);
                        whereClause = whereClause + ') ';
                        SQLquery = SQLquery + whereClause;
                    }
                    SQLquery = SQLquery + "ORDER BY lower(LastName), lower(FirstName) ";
                    console.log('SQL Query: ' + SQLquery);
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Messaging query');
                            this.db = db;
                            console.log('Database: Set Messaging query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                console.log('Database: Messaging query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rows.length > 0) {
                                    for (let i = 0; i < data.rows.length; i++) {
                                        DatabaseResponse.push({
                                            AttendeeID: data.rows.item(i).AttendeeID,
                                            LastName: data.rows.item(i).LastName,
                                            FirstName: data.rows.item(i).FirstName,
                                            avatarFilename: data.rows.item(i).avatarFilename,
                                            Title: data.rows.item(i).Title,
                                            Company: data.rows.item(i).Company
                                        });
                                    }
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Stats query complete');
                    });
                }
            }
            if (listingType == "al2") { // Attendee Listing by Letter
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    var emptyJSONArray = {};
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            console.log('msgquery response: ' + JSON.stringify(response.json()));
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                                resolve(emptyJSONArray);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    SQLquery = "SELECT AttendeeID, LastName, FirstName, Title, Company, avatarFilename ";
                    SQLquery = SQLquery + "FROM attendees ";
                    SQLquery = SQLquery + "WHERE ActiveYN = 'Y' ";
                    SQLquery = SQLquery + "AND badge = '1' ";
                    SQLquery = SQLquery + "WHERE last_name LIKE '" + sortingType + "%' ";
                    SQLquery = SQLquery + "ORDER BY lower(LastName), lower(FirstName) ";
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Messaging query');
                            this.db = db;
                            console.log('Database: Set Messaging query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                console.log('Database: Messaging query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rows.length > 0) {
                                    for (let i = 0; i < data.rows.length; i++) {
                                        DatabaseResponse.push({
                                            AttendeeID: data.rows.item(i).AttendeeID,
                                            LastName: data.rows.item(i).LastName,
                                            FirstName: data.rows.item(i).FirstName,
                                            avatarFilename: data.rows.item(i).avatarFilename,
                                            Title: data.rows.item(i).Title,
                                            Company: data.rows.item(i).Company
                                        });
                                    }
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Stats query complete');
                    });
                }
            }
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=msgquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    console.log('msgquery response: ' + JSON.stringify(response.json()));
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Bookmark Functions
    // 
    // -----------------------------------
    getBookmarksData(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        console.log("AttendeeID passed: " + AttendeeID);
        var flagValues = flags.split("|");
        var listingType = flagValues[0];
        var listingFilter = flagValues[1];
        var BookmarkType = flagValues[2];
        var BookmarkID = flagValues[3];
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            if (listingType == "li") { // List bookmarks
                var SQLquery = "";
                switch (listingFilter) {
                    case "Sessions":
                        SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
                        SQLquery = SQLquery + "lr.RoomName, lr.FloorNumber, lr.RoomX, lr.RoomY, c.cs_credits, c.subject, c.room_capacity, s.itID AS OnAgenda, ";
                        SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id AND ac.waitlist = 0) AS Attendees, ";
                        SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
                        SQLquery = SQLquery + "FROM courses c ";
                        SQLquery = SQLquery + "INNER JOIN lookup_rooms lr ON c.room_number = lr.RoomName ";
                        SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = '" + AttendeeID + "' ";
                        SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkType = 'Sessions' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkID = c.session_id ";
                        SQLquery = SQLquery + "WHERE ab.UpdateType != 'Delete' ";
                        SQLquery = SQLquery + "ORDER BY c.session_start_time, c.course_id";
                        // Perform query against local SQLite database
                        return new Promise(resolve => {
                            this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                                console.log('Database: Opened DB for Messaging query');
                                this.db = db;
                                console.log('Database: Set Messaging query db variable');
                                this.db.executeSql(SQLquery, {}).then((data) => {
                                    console.log('Database: Messaging query rows: ' + data.rows.length);
                                    let DatabaseResponse = [];
                                    if (data.rows.length > 0) {
                                        for (let i = 0; i < data.rows.length; i++) {
                                            DatabaseResponse.push({
                                                session_id: data.rows.item(i).session_id,
                                                session_title: data.rows.item(i).session_title,
                                                primary_speaker: data.rows.item(i).primary_speaker,
                                                other_speakers: data.rows.item(i).other_speakers,
                                                session_start_time: data.rows.item(i).session_start_time,
                                                session_end_time: data.rows.item(i).session_end_time,
                                                RoomName: data.rows.item(i).RoomName,
                                                FloorNumber: data.rows.item(i).FloorNumber,
                                                RoomX: data.rows.item(i).RoomX,
                                                RoomY: data.rows.item(i).RoomY,
                                                cs_credits: data.rows.item(i).cs_credits,
                                                subject: data.rows.item(i).subject,
                                                OnAgenda: data.rows.item(i).OnAgenda,
                                                Attendees: data.rows.item(i).Attendees,
                                                Waitlist: data.rows.item(i).Waitlist,
                                                room_capacity: data.rows.item(i).room_capacity
                                            });
                                        }
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                            });
                            console.log('Database: Stats query complete');
                        });
                    //break;
                    case "Speakers":
                        SQLquery = "SELECT DISTINCT s.speakerID, s.LastName, s.FirstName, s.Credentials, s.Title, s.Company, s.imageFilename ";
                        SQLquery = SQLquery + "FROM courses_speakers s ";
                        SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkType = 'Speakers' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkID = s.speakerID ";
                        SQLquery = SQLquery + "WHERE ab.UpdateType != 'Delete' ";
                        SQLquery = SQLquery + "ORDER BY s.LastName, s.FirstName";
                        // Perform query against local SQLite database
                        return new Promise(resolve => {
                            this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                                console.log('Database: Opened DB for Messaging query');
                                this.db = db;
                                console.log('Database: Set Messaging query db variable');
                                this.db.executeSql(SQLquery, {}).then((data) => {
                                    console.log('Database: Messaging query rows: ' + data.rows.length);
                                    let DatabaseResponse = [];
                                    if (data.rows.length > 0) {
                                        for (let i = 0; i < data.rows.length; i++) {
                                            DatabaseResponse.push({
                                                speakerID: data.rows.item(i).speakerID,
                                                LastName: data.rows.item(i).LastName,
                                                FirstName: data.rows.item(i).FirstName,
                                                Credentials: data.rows.item(i).Credentials,
                                                Company: data.rows.item(i).Company,
                                                Title: data.rows.item(i).Title,
                                                imageFilename: data.rows.item(i).imageFilename
                                            });
                                        }
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                            });
                            console.log('Database: Stats query complete');
                        });
                    //break;
                    case "Exhibitors":
                        SQLquery = "SELECT DISTINCT e.ExhibitorID, e.CompanyName, e.City, e.State, e.Country, e.BoothNumber ";
                        SQLquery = SQLquery + "FROM exhibitors e ";
                        SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkType = 'Exhibitors' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkID = e.ExhibitorID ";
                        SQLquery = SQLquery + "WHERE ab.UpdateType != 'Delete' ";
                        SQLquery = SQLquery + "ORDER BY e.CompanyName";
                        // Perform query against local SQLite database
                        return new Promise(resolve => {
                            this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                                console.log('Database: Opened DB for Messaging query');
                                this.db = db;
                                console.log('Database: Set Messaging query db variable');
                                this.db.executeSql(SQLquery, {}).then((data) => {
                                    console.log('Database: Messaging query rows: ' + data.rows.length);
                                    let DatabaseResponse = [];
                                    if (data.rows.length > 0) {
                                        for (let i = 0; i < data.rows.length; i++) {
                                            DatabaseResponse.push({
                                                ExhibitorID: data.rows.item(i).ExhibitorID,
                                                CompanyName: data.rows.item(i).CompanyName,
                                                City: data.rows.item(i).City,
                                                State: data.rows.item(i).State,
                                                Country: data.rows.item(i).Country,
                                                BoothNumber: data.rows.item(i).BoothNumber
                                            });
                                        }
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                            });
                            console.log('Database: Stats query complete');
                        });
                    //break;
                    case "Attendees":
                        SQLquery = "SELECT DISTINCT a.AttendeeID, a.LastName, a.FirstName, a.Title, a.Company ";
                        SQLquery = SQLquery + "FROM attendees a ";
                        SQLquery = SQLquery + "INNER JOIN attendee_bookmarks ab ON ab.AttendeeID = '" + AttendeeID + "' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkType = 'Attendees' ";
                        SQLquery = SQLquery + "		AND ab.BookmarkID = a.AttendeeID ";
                        SQLquery = SQLquery + "WHERE a.ActiveYN = 'Y' ";
                        SQLquery = SQLquery + "AND ab.UpdateType != 'Delete' ";
                        SQLquery = SQLquery + "ORDER BY a.LastName, a.FirstName ";
                        // Perform query against local SQLite database
                        return new Promise(resolve => {
                            this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                                console.log('Database: Opened DB for Messaging query');
                                this.db = db;
                                console.log('Database: Set Messaging query db variable');
                                this.db.executeSql(SQLquery, {}).then((data) => {
                                    console.log('Database: Messaging query rows: ' + data.rows.length);
                                    let DatabaseResponse = [];
                                    if (data.rows.length > 0) {
                                        for (let i = 0; i < data.rows.length; i++) {
                                            DatabaseResponse.push({
                                                AttendeeID: data.rows.item(i).AttendeeID,
                                                LastName: data.rows.item(i).LastName,
                                                FirstName: data.rows.item(i).FirstName,
                                                Title: data.rows.item(i).Title,
                                                Company: data.rows.item(i).Company
                                            });
                                        }
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Messaging query error: ' + JSON.stringify(e)));
                            });
                            console.log('Database: Stats query complete');
                        });
                }
            }
            if (listingType == "cb") { // Create Bookmark
                SQLquery = "SELECT * FROM attendee_bookmarks ";
                SQLquery = SQLquery + "WHERE BookmarkType = '" + BookmarkType + "' ";
                SQLquery = SQLquery + "AND BookmarkID = '" + BookmarkID + "' ";
                SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                        console.log('Database: Opened DB for Create Bookmark query');
                        this.db = db;
                        console.log('Database: Set Create Bookmark query db variable');
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Create Bookmark query: ' + JSON.stringify(data));
                            console.log('Database: Create Bookmark query rows: ' + data.rows.length);
                            var SQLquery2 = "";
                            let DatabaseResponse = [];
                            console.log('Database: BookmarkType: ' + BookmarkType);
                            console.log('Database: listingType: ' + listingType);
                            if (data.rows.length > 0) {
                                SQLquery2 = "UPDATE attendee_bookmarks ";
                                SQLquery2 = SQLquery2 + "SET UpdateType = 'Insert' ";
                                SQLquery2 = SQLquery2 + "WHERE AttendeeID = '" + AttendeeID + "' ";
                                SQLquery2 = SQLquery2 + "AND BookmarkType = '" + BookmarkType + "' ";
                                SQLquery2 = SQLquery2 + "AND BookmarkID = '" + BookmarkID + "' ";
                                console.log('Database: Create Bookmark query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                            }
                            else {
                                var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                SQLquery2 = "INSERT INTO attendee_bookmarks(AttendeeID, BookmarkType, BookmarkID, DateAdded, UpdateType) ";
                                SQLquery2 = SQLquery2 + "VALUES('" + AttendeeID + "','" + BookmarkType + "','" + BookmarkID + "','" + CurrentDateTime + "','Insert')";
                                console.log('Database: Create Bookmark query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Create Bookmark query2 error: ' + JSON.stringify(e)));
                            }
                        })
                            .catch(e => console.log('Database: Create Bookmark query error: ' + JSON.stringify(e)));
                    });
                    console.log('Database: Create Bookmark query complete');
                });
            }
            if (listingType == "rb") { // Remove Bookmark
                SQLquery = "SELECT * FROM attendee_bookmarks ";
                SQLquery = SQLquery + "WHERE BookmarkType = '" + BookmarkType + "' ";
                SQLquery = SQLquery + "AND BookmarkID = '" + BookmarkID + "' ";
                SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                        console.log('Database: Opened DB for Create Bookmark query');
                        this.db = db;
                        console.log('Database: Set Create Bookmark query db variable');
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Create Bookmark query: ' + JSON.stringify(data));
                            console.log('Database: Create Bookmark query rows: ' + data.rows.length);
                            var SQLquery2 = "";
                            let DatabaseResponse = [];
                            console.log('Database: BookmarkType: ' + BookmarkType);
                            console.log('Database: listingType: ' + listingType);
                            if (data.rows.length > 0) {
                                SQLquery2 = "UPDATE attendee_bookmarks ";
                                SQLquery2 = SQLquery2 + "SET UpdateType = 'Delete' ";
                                SQLquery2 = SQLquery2 + "WHERE AttendeeID = '" + AttendeeID + "' ";
                                SQLquery2 = SQLquery2 + "AND BookmarkType = '" + BookmarkType + "' ";
                                SQLquery2 = SQLquery2 + "AND BookmarkID = '" + BookmarkID + "' ";
                                console.log('Database: Create Bookmark query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                            }
                            else {
                                var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                SQLquery2 = "INSERT INTO attendee_bookmarks(AttendeeID, BookmarkType, BookmarkID, DateAdded, UpdateType) ";
                                SQLquery2 = SQLquery2 + "VALUES('" + AttendeeID + "','" + BookmarkType + "','" + BookmarkID + "','" + CurrentDateTime + "','Delete')";
                                console.log('Database: Create Bookmark query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    console.log('Database: Create Bookmark query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Create Bookmark query2 error: ' + JSON.stringify(e)));
                            }
                        })
                            .catch(e => console.log('Database: Create Bookmark query error: ' + JSON.stringify(e)));
                    });
                    console.log('Database: Create Bookmark query complete');
                });
            }
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=bmkquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Activity Feed Database Functions
    // 
    // -----------------------------------
    getActivityFeedData(flags, AttendeeID) {
        console.log("getActivityFeedData flags passed: " + flags);
        var SQLquery = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var flagValues = flags.split("|");
            var listingType = flagValues[0];
            var activityfeedID = flagValues[1];
            var afComment = flagValues[2];
            var QueryParam = flagValues[3] || ''; // Search parameters for activity feed
            var afFilename = flagValues[4];
            var afPostedDateTime = flagValues[5];
            if (listingType == "li" || listingType == "sr") { // List of activity feed
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        resolve(response.json());
                    }, err => {
                        if (err.status == "412") {
                            console.log("App and API versions don't match.");
                            var emptyJSONArray = {};
                            resolve(emptyJSONArray);
                        }
                        else {
                            console.log(err.status);
                            console.log("API Error: ", err);
                            var emptyJSONArray = {};
                            resolve(emptyJSONArray);
                            /*
                            // Split search terms by space to create WHERE clause
                            var whereClause = 'WHERE (';
                            var searchTerms = QueryParam.split(" ");
                            
                            for (var i = 0; i < searchTerms.length; i++){
                                whereClause = whereClause + 'e.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
                            }
                            // Remove last AND from where clause
                            whereClause = whereClause.substring(0, whereClause.length-5);
                            whereClause = whereClause + ') ';

                            SQLquery = SQLquery + whereClause;

                            // Validate query
                            SQLquery = "SELECT af.afID, af.AttendeeID, a.last_name AS PosterLast, a.first_name AS PosterFirst, af.afDateTime AS Posted, af.afLikesCounter, af.afMessage, af.afImageAttachment, ";
                            SQLquery = SQLquery + "(SELECT COUNT(afcID) FROM activities_feed_comments afc WHERE afc.afID = af.afID) AS CommentsCount ";
                            SQLquery = SQLquery + "FROM activities_feed af ";
                            SQLquery = SQLquery + "INNER JOIN attendees a ON a.ct_id = af.AttendeeID ";
                            
                            if (listingType == "sr") {		// If searching activities, then add where clause criteria

                                SQLquery = SQLquery + whereClause;
                                SQLquery = SQLquery + "ORDER BY DateAdded DESC ";

                            } else {
                        
                                SQLquery = SQLquery + "ORDER BY DateAdded DESC ";
                        
                            }

                            console.log("Activity feed Query: " + SQLquery);

                            // Perform query against local SQLite database
                            return new Promise(resolve => {
                                
                                this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

                                    console.log('Database: Opened DB for Activity feed query');
                                    
                                    this.db = db;
                                    
                                    console.log('Database: Set Activity feed query db variable');
                                    
                                    this.db.executeSql(SQLquery, <any>{}).then((data) => {
                                        console.log('Database: Activity feed query: ' + JSON.stringify(data));
                                        console.log('Database: Activity feed query rows: ' + data.rows.length);
                                        let DatabaseResponse = [];
                                        if(data.rows.length > 0) {
                                            for(let i = 0; i < data.rows.length; i++) {
                                                DatabaseResponse.push({
                                                    afID: data.rows.item(i).afID,
                                                    AttendeeID: data.rows.item(i).AttendeeID,
                                                    PosterLast: data.rows.item(i).PosterLast,
                                                    PosterFirst: data.rows.item(i).PosterFirst,
                                                    Posted: data.rows.item(i).Posted,
                                                    afLikesCounter: data.rows.item(i).afLikesCounter,
                                                    afMessage: data.rows.item(i).afMessage,
                                                    afImageAttachment: data.rows.item(i).afImageAttachment,
                                                    CommentsCount: data.rows.item(i).CommentsCount
                                                });
                                            }
                                        }
                                        resolve(DatabaseResponse);
                                    })
                                    .catch(e => console.log('Database: Activity feed query error: ' + JSON.stringify(e)))
                                });
                                console.log('Database: Activity feed query complete');

                            });
                            */
                        }
                    });
                });
            }
            if (listingType == "ad") {
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        resolve(response.json());
                    });
                });
            }
            if (listingType == "dt") { // Activity feed details
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        resolve(response.json());
                    });
                });
            }
            if (listingType == "lu") { // Likes incrementer (update)
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        resolve(response.json());
                    });
                });
                /*
                var SQLquery = "SELECT afLikesCounter FROM activities_feed WHERE afID = " + activityfeedID + " ";
                
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    
                    this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

                        console.log('Database: Opened DB for Likes Update query');
                        
                        this.db = db;
                        
                        console.log('Database: Set Likes Update query db variable');
                        
                        this.db.executeSql(SQLquery, <any>{}).then((data) => {
                            console.log('Database: Likes Update query: ' + JSON.stringify(data));
                            console.log('Database: Likes Update query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            console.log('Database: activityfeedID: ' + activityfeedID);
                            if(data.rows.length > 0) {
                                
                                var SQLquery2 = "";
                                var newLikes = data.rows.item(0).afLikesCounter;
                                newLikes = newLikes + 1;
                                
                                SQLquery2 = "UPDATE activities_feed ";
                                SQLquery2 = SQLquery2 + "SET afLikesCounter = " + newLikes + " ";
                                SQLquery2 = SQLquery2 + "WHERE afID = " + activityfeedID + " ";
                                console.log('Database: Likes Update query2: ' + SQLquery2);
                                
                                this.db.executeSql(SQLquery2, <any>{}).then((data2) => {
                                    console.log('Database: Likes Update query2: ' + JSON.stringify(data2));
                                    if(data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: "",
                                            NewLikes: newLikes
                                        });
                                    } else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: "",
                                            NewLikes: 0
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                .catch(e => console.log('Database: Likes Update query2 error: ' + JSON.stringify(e)))
                            }
                                        
                        })
                        .catch(e => console.log('Database: Likes Update query error: ' + JSON.stringify(e)))
                    });
                    console.log('Database: Likes Update query complete');

                });
                */
            }
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=afquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // CE Database Functions
    // 
    // -----------------------------------
    getCETrackerData(AttendeeID) {
        console.log("Database: AttendeeID passed: " + AttendeeID);
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var SQLquery = "SELECT DISTINCT c.session_id, c.course_id, c.session_title, ce.scannedYN AS ceStatusScan, ce.evalID AS ceStatusEval, c.ce_credits_type, ";
            SQLquery = SQLquery + "e.evalID AS Evaluated, c.CEcreditsL, c.CEcreditsP ";
            SQLquery = SQLquery + "FROM attendee_ces ce ";
            SQLquery = SQLquery + "INNER JOIN courses c ON ce.session_id = c.session_id ";
            SQLquery = SQLquery + "LEFT OUTER JOIN evaluations e ON e.session_id = c.session_id AND e.AttendeeID = '" + AttendeeID + "' ";
            SQLquery = SQLquery + "WHERE ce.AttendeeID = '" + AttendeeID + "' ";
            SQLquery = SQLquery + "ORDER BY c.course_id";
            //console.log("CE Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for CE query');
                    this.db = db;
                    console.log('Database: Set CE query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        //console.log('Database: CE query: ' + JSON.stringify(data));
                        console.log('Database: CE query rows: ' + data.rows.length);
                        let DatabaseResponse = [];
                        if (data.rows.length > 0) {
                            for (let i = 0; i < data.rows.length; i++) {
                                DatabaseResponse.push({
                                    session_id: data.rows.item(i).session_id,
                                    session_title: data.rows.item(i).session_title,
                                    course_id: data.rows.item(i).course_id,
                                    ceStatusScan: data.rows.item(i).ceStatusScan,
                                    ceStatusEval: data.rows.item(i).ceStatusEval,
                                    ce_credits_type: data.rows.item(i).ce_credits_type,
                                    Evaluated: data.rows.item(i).Evaluated,
                                    CEcreditsL: data.rows.item(i).CEcreditsL,
                                    CEcreditsP: data.rows.item(i).CEcreditsP
                                });
                            }
                        }
                        resolve(DatabaseResponse);
                    })
                        .catch(e => console.log('Database: CE query error: ' + JSON.stringify(e)));
                });
                console.log('Database: CE query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=cequery&flags=cl&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Evaluation Database Functions
    // 
    // -----------------------------------
    getEvaluationData(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        var flagValues = flags.split("|");
        var listingType = flagValues[0];
        var EventID = flagValues[1];
        var EvalType = flagValues[2];
        var SQLquery = "";
        var Q11 = "";
        var Q12 = "";
        var Q21 = "";
        var Q22 = "";
        var Q23 = "";
        var Q24 = "";
        var Q25 = "";
        var Q26 = "";
        var Q31 = "";
        var Q32 = "";
        var Q33 = "";
        var Q41 = "";
        var Q1 = "";
        var Q2 = "";
        var Q3 = "";
        var Q4 = "";
        var Q5 = "";
        var Q5C = "";
        var Q6 = "";
        var Q7 = "";
        var Q7C = "";
        var Q8 = "";
        var Q9 = "";
        var Q10 = "";
        var Q10C = "";
        var Q11C = "";
        var LastUpdated = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            if (EvalType == "Lecture" || EvalType == "Workshop") {
                console.log('Database: Lecture/Workshop Evaluation');
                // Individual session evaluations
                Q11 = flagValues[3];
                Q12 = flagValues[4];
                Q21 = flagValues[5];
                Q22 = flagValues[6];
                Q23 = flagValues[7];
                Q24 = flagValues[8];
                Q25 = flagValues[9];
                Q26 = flagValues[10];
                Q31 = flagValues[11];
                Q32 = flagValues[12];
                Q33 = flagValues[13];
                Q41 = flagValues[14];
                LastUpdated = flagValues[15];
                if (listingType == "ei") { // Retrieve session evaluations
                    SQLquery = "SELECT e.*, c.session_title, c.session_start_time, c.session_end_time, c.room_number AS RoomName ";
                    SQLquery = SQLquery + "FROM courses c ";
                    SQLquery = SQLquery + "LEFT OUTER JOIN evaluations e ON e.session_id = c.session_id AND e.AttendeeID = '" + AttendeeID + "' AND e.evaluationType = '" + EvalType + "' ";
                    SQLquery = SQLquery + "WHERE c.session_id = '" + EventID + "' ";
                }
                if (listingType == "ec") { // Retrieve session evaluation
                    SQLquery = "SELECT e.* ";
                    SQLquery = SQLquery + "FROM evaluations e ";
                    SQLquery = SQLquery + "WHERE e.AttendeeID = '" + AttendeeID + "' ";
                    SQLquery = SQLquery + "AND e.evaluationType = '" + EvalType + "' ";
                }
                if (listingType == "es") { // Save (new/update) evaluation
                    SQLquery = "SELECT * FROM evaluations WHERE AttendeeID = '" + AttendeeID + "' AND session_id = '" + EventID + "' AND evaluationType = '" + EvalType + "' ";
                }
                console.log('Database: SQL Query: ' + SQLquery);
            }
            else {
                console.log('Database: Conference Evaluation');
                // Overall conference evaluation
                Q1 = flagValues[3];
                Q2 = flagValues[4];
                Q3 = flagValues[5];
                Q4 = flagValues[6];
                Q5 = flagValues[7];
                Q5C = flagValues[8];
                Q6 = flagValues[9];
                Q7 = flagValues[10];
                Q7C = flagValues[11];
                Q8 = flagValues[12];
                Q9 = flagValues[13];
                Q10 = flagValues[14];
                Q10C = flagValues[15];
                Q11 = flagValues[16];
                Q11C = flagValues[17];
                LastUpdated = flagValues[18];
                if (listingType == "ec") { // Retrieve conference evaluation
                    SQLquery = "SELECT e.* ";
                    SQLquery = SQLquery + "FROM evaluation_conference e ";
                    SQLquery = SQLquery + "WHERE e.AttendeeID = '" + AttendeeID + "' ";
                }
                if (listingType == "es") { // Save (new/update) evaluation
                    SQLquery = "SELECT * FROM evaluation_conference WHERE AttendeeID = '" + AttendeeID + "' AND session_id = '" + EventID + "' ";
                }
            }
            console.log("Evaluation Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Evaluation query');
                    this.db = db;
                    console.log('Database: Set Evaluation query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Evaluation query: ' + JSON.stringify(data));
                        console.log('Database: Evaluation query rows: ' + data.rows.length);
                        var SQLquery2 = "";
                        let DatabaseResponse = [];
                        if (EvalType == "Lecture" || EvalType == "Workshop") {
                            console.log('Database: EvalType: ' + EvalType);
                            if (listingType == "ei") {
                                console.log('Database: listingType: ' + listingType);
                                if (data.rows.length > 0) {
                                    for (let i = 0; i < data.rows.length; i++) {
                                        DatabaseResponse.push({
                                            evalID: data.rows.item(i).evalID,
                                            AttendeeID: data.rows.item(i).AttendeeID,
                                            session_id: data.rows.item(i).session_id,
                                            evaluationType: data.rows.item(i).evaluationType,
                                            session_title: data.rows.item(i).session_title,
                                            session_start_time: data.rows.item(i).session_start_time,
                                            session_end_time: data.rows.item(i).session_end_time,
                                            RoomName: data.rows.item(i).RoomName,
                                            Q11: data.rows.item(i).Q11,
                                            Q12: data.rows.item(i).Q12,
                                            Q21: data.rows.item(i).Q21,
                                            Q22: data.rows.item(i).Q22,
                                            Q23: data.rows.item(i).Q23,
                                            Q24: data.rows.item(i).Q24,
                                            Q25: data.rows.item(i).Q25,
                                            Q26: data.rows.item(i).Q26,
                                            Q31: data.rows.item(i).Q31,
                                            Q32: data.rows.item(i).Q32,
                                            Q33: data.rows.item(i).Q33,
                                            Q41: data.rows.item(i).Q41,
                                            UpdateType: data.rows.item(i).UpdateType,
                                            LastUpdated: data.rows.item(i).LastUpdated
                                        });
                                        resolve(DatabaseResponse);
                                    }
                                }
                            }
                            if (listingType == "es") {
                                console.log('Database: listingType: ' + listingType);
                                if (data.rows.length > 0) {
                                    SQLquery2 = "UPDATE evaluations ";
                                    SQLquery2 = SQLquery2 + "SET UpdateType = 'Update', ";
                                    SQLquery2 = SQLquery2 + "Q11 = '" + Q11 + "', ";
                                    SQLquery2 = SQLquery2 + "Q12 = '" + Q12 + "', ";
                                    SQLquery2 = SQLquery2 + "Q21 = '" + Q21 + "', ";
                                    SQLquery2 = SQLquery2 + "Q22 = '" + Q22 + "', ";
                                    SQLquery2 = SQLquery2 + "Q23 = '" + Q23 + "', ";
                                    SQLquery2 = SQLquery2 + "Q24 = '" + Q24 + "', ";
                                    SQLquery2 = SQLquery2 + "Q25 = '" + Q25 + "', ";
                                    SQLquery2 = SQLquery2 + "Q26 = '" + Q26 + "', ";
                                    SQLquery2 = SQLquery2 + "Q31 = '" + Q31 + "', ";
                                    SQLquery2 = SQLquery2 + "Q32 = '" + Q32 + "', ";
                                    SQLquery2 = SQLquery2 + "Q33 = '" + Q33 + "', ";
                                    SQLquery2 = SQLquery2 + "Q41 = '" + Q41 + "', ";
                                    SQLquery2 = SQLquery2 + "LastUpdated = '" + LastUpdated + "' ";
                                    SQLquery2 = SQLquery2 + "WHERE session_id = '" + EventID + "' ";
                                    SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "' ";
                                    SQLquery2 = SQLquery2 + "AND evaluationType = '" + EvalType + "'";
                                    console.log('Database: evaluation query2: ' + SQLquery2);
                                    this.db.executeSql(SQLquery2, {}).then((data2) => {
                                        console.log('Database: evaluation query2: ' + JSON.stringify(data2));
                                        if (data2.rowsAffected > 0) {
                                            DatabaseResponse.push({
                                                EVStatus: "Success",
                                                EVQuery: ""
                                            });
                                        }
                                        else {
                                            DatabaseResponse.push({
                                                EVStatus: "Fail",
                                                EVQuery: ""
                                            });
                                        }
                                        resolve(DatabaseResponse);
                                    })
                                        .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                                }
                                else {
                                    SQLquery2 = "INSERT INTO evaluations (AttendeeID, session_id, evaluationType, Q11, Q12, Q21, Q22, Q23, Q24, Q25, Q26, Q31, Q32, Q33, Q41, LastUpdated, UpdateType) ";
                                    SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
                                    SQLquery2 = SQLquery2 + "'" + EventID + "', ";
                                    SQLquery2 = SQLquery2 + "'" + EvalType + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q11 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q12 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q21 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q22 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q23 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q24 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q25 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q26 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q31 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q32 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q33 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q41 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
                                    SQLquery2 = SQLquery2 + "'Insert')";
                                    console.log('Database: evaluation query2: ' + SQLquery2);
                                    this.db.executeSql(SQLquery2, {}).then((data2) => {
                                        console.log('Database: evaluation query2: ' + JSON.stringify(data2));
                                        if (data2.rowsAffected > 0) {
                                            DatabaseResponse.push({
                                                EVStatus: "Success",
                                                EVQuery: ""
                                            });
                                        }
                                        else {
                                            DatabaseResponse.push({
                                                EVStatus: "Fail",
                                                EVQuery: ""
                                            });
                                        }
                                        resolve(DatabaseResponse);
                                    })
                                        .catch(e => console.log('Database: evaluation query2 error: ' + JSON.stringify(e)));
                                }
                            }
                        }
                        else {
                            // Overall conference evaluation
                            console.log('Database: EvalType: ' + EvalType);
                            if (listingType == "ec") {
                                console.log('Database: listingType: ' + listingType);
                                if (data.rows.length > 0) {
                                    for (let i = 0; i < data.rows.length; i++) {
                                        DatabaseResponse.push({
                                            evalID: data.rows.item(i).evalID,
                                            AttendeeID: data.rows.item(i).AttendeeID,
                                            session_id: data.rows.item(i).session_id,
                                            evaluationType: data.rows.item(i).evaluationType,
                                            Q1: data.rows.item(i).Q1,
                                            Q2: data.rows.item(i).Q2,
                                            Q3: data.rows.item(i).Q3,
                                            Q4: data.rows.item(i).Q4,
                                            Q5: data.rows.item(i).Q5,
                                            Q5C: data.rows.item(i).Q5C,
                                            Q6: data.rows.item(i).Q6,
                                            Q7: data.rows.item(i).Q7,
                                            Q7C: data.rows.item(i).Q7C,
                                            Q8: data.rows.item(i).Q8,
                                            Q9: data.rows.item(i).Q9,
                                            Q10: data.rows.item(i).Q10,
                                            Q10C: data.rows.item(i).Q10C,
                                            Q11: data.rows.item(i).Q11,
                                            Q11C: data.rows.item(i).Q11C,
                                            UpdateType: data.rows.item(i).UpdateType,
                                            LastUpdated: data.rows.item(i).LastUpdated
                                        });
                                    }
                                }
                                resolve(DatabaseResponse);
                            }
                            if (listingType == "es") {
                                console.log('Database: listingType: ' + listingType);
                                if (data.rows.length > 0) {
                                    SQLquery2 = "UPDATE evaluation_conference ";
                                    SQLquery2 = SQLquery2 + "SET UpdateType = 'Update', ";
                                    SQLquery2 = SQLquery2 + "Q1 = '" + Q1 + "', ";
                                    SQLquery2 = SQLquery2 + "Q2 = '" + Q2 + "', ";
                                    SQLquery2 = SQLquery2 + "Q3 = '" + Q3 + "', ";
                                    SQLquery2 = SQLquery2 + "Q4 = '" + Q4 + "', ";
                                    SQLquery2 = SQLquery2 + "Q5 = '" + Q5 + "', ";
                                    SQLquery2 = SQLquery2 + "Q5C = '" + Q5C + "', ";
                                    SQLquery2 = SQLquery2 + "Q6 = '" + Q6 + "', ";
                                    SQLquery2 = SQLquery2 + "Q7 = '" + Q7 + "', ";
                                    SQLquery2 = SQLquery2 + "Q7C = '" + Q7C + "', ";
                                    SQLquery2 = SQLquery2 + "Q8 = '" + Q8 + "', ";
                                    SQLquery2 = SQLquery2 + "Q9 = '" + Q9 + "', ";
                                    SQLquery2 = SQLquery2 + "Q10 = '" + Q10 + "', ";
                                    SQLquery2 = SQLquery2 + "Q10C = '" + Q10C + "', ";
                                    SQLquery2 = SQLquery2 + "Q11 = '" + Q11 + "', ";
                                    SQLquery2 = SQLquery2 + "Q11C = '" + Q11C + "', ";
                                    SQLquery2 = SQLquery2 + "LastUpdated = '" + LastUpdated + "' ";
                                    SQLquery2 = SQLquery2 + "WHERE session_id = '" + EventID + "' ";
                                    SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";
                                    SQLquery2 = SQLquery2 + "AND evaluationType = '" + EvalType + "'";
                                    console.log('Database: evaluation query2: ' + SQLquery2);
                                    this.db.executeSql(SQLquery2, {}).then((data2) => {
                                        console.log('Database: evaluation query2: ' + JSON.stringify(data2));
                                        if (data2.rowsAffected > 0) {
                                            DatabaseResponse.push({
                                                EVStatus: "Success",
                                                EVQuery: ""
                                            });
                                        }
                                        else {
                                            DatabaseResponse.push({
                                                EVStatus: "Fail",
                                                EVQuery: ""
                                            });
                                        }
                                        resolve(DatabaseResponse);
                                    })
                                        .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                                }
                                else {
                                    SQLquery2 = "INSERT INTO evaluation_conference (AttendeeID, session_id, evaluationType, Q1, Q2, Q3, Q4, Q5, Q5C, ";
                                    SQLquery2 = SQLquery2 + "Q6, Q7, Q7C, Q8, Q9, Q10, Q10C, Q11, Q11C, LastUpdated, UpdateType) ";
                                    SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
                                    SQLquery2 = SQLquery2 + "'" + EventID + "', ";
                                    SQLquery2 = SQLquery2 + "'" + EvalType + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q1 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q2 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q3 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q4 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q5 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q5C + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q6 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q7 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q7C + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q8 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q9 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q10 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q10C + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q11 + "', ";
                                    SQLquery2 = SQLquery2 + "'" + Q11C + "', ";
                                    SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
                                    SQLquery2 = SQLquery2 + "'Insert')";
                                    console.log('Database: evaluation query2: ' + SQLquery2);
                                    this.db.executeSql(SQLquery2, {}).then((data2) => {
                                        console.log('Database: evaluation query2: ' + JSON.stringify(data2));
                                        if (data2.rowsAffected > 0) {
                                            DatabaseResponse.push({
                                                EVStatus: "Success",
                                                EVQuery: ""
                                            });
                                        }
                                        else {
                                            DatabaseResponse.push({
                                                EVStatus: "Fail",
                                                EVQuery: ""
                                            });
                                        }
                                        resolve(DatabaseResponse);
                                    })
                                        .catch(e => console.log('Database: evaluation query2 error: ' + JSON.stringify(e)));
                                }
                            }
                        }
                    })
                        .catch(e => console.log('Database: Evaluation query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Evaluation query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=evalquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Settings Database Functions
    // 
    // -----------------------------------
    getSettingsData(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var SQLquery = "SELECT DISTINCT c.session_id, c.course_id, c.session_title, ce.ceStatusScan, ce.ceStatusEval, c.ce_credits_type, ";
            SQLquery = SQLquery + "e.id AS Evaluated, c.CEcreditsL, c.CEcreditsP ";
            SQLquery = SQLquery + "FROM attendees_ces ce ";
            SQLquery = SQLquery + "INNER JOIN ce_courses_source c ON ce.session_id = c.session_id ";
            SQLquery = SQLquery + "ORDER BY c.course_id";
            console.log("Settings Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Settings query');
                    this.db = db;
                    console.log('Database: Set Settings query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Settings query: ' + JSON.stringify(data));
                        if (data.rows.length > 0) {
                            console.log('Database: Settings query results exist');
                        }
                        console.log('Database: Settings query rows: ' + data.rows.length);
                        resolve(data);
                    })
                        .catch(e => console.log('Database: Settings query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Settings query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=settings&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Program Guide Database Functions
    // 
    // -----------------------------------
    getLecturesByDay(dayID, listingType, AttendeeID) {
        console.log("dayID passed: " + dayID);
        console.log("listingType passed: " + listingType);
        var selectedDate = dayID;
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            // Set up base SQL string
            var SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
            SQLquery = SQLquery + "c.room_number AS RoomName, c.cs_credits, c.subject, c.room_capacity, s.itID AS OnAgenda, ";
            SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id AND ac.waitlist = 0) AS Attendees, ";
            SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
            SQLquery = SQLquery + "FROM courses c ";
            SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = '" + AttendeeID + "' AND s.UpdateType != 'Delete' ";
            //var SQLquery = "SELECT * FROM courses c ";
            // Append WHERE clause based on selection
            switch (listingType) {
                case "Lectures":
                    SQLquery = SQLquery + "WHERE ce_credits_type = 'Lecture' AND ActiveYN = 'Y' ";
                    SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%'";
                    break;
                case "Participation":
                    SQLquery = SQLquery + "WHERE ce_credits_type = 'Participation' AND ActiveYN = 'Y' ";
                    SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%'";
                    break;
                case "Receptions":
                    SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
                    SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
                    SQLquery = SQLquery + "AND session_id NOT IN ('S-53928','S-53929','SE-203709') ";
                    break;
                case "Exams":
                    SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
                    SQLquery = SQLquery + "AND session_id IN ('S-55009','S-55010') ";
                    break;
            }
            // Append sort order
            SQLquery = SQLquery + " ORDER BY c.session_start_time, c.course_id";
            console.log("Program Guide Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Program Guide query');
                    this.db = db;
                    console.log('Database: Set Program Guide query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Program Guide query: ' + JSON.stringify(data));
                        console.log('Database: Program Guide query rows: ' + data.rows.length);
                        let DatabaseResponse = [];
                        if (data.rows.length > 0) {
                            for (let i = 0; i < data.rows.length; i++) {
                                DatabaseResponse.push({
                                    session_id: data.rows.item(i).session_id,
                                    session_title: data.rows.item(i).session_title,
                                    session_start_time: data.rows.item(i).session_start_time,
                                    session_end_time: data.rows.item(i).session_end_time,
                                    primary_speaker: data.rows.item(i).primary_speaker,
                                    other_speakers: data.rows.item(i).other_speakers,
                                    cs_credits: data.rows.item(i).cs_credits,
                                    subject: data.rows.item(i).subject,
                                    room_capacity: data.rows.item(i).room_capacity,
                                    OnAgenda: data.rows.item(i).OnAgenda,
                                    Attendees: data.rows.item(i).Attendees,
                                    Waitlist: data.rows.item(i).Waitlist,
                                    RoomName: data.rows.item(i).RoomName
                                });
                            }
                        }
                        resolve(DatabaseResponse);
                    })
                        .catch(e => console.log('Database: Program Guide query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Program Guide query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var flags = dayID + "|" + listingType;
            var url = APIURLReference + "action=programdays&flags=" + flags + "&AttendeeID=" + AttendeeID;
            console.log('URL: ' + url);
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    getLectureData(flags, AttendeeID) {
        console.log("Database: getLectureData: flags passed: " + flags);
        var SQLquery = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var flagValues = flags.split("|"); // Split concatenated values
            var listingType = flagValues[0]; // Listing Type
            var selectedDate = flagValues[1]; // Specific date of sessions
            var sortOrder = flagValues[2]; // Output sort order
            var sessionID = flagValues[3]; // Specific course ID
            var searchParams = flagValues[4]; // Search parameters
            var searchType = flagValues[5]; // Search type
            if (listingType == "li") { // List of sessions
                SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
                SQLquery = SQLquery + "c.room_number AS RoomName, c.cs_credits, c.subject, c.room_capacity, s.itID AS OnAgenda, ";
                SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id AND ac.waitlist = 0) AS Attendees, ";
                SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
                SQLquery = SQLquery + "FROM courses c ";
                SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = '" + AttendeeID + "' AND s.UpdateType != 'Delete' ";
                // Append WHERE clause based on selection
                switch (listingType) {
                    case "Lectures":
                        SQLquery = SQLquery + "WHERE ce_credits_type = 'Lecture' AND ActiveYN = 'Y' ";
                        SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
                        break;
                    case "Participation":
                        SQLquery = SQLquery + "WHERE ce_credits_type = 'Participation' AND ActiveYN = 'Y' ";
                        SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
                        break;
                    case "Receptions":
                        SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
                        SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
                        SQLquery = SQLquery + "AND session_id NOT IN ('S-53928','S-53929','SE-203709') ";
                        break;
                    case "Exams":
                        SQLquery = SQLquery + "WHERE ce_credits_type = '' AND ActiveYN = 'Y' ";
                        SQLquery = SQLquery + "AND session_start_time LIKE '" + selectedDate + "%' ";
                        SQLquery = SQLquery + "AND session_id IN ('S-55009','S-55010') ";
                        break;
                }
                // Append sort order
                SQLquery = SQLquery + " ORDER BY c.session_start_time, c.course_id";
            }
            if (listingType == "sr") { // Search sessions
                // Split search terms by space to create WHERE clause
                var whereClause = 'WHERE (';
                var searchTerms = searchParams.split(" ");
                for (var index = 0; index < searchTerms.length; index++) {
                    whereClause = whereClause + 'c.SearchField LIKE "%' + searchTerms[index] + '%" AND ';
                }
                // Remove last AND from where clause
                whereClause = whereClause.substring(0, whereClause.length - 5);
                whereClause = whereClause + ') AND (';
                switch (searchType) {
                    case "L":
                        whereClause = whereClause + 'c.course_id LIKE "A%" ';
                        whereClause = whereClause + 'OR c.course_id LIKE "L%") ';
                        break;
                    case "P":
                        whereClause = whereClause + 'c.course_id LIKE "W%") ';
                        break;
                    case "OE":
                        whereClause = whereClause + "ce_credits_type = '' ";
                        whereClause = whereClause + "AND session_id NOT IN ('S-53928','S-53929','SE-143825','SE-143839','SE-156024','SE-168473')) ";
                        break;
                }
                // Set up base SQL string
                SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, ";
                SQLquery = SQLquery + "c.room_number AS RoomName, c.cs_credits, c.subject ";
                SQLquery = SQLquery + "FROM courses c ";
                SQLquery = SQLquery + whereClause;
                SQLquery = SQLquery + " ORDER BY c.session_start_time, c.course_id";
            }
            if (listingType == "dt") { // Details of session
                // Validate query
                SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.session_start_time, c.session_end_time, c.speaker_host_emcee, c.corporate_supporter, c.session_recording, ";
                SQLquery = SQLquery + "c.primary_speaker, c.other_speakers, c.room_number AS RoomName, lr.FloorNumber, lr.RoomX, lr.RoomY, c.description, c.course_id, c.ce_credits_type, c.HandoutFilename, ";
                SQLquery = SQLquery + "c.subject, c.type AS CourseType, c.level AS CourseLevel, c.cs_credits, c.CEcreditsL, c.CEcreditsP, c.room_capacity, s.itID AS OnAgenda, ";
                SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac WHERE ac.session_id = c.session_id AND ac.waitlist = 0) AS Attendees, ";
                SQLquery = SQLquery + "(SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist ";
                SQLquery = SQLquery + "FROM courses c ";
                SQLquery = SQLquery + "LEFT OUTER JOIN itinerary s ON s.EventID = c.session_id AND s.AttendeeID = " + AttendeeID + " ";
                SQLquery = SQLquery + "LEFT OUTER JOIN lookup_rooms lr ON c.room_number = lr.RoomName ";
                SQLquery = SQLquery + "WHERE c.session_id = '" + sessionID + "' ";
            }
            console.log("Lecture Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Lecture query');
                    this.db = db;
                    console.log('Database: Set Lecture query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Speaker query: ' + JSON.stringify(data));
                        console.log('Database: Speaker query rows: ' + data.rows.length);
                        let DatabaseResponse = [];
                        if (data.rows.length > 0) {
                            for (let i = 0; i < data.rows.length; i++) {
                                if (listingType == "li") {
                                    DatabaseResponse.push({
                                        session_id: data.rows.item(i).session_id,
                                        session_title: data.rows.item(i).session_title,
                                        session_start_time: data.rows.item(i).session_start_time,
                                        session_end_time: data.rows.item(i).session_end_time,
                                        primary_speaker: data.rows.item(i).primary_speaker,
                                        other_speakers: data.rows.item(i).other_speakers,
                                        RoomName: data.rows.item(i).RoomName,
                                        cs_credits: data.rows.item(i).cs_credits,
                                        subject: data.rows.item(i).subject,
                                        room_capacity: data.rows.item(i).room_capacity,
                                        OnAgenda: data.rows.item(i).OnAgenda,
                                        Attendees: data.rows.item(i).Attendees,
                                        Waitlist: data.rows.item(i).Waitlist
                                    });
                                }
                                if (listingType == "sr") {
                                    DatabaseResponse.push({
                                        session_id: data.rows.item(i).session_id,
                                        session_title: data.rows.item(i).session_title,
                                        session_start_time: data.rows.item(i).session_start_time,
                                        session_end_time: data.rows.item(i).session_end_time,
                                        primary_speaker: data.rows.item(i).primary_speaker,
                                        other_speakers: data.rows.item(i).other_speakers,
                                        RoomName: data.rows.item(i).RoomName,
                                        cs_credits: data.rows.item(i).cs_credits,
                                        subject: data.rows.item(i).subject
                                    });
                                }
                                if (listingType == "dt") {
                                    DatabaseResponse.push({
                                        session_id: data.rows.item(i).session_id,
                                        session_title: data.rows.item(i).session_title,
                                        session_start_time: data.rows.item(i).session_start_time,
                                        session_end_time: data.rows.item(i).session_end_time,
                                        primary_speaker: data.rows.item(i).primary_speaker,
                                        other_speakers: data.rows.item(i).other_speakers,
                                        RoomName: data.rows.item(i).RoomName,
                                        RoomX: data.rows.item(i).RoomX,
                                        RoomY: data.rows.item(i).RoomY,
                                        cs_credits: data.rows.item(i).cs_credits,
                                        subject: data.rows.item(i).subject,
                                        room_capacity: data.rows.item(i).room_capacity,
                                        OnAgenda: data.rows.item(i).OnAgenda,
                                        Attendees: data.rows.item(i).Attendees,
                                        Waitlist: data.rows.item(i).Waitlist,
                                        speaker_host_emcee: data.rows.item(i).speaker_host_emcee,
                                        corporate_supporter: data.rows.item(i).corporate_supporter,
                                        session_recording: data.rows.item(i).session_recording,
                                        description: data.rows.item(i).description,
                                        course_id: data.rows.item(i).course_id,
                                        ce_credits_type: data.rows.item(i).ce_credits_type,
                                        HandoutFilename: data.rows.item(i).HandoutFilename,
                                        type: data.rows.item(i).CourseType,
                                        level: data.rows.item(i).CourseLevel,
                                        CEcreditsL: data.rows.item(i).CEcreditsL,
                                        CEcreditsP: data.rows.item(i).CEcreditsP
                                    });
                                }
                            }
                        }
                        resolve(DatabaseResponse);
                    })
                        .catch(e => console.log('Database: Speaker query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Lecture query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=lecturequery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Speaker / Educator Database Functions
    // 
    // -----------------------------------
    getSpeakerData(flags, AttendeeID) {
        console.log("getSpeakerData: flags passed: " + flags);
        var SQLquery = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var flagValues = flags.split("|"); // Split concatenated values
            var listingType = flagValues[0]; // Listing Type
            var sortOrder = flagValues[1]; // Output sort order
            var speakerID = flagValues[2]; // Specific speaker ID
            var QueryParam = flagValues[3] || ''; // Course parameters for speaker details
            var courseID = flagValues[4] || ''; // Specific course ID for list of linked speakers
            if (listingType == "li" || listingType == "sr") { // List of speakers
                // Validate query
                SQLquery = "SELECT DISTINCT s.speakerID, s.LastName, s.FirstName, s.Credentials, s.Bio, s.Courses, s.imageFilename ";
                SQLquery = SQLquery + "FROM courses_speakers s ";
                if (listingType == "sr") { // If searching, then add where clause criteria
                    // Split search terms by space to create WHERE clause
                    var whereClause = 'WHERE (';
                    var searchTerms = QueryParam.split(" ");
                    for (var i = 0; i < searchTerms.length; i++) {
                        whereClause = whereClause + 's.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
                    }
                    // Remove last AND from where clause
                    whereClause = whereClause.substring(0, whereClause.length - 5);
                    whereClause = whereClause + ') ';
                    SQLquery = SQLquery + whereClause;
                }
                SQLquery = SQLquery + "ORDER BY s.LastName, s.FirstName";
            }
            if (listingType == "dt") { // Details of speaker
                // Validate query
                SQLquery = "SELECT DISTINCT s.speakerID, s.LastName, s.FirstName, s.Credentials, s.Bio, s.Courses, s.imageFilename ";
                SQLquery = SQLquery + "FROM courses_speakers s ";
                SQLquery = SQLquery + "WHERE speakerID = " + speakerID + " ";
            }
            if (listingType == "cl") { // Course listing for specific speaker
                // Validate query
                SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.session_start_time, c.session_end_time, c.room_number AS RoomName ";
                SQLquery = SQLquery + "FROM courses c ";
                SQLquery = SQLquery + "WHERE c.course_id IN " + QueryParam + " ";
            }
            if (listingType == "cd") { // List of speakers for specific course
                // Validate query
                SQLquery = "SELECT DISTINCT s.speakerID, s.FirstName, s.LastName, s.Credentials, s.Bio, s.Courses, s.imageFilename ";
                SQLquery = SQLquery + "FROM courses_speakers s ";
                SQLquery = SQLquery + "WHERE s.Courses LIKE '%" + courseID + "%' ";
                SQLquery = SQLquery + "ORDER BY s.LastName, s.FirstName";
            }
            console.log("Speaker Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Speaker query');
                    this.db = db;
                    console.log('Database: Set Speaker query db variable');
                    if (listingType == "cl") {
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Speaker query: ' + JSON.stringify(data));
                            console.log('Database: Speaker query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if (data.rows.length > 0) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        session_id: data.rows.item(i).session_id,
                                        session_title: data.rows.item(i).session_title,
                                        session_start_time: data.rows.item(i).session_start_time,
                                        session_end_time: data.rows.item(i).session_end_time,
                                        RoomName: data.rows.item(i).RoomName
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        })
                            .catch(e => console.log('Database: Speaker query error: ' + JSON.stringify(e)));
                    }
                    else {
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Speaker query: ' + JSON.stringify(data));
                            console.log('Database: Speaker query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if (data.rows.length > 0) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        speakerID: data.rows.item(i).speakerID,
                                        FirstName: data.rows.item(i).FirstName,
                                        LastName: data.rows.item(i).LastName,
                                        Credentials: data.rows.item(i).Credentials,
                                        Bio: data.rows.item(i).Bio,
                                        Courses: data.rows.item(i).Courses,
                                        imageFilename: data.rows.item(i).imageFilename
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        })
                            .catch(e => console.log('Database: Speaker query error: ' + JSON.stringify(e)));
                    }
                });
                console.log('Database: Speaker query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=spkrquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Exhibitor Database Functions
    // 
    // -----------------------------------
    getExhibitorData(flags) {
        console.log("flags passed: " + flags);
        var SQLquery = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var flagValues = flags.split("|");
            var listingType = flagValues[0];
            var sortOrder = flagValues[1];
            var exhibitorID = flagValues[2];
            var QueryParam = flagValues[3] || ''; // Search parameters for exhibitors
            if (listingType == "li" || listingType == "sr") { // List of exhibitors
                // Validate query
                SQLquery = "SELECT DISTINCT e.ExhibitorID, e.CompanyName, e.AddressLine1, e.AddressLine2, e.City, e.State, e.ZipPostalCode, e.Country,  ";
                SQLquery = SQLquery + "e.Website, e.PrimaryOnsiteContactName, e.PrimaryOnsiteContactEmail, e.PrimaryOnsiteContactPhone, ";
                SQLquery = SQLquery + "e.BoothNumber, bm.BoothX, bm.BoothY, e.imageFilename, ";
                SQLquery = SQLquery + "e.ProductsServices, e.CompanyDescription, ";
                SQLquery = SQLquery + "e.SocialMediaFacebook, e.SocialMediaTwitter, e.SocialMediaGooglePlus, e.SocialMediaYouTube, e.SocialMediaLinkedIn ";
                SQLquery = SQLquery + "FROM exhibitors e ";
                SQLquery = SQLquery + "LEFT OUTER JOIN booth_mapping bm ON bm.BoothNumber = e.BoothNumber ";
                if (listingType == "sr") { // If searching, then add where clause criteria
                    // Split search terms by space to create WHERE clause
                    var whereClause = 'WHERE (';
                    var searchTerms = QueryParam.split(" ");
                    for (var i = 0; i < searchTerms.length; i++) {
                        whereClause = whereClause + 'e.SearchField LIKE "%' + searchTerms[i] + '%" AND ';
                    }
                    // Remove last AND from where clause
                    whereClause = whereClause.substring(0, whereClause.length - 5);
                    whereClause = whereClause + ') ';
                    SQLquery = SQLquery + whereClause;
                    SQLquery = SQLquery + " ORDER BY CompanyName";
                }
                else {
                    if (sortOrder == "Alpha") {
                        SQLquery = SQLquery + " ORDER BY CompanyName";
                    }
                    else {
                        SQLquery = SQLquery + " ORDER BY BoothNumber";
                    }
                }
            }
            if (listingType == "dt") { // Exhibitor details
                // Validate query
                SQLquery = "SELECT e.ExhibitorID, e.CompanyName, e.AddressLine1, e.AddressLine2, e.City, e.State, e.ZipPostalCode, e.Country,  ";
                SQLquery = SQLquery + "e.Website, e.PrimaryOnsiteContactName, e.PrimaryOnsiteContactEmail, e.PrimaryOnsiteContactPhone, ";
                SQLquery = SQLquery + "e.BoothNumber, bm.BoothX, bm.BoothY, e.imageFilename, ";
                SQLquery = SQLquery + "e.ProductsServices, e.CompanyDescription, ";
                SQLquery = SQLquery + "e.SocialMediaFacebook, e.SocialMediaTwitter, e.SocialMediaGooglePlus, e.SocialMediaYouTube, e.SocialMediaLinkedIn ";
                SQLquery = SQLquery + "FROM exhibitors e ";
                SQLquery = SQLquery + "LEFT OUTER JOIN booth_mapping bm ON bm.BoothNumber = e.BoothNumber ";
                SQLquery = SQLquery + "WHERE e.ExhibitorID = " + exhibitorID;
            }
            console.log("Exhibitor Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Exhibitor query');
                    this.db = db;
                    console.log('Database: Set Exhibitor query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Exhibitor query: ' + JSON.stringify(data));
                        console.log('Database: Exhibitor query rows: ' + data.rows.length);
                        let DatabaseResponse = [];
                        if (data.rows.length > 0) {
                            for (let i = 0; i < data.rows.length; i++) {
                                DatabaseResponse.push({
                                    ExhibitorID: data.rows.item(i).ExhibitorID,
                                    CompanyName: data.rows.item(i).CompanyName,
                                    AddressLine1: data.rows.item(i).AddressLine1,
                                    AddressLine2: data.rows.item(i).AddressLine2,
                                    City: data.rows.item(i).City,
                                    State: data.rows.item(i).State,
                                    ZipPostalCode: data.rows.item(i).ZipPostalCode,
                                    Country: data.rows.item(i).Country,
                                    Website: data.rows.item(i).Website,
                                    PrimaryOnsiteContactName: data.rows.item(i).PrimaryOnsiteContactName,
                                    PrimaryOnsiteContactEmail: data.rows.item(i).PrimaryOnsiteContactEmail,
                                    PrimaryOnsiteContactPhone: data.rows.item(i).PrimaryOnsiteContactPhone,
                                    BoothNumber: data.rows.item(i).BoothNumber,
                                    BoothX: data.rows.item(i).BoothX,
                                    BoothY: data.rows.item(i).BoothY,
                                    imageFilename: data.rows.item(i).imageFilename,
                                    ProductsServices: data.rows.item(i).ProductsServices,
                                    CompanyDescription: data.rows.item(i).CompanyDescription,
                                    SocialMediaFacebook: data.rows.item(i).SocialMediaFacebook,
                                    SocialMediaTwitter: data.rows.item(i).SocialMediaTwitter,
                                    SocialMediaGooglePlus: data.rows.item(i).SocialMediaGooglePlus,
                                    SocialMediaYouTube: data.rows.item(i).SocialMediaYouTube,
                                    SocialMediaLinkedIn: data.rows.item(i).SocialMediaLinkedIn
                                });
                            }
                        }
                        resolve(DatabaseResponse);
                    })
                        .catch(e => console.log('Database: Exhibitor query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Exhibitor query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=exhquery&flags=" + flags;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Agenda Database Functions
    // 
    // -----------------------------------
    getAgendaData(flags, AttendeeID) {
        console.log("Database: flags passed: " + flags);
        console.log("Database: AttendeeID passed: " + AttendeeID);
        var re = /\'/gi;
        var flagValues = flags.split("|");
        var listingType = flagValues[0];
        var selectedDay = flagValues[1];
        var EventID = flagValues[2];
        var EventStartTime = flagValues[3];
        var EventEndTime = flagValues[4];
        var EventLocation = flagValues[5];
        //EventLocation = EventLocation.replace(re, "''");
        var EventName = flagValues[6];
        //EventName = EventName.replace(re, "''");
        var EventDate = flagValues[7];
        var AAOID = flagValues[8];
        var LastUpdated = flagValues[9];
        var EventDescription = flagValues[10];
        //EventDescription = EventDescription.replace(re, "''");
        var SQLquery = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            if (LastUpdated == 'NA') {
                var currentdate = new Date();
                var datetime = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDay()).slice(-2) + ' ';
                datetime = datetime + ('0' + currentdate.getHours()).slice(-2) + ":" + ('0' + currentdate.getMinutes()).slice(-2) + ":" + ('0' + currentdate.getSeconds()).slice(-2);
                LastUpdated = datetime;
            }
            // Official sessions
            if (listingType == "li") { // List of agenda items
                // Validate query
                SQLquery = "SELECT DISTINCT itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, '0' AS Waitlist, '100' AS RoomCapacity ";
                SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID = '0' ";
                SQLquery = SQLquery + "AND UpdateType != 'Delete' ";
                SQLquery = SQLquery + "UNION ";
                SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, EventID, mtgID, TIME(session_start_time) AS EventStartTime, TIME(session_end_time) AS EventEndTime, Location AS EventLocation,  ";
                SQLquery = SQLquery + "c.Description AS EventDescription, c.session_title AS EventName, DATE(session_start_time) AS EventDate, ";
                SQLquery = SQLquery + "(SELECT COUNT(acID) AS Attendees FROM attendee_courses ac ";
                SQLquery = SQLquery + " INNER JOIN courses c ON ac.session_id = c.session_id ";
                SQLquery = SQLquery + " WHERE ac.session_id = i.EventID AND ac.waitlist = 0) AS Attendees, ";
                SQLquery = SQLquery + " (SELECT CASE waitlist WHEN NULL THEN 0 ELSE waitlist END FROM attendee_courses ac2 ";
                SQLquery = SQLquery + " INNER JOIN courses c2 ON ac2.session_id = c2.session_id ";
                SQLquery = SQLquery + " WHERE ac2.session_id = c.session_id AND ac2.ct_id = '" + AttendeeID + "') AS Waitlist, ";
                SQLquery = SQLquery + " (SELECT room_capacity FROM courses c3 WHERE c3.session_id = i.EventID) AS RoomCapacity ";
                SQLquery = SQLquery + "FROM itinerary i  ";
                SQLquery = SQLquery + "INNER JOIN courses c ON i.EventID = c.session_id  ";
                SQLquery = SQLquery + "WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID != '0' ";
                SQLquery = SQLquery + "AND i.UpdateType != 'Delete' ";
                SQLquery = SQLquery + "ORDER BY EventStartTime, EventID ";
            }
            // Official sessions
            if (listingType == "li2") { // List of agenda items for side menu
                // Validate query
                SQLquery = "SELECT DISTINCT itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, '0' AS Waitlist, '100' AS RoomCapacity, LastUpdated ";
                SQLquery = SQLquery + "FROM itinerary WHERE Date_Start >= date('now') AND AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID = '0' ";
                SQLquery = SQLquery + "AND UpdateType != 'Delete' ";
                SQLquery = SQLquery + "UNION ";
                SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, EventID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate, '0' AS Attendees, LastUpdated, ";
                SQLquery = SQLquery + "(SELECT ac.waitlist FROM attendee_courses ac WHERE ac.ct_ID=i.AttendeeID AND ac.session_id=i.EventID) AS Waitlist, '100' AS RoomCapacity ";
                SQLquery = SQLquery + "FROM itinerary i WHERE Date_Start >= date('now') AND AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID != '0' ";
                SQLquery = SQLquery + "AND UpdateType != 'Delete' ";
                SQLquery = SQLquery + "ORDER BY EventDate, EventStartTime, Waitlist, LastUpdated ";
                SQLquery = SQLquery + "LIMIT 10 ";
            }
            if (listingType == "ad") { // Add an agenda item
                SQLquery = "SELECT * FROM itinerary WHERE AttendeeID = '" + AttendeeID + "' AND EventID = '" + EventID + "'";
            }
            if (listingType == "dl") { // Remove an agenda item
                // Validate query
                SQLquery = "UPDATE itinerary ";
                SQLquery = SQLquery + "SET UpdateType = 'Delete' ";
                SQLquery = SQLquery + "WHERE EventID = '" + EventID + "' ";
                SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
            }
            if (listingType == "up") { // Update an agenda item
                // Validate query
                SQLquery = "SELECT DISTINCT itID, EventID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate ";
                SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID = '0' ";
                SQLquery = SQLquery + "UNION ";
                SQLquery = SQLquery + "SELECT DISTINCT '0' AS itID, EventID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate ";
                SQLquery = SQLquery + "FROM itinerary WHERE Date_Start = '" + selectedDay + "' AND AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID != '0' ";
                SQLquery = SQLquery + "ORDER BY EventStartTime";
            }
            // Personal sessions
            if (listingType == "pi") { // Retrieve personal schedule item
                SQLquery = "SELECT DISTINCT itID, mtgID, Time_Start AS EventStartTime, Time_End AS EventEndTime, Location AS EventLocation, Description AS EventDescription, SUBJECT AS EventName, Date_Start AS EventDate ";
                SQLquery = SQLquery + "FROM itinerary ";
                SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "AND EventID = '0' ";
                SQLquery = SQLquery + "AND mtgID = " + EventID + " ";
                SQLquery = SQLquery + "AND UpdateType != 'Delete' ";
                SQLquery = SQLquery + "ORDER BY EventStartTime";
            }
            if (listingType == "pd") { // Delete Personal agenda item
                SQLquery = "SELECT * FROM itinerary WHERE AttendeeID = '" + AttendeeID + "' AND mtgID = " + EventID;
            }
            if (listingType == "ps") { // Save (new/update) Personal agenda item
                SQLquery = "SELECT * FROM itinerary WHERE AttendeeID = '" + AttendeeID + "' AND mtgID = " + EventID;
            }
            //console.log("Database: Agenda Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    this.db = db;
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        //console.log('Database: Agenda query: ' + JSON.stringify(data));
                        console.log('Database: Agenda query rows: ' + data.rows.length);
                        var SQLquery2 = "";
                        let DatabaseResponse = [];
                        if (listingType == "dl") {
                            if (data.rowsAffected == "1") {
                                DatabaseResponse.push({
                                    DeleteStatus: "Success",
                                    DeleteQuery: "",
                                });
                            }
                            else {
                                DatabaseResponse.push({
                                    DeleteStatus: "Fail",
                                    DeleteQuery: "",
                                });
                            }
                            resolve(DatabaseResponse);
                        }
                        if (listingType == "pd") {
                            if (data.rowsAffected == "1") {
                                DatabaseResponse.push({
                                    PEStatus: "Success",
                                    PEQuery: "",
                                });
                            }
                            else {
                                DatabaseResponse.push({
                                    PEStatus: "Fail",
                                    PEQuery: "",
                                });
                            }
                            resolve(DatabaseResponse);
                        }
                        if (listingType == "ad") {
                            if (data.rows.length > 0) {
                                SQLquery2 = "UPDATE itinerary ";
                                SQLquery2 = SQLquery2 + "SET UpdateType = 'Update' ";
                                SQLquery2 = SQLquery2 + "WHERE EventID = '" + EventID + "' ";
                                SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";
                                //console.log('Database: Agenda query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    //console.log('Database: Agenda query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            AddStatus: "Success",
                                            AddQuery: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            AddStatus: "Fail",
                                            AddQuery: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                            }
                            else {
                                SQLquery2 = "INSERT INTO itinerary (AttendeeID, atID, EventID, Time_Start, Time_End, Location, Subject, Date_Start, Date_End, LastUpdated, UpdateType) ";
                                SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
                                SQLquery2 = SQLquery2 + "'" + AttendeeID + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventID + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventStartTime + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventEndTime + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventLocation + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventName + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
                                SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
                                SQLquery2 = SQLquery2 + "'Insert')";
                                console.log('Database: Agenda query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    //console.log('Database: Agenda query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            AddStatus: "Success",
                                            AddQuery: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            AddStatus: "Fail",
                                            AddQuery: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                            }
                        }
                        if (listingType == "ps") {
                            if (data.rows.length > 0) {
                                SQLquery2 = "UPDATE itinerary ";
                                SQLquery2 = SQLquery2 + "SET UpdateType = 'Update', ";
                                SQLquery2 = SQLquery2 + "Date_Start = '" + EventDate + "', ";
                                SQLquery2 = SQLquery2 + "Date_End = '" + EventDate + "', ";
                                SQLquery2 = SQLquery2 + "Time_Start = '" + EventStartTime + "', ";
                                SQLquery2 = SQLquery2 + "Time_End = '" + EventEndTime + "', ";
                                SQLquery2 = SQLquery2 + "Subject = '" + EventName + "', ";
                                SQLquery2 = SQLquery2 + "Location = '" + EventLocation + "', ";
                                SQLquery2 = SQLquery2 + "Description = '" + EventDescription + "', ";
                                SQLquery2 = SQLquery2 + "LastUpdated = '" + LastUpdated + "' ";
                                SQLquery2 = SQLquery2 + "WHERE mtgID = " + EventID + " ";
                                SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";
                                SQLquery2 = SQLquery2 + "AND AttendeeID = '" + AttendeeID + "'";
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    //console.log('Database: Agenda query2: ' + JSON.stringify(data2));
                                    console.log('Database: Agenda query rows2: ' + data2.rows.length);
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            PEStatus: "Success",
                                            PEQuery: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            PEStatus: "Fail",
                                            PEQuery: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                            }
                            else {
                                SQLquery2 = "INSERT INTO itinerary (AttendeeID, atID, mtgID, EventID, Time_Start, Time_End, Location, Subject, Date_Start, Date_End, LastUpdated, UpdateType) ";
                                SQLquery2 = SQLquery2 + "VALUES ('" + AttendeeID + "', ";
                                SQLquery2 = SQLquery2 + "'" + AttendeeID + "', ";
                                SQLquery2 = SQLquery2 + "'0', ";
                                SQLquery2 = SQLquery2 + "'" + EventID + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventStartTime + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventEndTime + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventLocation + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventName + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
                                SQLquery2 = SQLquery2 + "'" + EventDate + "', ";
                                SQLquery2 = SQLquery2 + "'" + LastUpdated + "', ";
                                SQLquery2 = SQLquery2 + "'Insert')";
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    //console.log('Database: Agenda query2: ' + JSON.stringify(data2));
                                    console.log('Database: Agenda query rows2: ' + data2.rows.length);
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            PEStatus: "Success",
                                            PEQuery: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            PEStatus: "Fail",
                                            PEQuery: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Agenda query2 error: ' + JSON.stringify(e)));
                            }
                        }
                        if (listingType == "li" || listingType == "li2" || listingType == "pi") {
                            if (data.rows.length > 0) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        itID: data.rows.item(i).itID,
                                        EventID: data.rows.item(i).EventID,
                                        mtgID: data.rows.item(i).mtgID,
                                        EventStartTime: data.rows.item(i).EventStartTime,
                                        EventEndTime: data.rows.item(i).EventEndTime,
                                        EventLocation: data.rows.item(i).EventLocation,
                                        EventDescription: data.rows.item(i).EventDescription,
                                        EventName: data.rows.item(i).EventName,
                                        EventDate: data.rows.item(i).EventDate,
                                        Attendees: data.rows.item(i).Attendees,
                                        Waitlist: data.rows.item(i).Waitlist,
                                        RoomCapacity: data.rows.item(i).RoomCapacity
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        }
                    })
                        .catch(e => console.log('Database: Agenda query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Agenda query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=agendaquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            console.log('Database: URL call: ' + url);
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    // -----------------------------------
    // 
    // Misc Database Functions
    // 
    // -----------------------------------
    BlankLocalDatabase() {
        // Blank the local SQLite database
        console.log("Blanking the local SQLite database");
        var SQLquery = 'DELETE FROM attendees';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        SQLquery = 'DELETE FROM attendee_ces';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        SQLquery = 'DELETE FROM itinerary';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        SQLquery = 'DELETE FROM notes';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        SQLquery = 'DELETE FROM evaluations';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        SQLquery = 'DELETE FROM evaluation_conference';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        // App tables
        SQLquery = 'DELETE FROM record_deletes';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        // Session tables
        SQLquery = 'DELETE FROM courses';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        SQLquery = 'DELETE FROM courses_speakers';
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
        // Exhibitor tables
        SQLquery = "DELETE FROM exhibitors";
        this.db.executeSql(SQLquery, {}).then(() => console.log('Executed SQL' + SQLquery))
            .catch(e => console.log(JSON.stringify(e)));
    }
    getSearchData(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        console.log("AttendeeID passed: " + AttendeeID);
        var searchTerms = flags || '';
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            var SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.course_id, c.primary_speaker, c.other_speakers, c.session_start_time, c.session_end_time, c.room_number AS RoomName ";
            SQLquery = SQLquery + "FROM courses c ";
            SQLquery = SQLquery + "WHERE course_topics LIKE '%" + searchTerms + "%' ";
            SQLquery = SQLquery + "ORDER BY session_start_time, course_id";
            console.log("Search Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    console.log('Database: Opened DB for Search query');
                    this.db = db;
                    console.log('Database: Set Search query db variable');
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Search query: ' + JSON.stringify(data));
                        console.log('Database: Search query rows: ' + data.rows.length);
                        let DatabaseResponse = [];
                        if (data.rows.length > 0) {
                            for (let i = 0; i < data.rows.length; i++) {
                                DatabaseResponse.push({
                                    session_id: data.rows.item(i).session_id,
                                    session_title: data.rows.item(i).session_title,
                                    course_id: data.rows.item(i).course_id,
                                    primary_speaker: data.rows.item(i).primary_speaker,
                                    other_speakers: data.rows.item(i).other_speakers,
                                    session_start_time: data.rows.item(i).session_start_time,
                                    session_end_time: data.rows.item(i).session_end_time,
                                    RoomName: data.rows.item(i).RoomName
                                });
                            }
                        }
                        resolve(DatabaseResponse);
                    })
                        .catch(e => console.log('Database: Search query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Search query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=searchquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    getNotesData(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        console.log("AttendeeID passed: " + AttendeeID);
        var flagValues = flags.split("|");
        var selectedDay = flagValues[0];
        var listingType = flagValues[1];
        var EventID = flagValues[2];
        var NoteID = flagValues[3];
        var NoteText = flagValues[4];
        var LastUpdated = flagValues[5];
        var SQLquery = "";
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            if (listingType == "li") { // List of notes
                // Validate query
                SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.other_speakers, c.primary_speaker, c.session_start_time, c.session_end_time, c.room_number AS RoomName, n.Note, n.atnID as id ";
                SQLquery = SQLquery + "FROM attendee_notes n ";
                SQLquery = SQLquery + "INNER JOIN courses c ON c.session_id = n.EventID ";
                SQLquery = SQLquery + "WHERE c.session_start_time LIKE '" + selectedDay + "%' ";
                SQLquery = SQLquery + "AND n.AttendeeID = '" + AttendeeID + "'";
            }
            if (listingType == "dt") { // Specific note
                // Validate query
                SQLquery = "SELECT DISTINCT c.session_id, c.session_title, c.other_speakers, c.primary_speaker, c.session_start_time, c.session_end_time, c.room_number AS RoomName, n.Note, n.atnID as id ";
                SQLquery = SQLquery + "FROM courses c ";
                SQLquery = SQLquery + "LEFT OUTER JOIN attendee_notes n ON c.session_id = n.EventID AND n.AttendeeID = '" + AttendeeID + "' ";
                SQLquery = SQLquery + "WHERE c.session_id = '" + EventID + "' ";
            }
            if (listingType == "un") { // Update specific note
                if (LastUpdated == 'NA') {
                    LastUpdated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                }
                // Validate query
                SQLquery = "UPDATE attendee_notes SET Note = '" + NoteText + "', LastUpdated = '" + LastUpdated + "' WHERE atnID = " + NoteID + " ";
            }
            if (listingType == "sn") { // Save new note
                if (LastUpdated == 'NA') {
                    LastUpdated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                }
                // Validate query
                SQLquery = "INSERT INTO attendee_notes(AttendeeID, EventID, Note, LastUpdated, UpdateType) ";
                SQLquery = SQLquery + "VALUES('" + AttendeeID + "','" + EventID + "','" + NoteText + "','" + LastUpdated + "','Insert')";
            }
            console.log("Notes Query: " + SQLquery);
            // Perform query against local SQLite database
            return new Promise(resolve => {
                this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                    this.db = db;
                    this.db.executeSql(SQLquery, {}).then((data) => {
                        console.log('Database: Notes query: ' + JSON.stringify(data));
                        console.log('Database: Notes query rows: ' + data.rows.length);
                        let DatabaseResponse = [];
                        if (listingType == "un" || listingType == "sn") {
                            if (data.rowsAffected == "1") {
                                DatabaseResponse.push({
                                    status: "Saved"
                                });
                            }
                            else {
                                DatabaseResponse.push({
                                    status: "Failed"
                                });
                            }
                        }
                        else {
                            if (data.rows.length > 0) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        id: data.rows.item(i).id,
                                        session_id: data.rows.item(i).session_id,
                                        session_title: data.rows.item(i).session_title,
                                        primary_speaker: data.rows.item(i).primary_speaker,
                                        other_speakers: data.rows.item(i).other_speakers,
                                        session_start_time: data.rows.item(i).session_start_time,
                                        session_end_time: data.rows.item(i).session_end_time,
                                        RoomName: data.rows.item(i).RoomName,
                                        Note: data.rows.item(i).Note
                                    });
                                }
                            }
                        }
                        resolve(DatabaseResponse);
                    })
                        .catch(e => console.log('Database: Notes query error: ' + JSON.stringify(e)));
                });
                console.log('Database: Notes query complete');
            });
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=notesquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    getinitialData(flags) {
        console.log("Database: getinitialData");
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            console.log('Database: Getting initial table data for "' + flags + '"');
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=initialdataquery&flags=" + flags;
            console.log('Database: URL: ' + url);
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
    getDatabaseStats(flags, AttendeeID) {
        console.log("flags passed: " + flags);
        console.log("AttendeeID passed: " + AttendeeID);
        var flagValues = flags.split("|");
        var listingType = flagValues[0];
        var listingParameter = flagValues[1];
        var listingValue = flagValues[2];
        var AttendeeProfileTitle = flagValues[3];
        var AttendeeProfileOrganization = flagValues[4];
        if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
            if (listingType == "pw") { // Password change
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        resolve(response.json());
                    }, err => {
                        if (err.status == "412") {
                            console.log("App and API versions don't match.");
                            var emptyJSONArray = {};
                            resolve(emptyJSONArray);
                        }
                        else {
                            console.log(err.status);
                            console.log("API Error: ", err);
                        }
                    });
                });
            }
            if (listingType == "st") { // List of record counts
                var SQLquery = "";
                SQLquery = SQLquery + "SELECT COUNT(session_id) AS Records, 'Courses' AS DatabaseTable ";
                SQLquery = SQLquery + "FROM courses ";
                SQLquery = SQLquery + "UNION ";
                SQLquery = SQLquery + "SELECT COUNT(speakerID) AS Records, 'Speakers' AS DatabaseTable ";
                SQLquery = SQLquery + "FROM courses_speakers ";
                SQLquery = SQLquery + "UNION ";
                SQLquery = SQLquery + "SELECT COUNT(ExhibitorID) AS Records, 'Exhibitors' AS DatabaseTable ";
                SQLquery = SQLquery + "FROM exhibitors ";
                SQLquery = SQLquery + "UNION ";
                if (AttendeeID == '' || AttendeeID === null) {
                    SQLquery = SQLquery + "SELECT 'N/A' AS Records, 'CEs' AS DatabaseTable ";
                    SQLquery = SQLquery + "UNION ";
                    SQLquery = SQLquery + "SELECT 'N/A' AS Records, 'Notes' AS DatabaseTable ";
                    SQLquery = SQLquery + "UNION ";
                    SQLquery = SQLquery + "SELECT 'N/A' AS Records, 'Agenda' AS DatabaseTable ";
                }
                else {
                    SQLquery = SQLquery + "SELECT COUNT(session_id) AS Records, 'CEs' AS DatabaseTable ";
                    SQLquery = SQLquery + "FROM attendee_ces ";
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "' ";
                    SQLquery = SQLquery + "UNION ";
                    SQLquery = SQLquery + "SELECT COUNT(EventID) AS Records, 'Notes' AS DatabaseTable ";
                    SQLquery = SQLquery + "FROM attendee_notes ";
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "' ";
                    SQLquery = SQLquery + "UNION ";
                    SQLquery = SQLquery + "SELECT COUNT(itID) AS Records, 'Agenda' AS DatabaseTable ";
                    SQLquery = SQLquery + "FROM itinerary ";
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'  AND UpdateType != 'Delete' ";
                }
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                        console.log('Database: Opened DB for Stats query');
                        this.db = null;
                        this.db = db;
                        console.log('Database: Set Stats query db variable');
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            //console.log('Database: Stats query: ' + JSON.stringify(data));
                            console.log('Database: Stats query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if (data.rows.length > 0) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        Records: data.rows.item(i).Records,
                                        DatabaseTable: data.rows.item(i).DatabaseTable
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        })
                            .catch(e => console.log('Database: Stats query error: ' + JSON.stringify(e)));
                    });
                    console.log('Database: Stats query complete');
                });
            }
            if (listingType == "lb") { // Leaderboard stats
                // Perform query against server-based MySQL database
                var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                console.log(url);
                return new Promise(resolve => {
                    this.httpCall.get(url).subscribe(response => {
                        resolve(response.json());
                    }, err => {
                        if (err.status == "412") {
                            console.log("App and API versions don't match.");
                            var emptyJSONArray = {};
                            resolve(emptyJSONArray);
                        }
                        else {
                            console.log(err.status);
                            console.log("API Error: ", err);
                        }
                    });
                });
                /*
                var SQLquery = "";
                SQLquery = "SELECT a.ct_id, a.last_name, a.first_name, ";
                SQLquery = SQLquery + "(SELECT COUNT(af.afID) AS Postings ";
                SQLquery = SQLquery + "FROM activities_feed af ";
                SQLquery = SQLquery + "WHERE af.AttendeeID = a.ct_id) + ";
                SQLquery = SQLquery + "(SELECT COUNT(afc.afID) AS Comments ";
                SQLquery = SQLquery + "FROM activities_feed_comments afc ";
                SQLquery = SQLquery + "WHERE afc.AttendeeID = a.ct_id) AS PostingsComments ";
                SQLquery = SQLquery + "FROM attendees a ";
                SQLquery = SQLquery + "WHERE a.ActiveYN = 'Y' AND (SELECT COUNT(af.afID) AS Postings ";
                SQLquery = SQLquery + "FROM activities_feed af ";
                SQLquery = SQLquery + "WHERE af.AttendeeID = a.ct_id) + ";
                SQLquery = SQLquery + "(SELECT COUNT(afc.afID) AS Comments ";
                SQLquery = SQLquery + "FROM activities_feed_comments afc ";
                SQLquery = SQLquery + "WHERE afc.AttendeeID = a.ct_id) > 0 ";
                SQLquery = SQLquery + "ORDER BY (SELECT COUNT(af.afID) AS Postings ";
                SQLquery = SQLquery + "FROM activities_feed af ";
                SQLquery = SQLquery + "WHERE af.AttendeeID = a.ct_id) + ";
                SQLquery = SQLquery + "(SELECT COUNT(afc.afID) AS Comments ";
                SQLquery = SQLquery + "FROM activities_feed_comments afc ";
                SQLquery = SQLquery + "WHERE afc.AttendeeID = a.ct_id) DESC ";
                SQLquery = SQLquery + "LIMIT 10 ";

                // Perform query against local SQLite database
                return new Promise(resolve => {
                    
                    this.sqlite.create({name: 'cvPlanner.db', location: 'default', createFromLocation: 1}).then((db: SQLiteObject) => {

                        console.log('Database: Opened DB for Leaderboard query');
                        
                        this.db = db;
                        
                        console.log('Database: Set Leaderboard query db variable');
                        
                        this.db.executeSql(SQLquery, <any>{}).then((data) => {
                            //console.log('Database: Leaderboard query: ' + JSON.stringify(data));
                            console.log('Database: Leaderboard query rows: ' + data.rows.length);
                            let DatabaseResponse = [];
                            if(data.rows.length > 0) {
                                for(let i = 0; i < data.rows.length; i++) {
                                    DatabaseResponse.push({
                                        AttendeeID: data.rows.item(i).ct_id,
                                        LastName: data.rows.item(i).last_name,
                                        FirstName: data.rows.item(i).first_name,
                                        PostingsComments: data.rows.item(i).PostingsComments
                                    });
                                }
                            }
                            resolve(DatabaseResponse);
                        })
                        .catch(e => console.log('Database: Leaderboard query error: ' + JSON.stringify(e)))
                    });
                    console.log('Database: Leaderboard query complete');

                });
                */
            }
            if (listingType == "pr") { // Attendee Profile
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    console.log(url);
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                var emptyJSONArray = {};
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    //SQLquery = "SELECT * FROM attendees ";
                    //SQLquery = SQLquery + "WHERE ct_id = '" + AttendeeID + "'";
                    SQLquery = "SELECT a.*, ";
                    SQLquery = SQLquery + "COALESCE(ab.abID,0) AS Bookmarked ";
                    SQLquery = SQLquery + "FROM attendees a ";
                    SQLquery = SQLquery + "LEFT OUTER JOIN attendee_bookmarks ab ";
                    SQLquery = SQLquery + "   ON ab.AttendeeID = '" + listingParameter + "' ";
                    SQLquery = SQLquery + "   AND ab.BookmarkID = a.AttendeeID ";
                    SQLquery = SQLquery + "   AND ab.BookmarkType = 'Attendees' ";
                    SQLquery = SQLquery + "   AND ab.UpdateType != 'Delete' ";
                    SQLquery = SQLquery + "WHERE a.AttendeeID = '" + AttendeeID + "' ";
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Profile query');
                            this.db = db;
                            console.log('Database: Set Profile query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                //console.log('Database: Profile query: ' + JSON.stringify(data));
                                console.log('Database: Profile query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rows.length > 0) {
                                    for (let i = 0; i < data.rows.length; i++) {
                                        DatabaseResponse.push({
                                            AttendeeID: data.rows.item(i).AttendeeID,
                                            LastName: data.rows.item(i).LastName,
                                            FirstName: data.rows.item(i).FirstName,
                                            Title: data.rows.item(i).Title,
                                            Company: data.rows.item(i).Company,
                                            smTwitter: data.rows.item(i).smTwitter,
                                            showTwitter: data.rows.item(i).showTwitter,
                                            smFacebook: data.rows.item(i).smFacebook,
                                            showFacebook: data.rows.item(i).showFacebook,
                                            smLinkedIn: data.rows.item(i).smLinkedIn,
                                            showLinkedIn: data.rows.item(i).showLinkedIn,
                                            smInstagram: data.rows.item(i).smInstagram,
                                            showInstagram: data.rows.item(i).showInstagram,
                                            smPinterest: data.rows.item(i).smPinterest,
                                            showPinterest: data.rows.item(i).showPinterest,
                                            Bookmarked: data.rows.item(i).Bookmarked
                                        });
                                    }
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Profile query complete');
                    });
                }
            }
            if (listingType == "pg") { // Get Attendee Social Media URL
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    console.log(url);
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                var emptyJSONArray = {};
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    SQLquery = "SELECT * FROM attendees ";
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Profile query');
                            this.db = db;
                            console.log('Database: Set Profile query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                //console.log('Database: Profile query: ' + JSON.stringify(data));
                                console.log('Database: Profile query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rows.length > 0) {
                                    var smURL = "";
                                    switch (listingParameter) {
                                        case "statusTwitter":
                                            smURL = data.rows.item(0).smTwitter;
                                            break;
                                        case "statusFacebook":
                                            smURL = data.rows.item(0).smFacebook;
                                            break;
                                        case "statusLinkedIn":
                                            smURL = data.rows.item(0).smLinkedIn;
                                            break;
                                        case "statusInstagram":
                                            smURL = data.rows.item(0).smInstagram;
                                            break;
                                        case "statusPinterest":
                                            smURL = data.rows.item(0).smPinterest;
                                            break;
                                    }
                                    DatabaseResponse.push({
                                        smURL: smURL,
                                    });
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Profile query complete');
                    });
                }
            }
            if (listingType == "pu") { // Update Attendee Social Media URL
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    console.log(url);
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                var emptyJSONArray = {};
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    SQLquery = "UPDATE attendees ";
                    switch (listingParameter) {
                        case "statusTwitter":
                            SQLquery = SQLquery + "SET smTwitter = '" + listingValue + "', ";
                            SQLquery = SQLquery + "showTwitter = 'Y' ";
                            break;
                        case "statusFacebook":
                            SQLquery = SQLquery + "SET smFacebook = '" + listingValue + "', ";
                            SQLquery = SQLquery + "showFacebook = 'Y' ";
                            break;
                        case "statusLinkedIn":
                            SQLquery = SQLquery + "SET smLinkedIn = '" + listingValue + "', ";
                            SQLquery = SQLquery + "showLinkedIn = 'Y' ";
                            break;
                        case "statusInstagram":
                            SQLquery = SQLquery + "SET smInstagram = '" + listingValue + "', ";
                            SQLquery = SQLquery + "showInstagram = 'Y' ";
                            break;
                        case "statusPinterest":
                            SQLquery = SQLquery + "SET smPinterest = '" + listingValue + "', ";
                            SQLquery = SQLquery + "showPinterest = 'Y' ";
                            break;
                    }
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Profile query');
                            this.db = db;
                            console.log('Database: Set Profile query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                //console.log('Database: Profile query: ' + JSON.stringify(data));
                                console.log('Database: Profile query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rowsAffected > 0) {
                                    DatabaseResponse.push({
                                        Status: "Success",
                                        Query: ""
                                    });
                                }
                                else {
                                    DatabaseResponse.push({
                                        Status: "Fail",
                                        Query: ""
                                    });
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Profile query complete');
                    });
                }
            }
            if (listingType == "pd") { // Remove Attendee Social Media URL
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    console.log(url);
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                var emptyJSONArray = {};
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    SQLquery = "UPDATE attendees ";
                    switch (listingParameter) {
                        case "statusTwitter":
                            SQLquery = SQLquery + "SET smTwitter = '', ";
                            SQLquery = SQLquery + "showTwitter = 'N' ";
                            break;
                        case "statusFacebook":
                            SQLquery = SQLquery + "SET smFacebook = '', ";
                            SQLquery = SQLquery + "showFacebook = 'N' ";
                            break;
                        case "statusLinkedIn":
                            SQLquery = SQLquery + "SET smLinkedIn = '', ";
                            SQLquery = SQLquery + "showLinkedIn = 'N' ";
                            break;
                        case "statusInstagram":
                            SQLquery = SQLquery + "SET smInstagram = '', ";
                            SQLquery = SQLquery + "showInstagram = 'N' ";
                            break;
                        case "statusPinterest":
                            SQLquery = SQLquery + "SET smPinterest = '', ";
                            SQLquery = SQLquery + "showPinterest = 'N' ";
                            break;
                    }
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Profile query');
                            this.db = db;
                            console.log('Database: Set Profile query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                //console.log('Database: Profile query: ' + JSON.stringify(data));
                                console.log('Database: Profile query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rowsAffected > 0) {
                                    DatabaseResponse.push({
                                        Status: "Success",
                                        Query: ""
                                    });
                                }
                                else {
                                    DatabaseResponse.push({
                                        Status: "Fail",
                                        Query: ""
                                    });
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Profile query complete');
                    });
                }
            }
            if (listingType == "ps") { // Save Profile updates
                console.log('Attendee Listing: ' + AttendeeListing);
                if (AttendeeListing == 'Online') {
                    // Perform query against server-based MySQL database
                    var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                    console.log(url);
                    return new Promise(resolve => {
                        this.httpCall.get(url).subscribe(response => {
                            resolve(response.json());
                        }, err => {
                            if (err.status == "412") {
                                console.log("App and API versions don't match.");
                                var emptyJSONArray = {};
                                resolve(emptyJSONArray);
                            }
                            else {
                                console.log(err.status);
                                console.log("API Error: ", err);
                            }
                        });
                    });
                }
                else {
                    var SQLquery = "";
                    SQLquery = "UPDATE attendees ";
                    SQLquery = SQLquery + "SET Title = '" + AttendeeProfileTitle + "', ";
                    SQLquery = SQLquery + "Company = '" + AttendeeProfileOrganization + "' ";
                    SQLquery = SQLquery + "WHERE AttendeeID = '" + AttendeeID + "'";
                    // Perform query against local SQLite database
                    return new Promise(resolve => {
                        this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                            console.log('Database: Opened DB for Profile query');
                            this.db = db;
                            console.log('Database: Set Profile query db variable');
                            this.db.executeSql(SQLquery, {}).then((data) => {
                                //console.log('Database: Profile query: ' + JSON.stringify(data));
                                console.log('Database: Profile query rows: ' + data.rows.length);
                                let DatabaseResponse = [];
                                if (data.rowsAffected > 0) {
                                    DatabaseResponse.push({
                                        Status: "Success",
                                        Query: ""
                                    });
                                }
                                else {
                                    DatabaseResponse.push({
                                        Status: "Fail",
                                        Query: ""
                                    });
                                }
                                resolve(DatabaseResponse);
                            })
                                .catch(e => console.log('Database: Profile query error: ' + JSON.stringify(e)));
                        });
                        console.log('Database: Profile query complete');
                    });
                }
            }
            if (listingType == "cn") { // Check Network
                console.log('DB: Connection Check');
                var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
                var emptyJSONArray = {};
                return new Promise(resolve => {
                    this.httpCall.get(url).timeout(3000).subscribe(response => {
                        console.log('DB: Connection check response: ' + JSON.stringify(response.json()));
                        resolve(response.json());
                    }, err => {
                        console.log('DB: Connection check error: ' + err);
                        if (err.status == "412") {
                            console.log("App and API versions don't match.");
                            resolve(emptyJSONArray);
                        }
                        else {
                            console.log("DB: Connection Check Error: ", err);
                            var errorArray = [];
                            errorArray.push({
                                Status: 'Timeout has occurred'
                            });
                            resolve(errorArray);
                        }
                    });
                });
            }
            if (listingType == "rw") { // Session Star Reviews
                SQLquery = "SELECT * FROM attendee_session_ratings ";
                SQLquery = SQLquery + "WHERE session_id = '" + listingParameter + "' ";
                SQLquery = SQLquery + "AND AttendeeID = '" + AttendeeID + "'";
                // Perform query against local SQLite database
                return new Promise(resolve => {
                    this.sqlite.create({ name: 'cvPlanner.db', location: 'default', createFromLocation: 1 }).then((db) => {
                        console.log('Database: Opened DB for Create Bookmark query');
                        this.db = db;
                        console.log('Database: Set Create Bookmark query db variable');
                        this.db.executeSql(SQLquery, {}).then((data) => {
                            console.log('Database: Session Star Reviews query: ' + JSON.stringify(data));
                            console.log('Database: Session Star Reviews query rows: ' + data.rows.length);
                            var SQLquery2 = "";
                            let DatabaseResponse = [];
                            console.log('Database: listingParameter: ' + listingParameter);
                            console.log('Database: listingValue: ' + listingValue);
                            if (data.rows.length > 0) {
                                SQLquery2 = "UPDATE attendee_session_ratings ";
                                SQLquery2 = SQLquery2 + "SET asrRating = '" + listingValue + "' ";
                                SQLquery2 = SQLquery2 + "WHERE AttendeeID = '" + AttendeeID + "' ";
                                SQLquery2 = SQLquery2 + "AND session_id = '" + listingParameter + "' ";
                                console.log('Database: Session Star Reviews query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    console.log('Database: Session Star Reviews query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Session Star Reviews query2 error: ' + JSON.stringify(e)));
                            }
                            else {
                                var CurrentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                SQLquery2 = "INSERT INTO attendee_session_ratings(AttendeeID, session_id, asrRating, DateAdded, UpdateType) ";
                                SQLquery2 = SQLquery2 + "VALUES('" + AttendeeID + "','" + listingParameter + "','" + listingValue + "','" + CurrentDateTime + "','Insert')";
                                console.log('Database: Session Star Reviews query2: ' + SQLquery2);
                                this.db.executeSql(SQLquery2, {}).then((data2) => {
                                    console.log('Database: Session Star Reviews query2: ' + JSON.stringify(data2));
                                    if (data2.rowsAffected > 0) {
                                        DatabaseResponse.push({
                                            Status: "Saved",
                                            Query: ""
                                        });
                                    }
                                    else {
                                        DatabaseResponse.push({
                                            Status: "Failed",
                                            Query: ""
                                        });
                                    }
                                    resolve(DatabaseResponse);
                                })
                                    .catch(e => console.log('Database: Session Star Reviews query2 error: ' + JSON.stringify(e)));
                            }
                        })
                            .catch(e => console.log('Database: Session Star Reviews query error: ' + JSON.stringify(e)));
                    });
                    console.log('Database: Session Star Reviews query complete');
                });
            }
        }
        else {
            // Perform query against server-based MySQL database
            var url = APIURLReference + "action=statsquery&flags=" + flags + "&AttendeeID=" + AttendeeID;
            return new Promise(resolve => {
                this.httpCall.get(url).subscribe(response => {
                    resolve(response.json());
                }, err => {
                    if (err.status == "412") {
                        console.log("App and API versions don't match.");
                        var emptyJSONArray = {};
                        resolve(emptyJSONArray);
                    }
                    else {
                        console.log(err.status);
                        console.log("API Error: ", err);
                    }
                });
            });
        }
    }
};
Database = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["x" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__["a" /* SQLite */]])
], Database);

//# sourceMappingURL=database.js.map

/***/ }),

/***/ 210:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 210;

/***/ }),

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/activityfeedcomment/activityfeedcomment.module": [
		946,
		17
	],
	"../pages/activityfeeddetails/activityfeeddetails.module": [
		959,
		16
	],
	"../pages/activityfeedleaderboard/activityfeedleaderboard.module": [
		947,
		0
	],
	"../pages/activityfeedposting/activityfeedposting.module": [
		961,
		15
	],
	"../pages/attendeesprofile/attendeesprofile.module": [
		960,
		14
	],
	"../pages/cetracking/cetracking.module": [
		948,
		13
	],
	"../pages/conversations/conversations.module": [
		949,
		12
	],
	"../pages/evaluationlecture/evaluationlecture.module": [
		950,
		11
	],
	"../pages/evaluationworkshop/evaluationworkshop.module": [
		962,
		10
	],
	"../pages/exhibitordetails/exhibitordetails.module": [
		963,
		9
	],
	"../pages/listinglevel1/listinglevel1.module": [
		966,
		8
	],
	"../pages/myagendapersonal/myagendapersonal.module": [
		964,
		7
	],
	"../pages/notesdetails/notesdetails.module": [
		951,
		21
	],
	"../pages/notifications/notifications.module": [
		952,
		20
	],
	"../pages/profile/profile.module": [
		965,
		19
	],
	"../pages/profileimage/profileimage.module": [
		953,
		6
	],
	"../pages/profilepasswordchange/profilepasswordchange.module": [
		954,
		5
	],
	"../pages/profilesocialmediaentry/profilesocialmediaentry.module": [
		955,
		4
	],
	"../pages/searchbytopic/searchbytopic.module": [
		956,
		3
	],
	"../pages/searchresults/searchresults.module": [
		967,
		2
	],
	"../pages/slider/slider.module": [
		957,
		18
	],
	"../pages/speakerdetails/speakerdetails.module": [
		958,
		1
	],
	"main.module": [
		945,
		22
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 253;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(84);
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




class ChatMessage {
}
/* unused harmony export ChatMessage */

class UserInfo {
}
/* unused harmony export UserInfo */

//export const userAvatar = 'https://naeyc.convergence-us.com/AdminGateway/images/Attendees/900000.jpg';
//export const toUserAvatar = 'https://naeyc.convergence-us.com/AdminGateway/images/Attendees/900001.jpg';
const userAvatar = '';
/* unused harmony export userAvatar */

const toUserAvatar = '';
/* unused harmony export toUserAvatar */

// Global URL and conference year reference used for all AJAX-to-MySQL calls
var APIURLReference = "https://aacdmobile.convergence-us.com/cvPlanner.php?acy=2019&";
let ChatService = class ChatService {
    //public userAvatar: string;
    //public toUserAvatar: string;
    constructor(http, events) {
        this.http = http;
        this.events = events;
    }
    mockNewMsg(msg) {
        const mockMsg = {
            messageId: Date.now().toString(),
            userId: '900001',
            userName: 'Peter Vroom',
            userAvatar: toUserAvatar,
            toUserId: '900000',
            time: Date.now(),
            message: msg.message,
            status: 'success'
        };
        setTimeout(() => {
            this.events.publish('chat:received', mockMsg, Date.now());
        }, Math.random() * 300);
    }
    getNewMessages(AttendeeID, cAttendeeID) {
        var temp = this;
        var newMsgsUrl = APIURLReference + "action=msgquery&flags=rc|0|" + cAttendeeID + "&AttendeeID=" + AttendeeID;
        this.http.get(newMsgsUrl).subscribe(result => {
            if (Object.keys(result).length > 0) {
                console.log('Receive Msg Check: ' + JSON.stringify(result));
                const newMsg = {
                    messageId: result[0].messageId,
                    userId: result[0].userId,
                    userName: result[0].userName,
                    userAvatar: result[0].UserAvatar,
                    toUserId: result[0].toUserId,
                    time: result[0].time,
                    message: result[0].message,
                    status: 'success'
                };
                this.events.publish('chat:received', newMsg, Date.now());
                console.log(JSON.stringify(newMsg));
            }
        }, err => {
            console.log("API Error: ", err);
        });
    }
    getMsgList(AttendeeID, cAttendeeID) {
        var msgListUrl = APIURLReference + "action=msgquery&flags=in|0|" + cAttendeeID + "&AttendeeID=" + AttendeeID;
        return this.http.get(msgListUrl)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators_map__["map"])(response => response.map(msg => (Object.assign({}, msg)))));
        //return this.http.get<any>(msgListUrl)
        //.pipe(map(response => response.map(msg => ({
        //  ...msg,
        //  userAvatar: msg.userAvatar === 'assets/img/personIcon.png' ? userAvatar : toUserAvatar
        //}))));
        //return this.http.get<any>(msgListUrl).then(
        //	response => msg
        //);
    }
    sendMsg(msg, AttendeeID) {
        var url = APIURLReference + "action=msgquery&flags=sd|0|0|" + JSON.stringify(msg) + "&AttendeeID=" + AttendeeID;
        console.log('Message send: ' + url);
        return new Promise(resolve => {
            this.http.get(url).subscribe(response => {
                console.log('Message send result: ' + JSON.stringify(response));
                resolve(msg);
            }, err => {
                if (err.status == "412") {
                    console.log("App and API versions don't match.");
                    var emptyJSONArray = {};
                    resolve(emptyJSONArray);
                }
                else {
                    console.log(err.status);
                    console.log("API Error: ", err);
                }
            });
        });
    }
};
ChatService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */]])
], ChatService);

//# sourceMappingURL=chat-service.js.map

/***/ }),

/***/ 488:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MorePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__database_database__ = __webpack_require__(489);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__help_help__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__notes_notes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__login_login__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__myagendafull_myagendafull__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__myagenda_myagenda__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__evaluationconference_evaluationconference__ = __webpack_require__(110);
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




// Pages







let MorePage = class MorePage {
    constructor(navCtrl, storage, navParams, cd, localstorage) {
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.navParams = navParams;
        this.cd = cd;
        this.localstorage = localstorage;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MorePage');
    }
    ngOnInit() {
        // Load diagnostic values
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var DevPlatform = this.localstorage.getLocalValue('DevicePlatform');
        var LastSync = this.localstorage.getLocalValue('LastSync');
        var PlayerID = this.localstorage.getLocalValue("PlayerID");
        this.DeviceType = DevPlatform;
        this.RegistrationID = AttendeeID;
        this.LSync = LastSync;
        this.PushID = PlayerID;
        this.cd.markForCheck();
    }
    NavToPage(PageID) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        switch (PageID) {
            case "HelpPage":
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__help_help__["a" /* HelpPage */], {}, { animate: true, direction: 'forward' });
                break;
            case "DatabasePage":
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__database_database__["a" /* DatabasePage */], {}, { animate: true, direction: 'forward' });
                break;
            case "NotesPage":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "Notes");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' });
                }
                break;
            case "EventSurvey":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "EventSurvey");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' });
                }
                break;
            case "MyAgenda":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "MyAgenda");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' });
                }
                break;
            case "MyAgendaFull":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "MyAgendaFull");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' });
                }
                break;
            case "EvalTest1Page":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "EvaluationTest1");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.localstorage.setLocalValue('EventID', 'S-54118');
                    this.navCtrl.push('EvaluationTest1', {}, { animate: true, direction: 'forward' });
                }
                break;
            case "EvalTest2Page":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "EvaluationTest2");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.localstorage.setLocalValue('EventID', 'S-54118');
                    this.navCtrl.push('EvaluationTest2', {}, { animate: true, direction: 'forward' });
                }
                break;
            case "EvalTest3Page":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "EvaluationTest3");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.localstorage.setLocalValue('EventID', 'S-54118');
                    this.navCtrl.push('EvaluationTest3', {}, { animate: true, direction: 'forward' });
                }
                break;
            case "EvalTest4Page":
                if (AttendeeID == '' || AttendeeID == null) {
                    // If not, store the page they want to go to and go to the Login page
                    console.log('Stored AttendeeID: ' + AttendeeID);
                    this.storage.set('NavigateToPage', "EvaluationTest4");
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                }
                else {
                    // Otherwise just go to the page they want
                    this.localstorage.setLocalValue('EventID', 'S-54118');
                    this.navCtrl.push('EvaluationTest4', {}, { animate: true, direction: 'forward' });
                }
                break;
        }
    }
    ;
};
MorePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-more',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/more/more.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>More</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n	<ion-list>\n	\n		<button ion-item (click)="NavToPage(\'NotesPage\')">Notes\n			<ion-icon color="secondary" item-start name="create"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'EventSurvey\')">Event Survey\n			<ion-icon color="secondary" item-start name="checkbox"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'MyAgenda\')">MyAgenda\n			<ion-icon color="secondary" item-start name="list-box"></ion-icon>\n		</button>\n\n		<img src="assets/img/gbasBig.jpeg" onclick="window.open(\'https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Faacd.ejoinme.org%2FMyEvents%2FGiveBackaSmileSilentAuction2018%2Ftabid%2F886099%2FDefault.aspx&data=02%7C01%7Clisab%40aacd.com%7C3affa1cb6109443e9e2808d5a16dd04d%7C867291cda2d943f284571ed60b355ed5%7C0%7C0%7C636592415380677523&sdata=gvaFvM0Ce2X9QYhrsE1PcRiiQroR1MLaMRzdpVpNi9A%3D&reserved=0\', \'_system\', \'location=yes\'); return false;">\n\n		<button ion-item (click)="NavToPage(\'MyAgendaFull\')">Agenda All\n			<ion-icon color="secondary" item-start name="list-box"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'HelpPage\')">Help\n			<ion-icon color="secondary" item-start name="list-box"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'DatabasePage\')">Database Stats\n			<ion-icon color="secondary" item-start name="stats"></ion-icon>\n		</button>\n\n		<!--\n		<button ion-item (click)="NavToPage(\'EvalTest1Page\')">Evaluation Test 1\n			<ion-icon item-start name="checkbox"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'EvalTest2Page\')">Evaluation Test 2\n			<ion-icon item-start name="checkbox"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'EvalTest3Page\')">Evaluation Test 3\n			<ion-icon item-start name="checkbox"></ion-icon>\n		</button>\n\n		<button ion-item (click)="NavToPage(\'EvalTest4Page\')">Evaluation Test 4\n			<ion-icon item-start name="checkbox"></ion-icon>\n		</button>\n		-->\n		\n	</ion-list>\n\n</ion-content>\n\n<ion-footer no-border style="background:#eee">\n	<ion-grid style="padding:20px; margin:0">\n		<ion-row>\n			<ion-col style="padding:0">\n				<p>Deploy Version: 1.07</p>\n				<p style="margin-top: -13px;">Device Type: {{DeviceType}}</p>\n			</ion-col>\n			<ion-col style="padding:0">\n				<p>Registration ID: {{RegistrationID}}</p>\n				<p style="margin-top: -13px;">Last Sync: {{LSync}}</p>\n			</ion-col>\n			<ion-col style="padding:0">\n				<p>Push ID: {{PushID}}</p>\n				<p style="margin-top: -13px;">&nbsp;</p>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n</ion-footer>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/more/more.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__["a" /* Localstorage */]])
], MorePage);

//# sourceMappingURL=more.js.map

/***/ }),

/***/ 489:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatabasePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_synchronization_synchronization__ = __webpack_require__(100);
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






let DatabasePage = class DatabasePage {
    constructor(navCtrl, navParams, databaseprovider, localstorage, syncprovider, cd, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.databaseprovider = databaseprovider;
        this.localstorage = localstorage;
        this.syncprovider = syncprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.DatabaseStatsListing = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad Database');
    }
    ngOnInit() {
        let loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Please wait...'
        });
        loading.present();
        // Blank and show loading info
        this.DatabaseStatsListing = [];
        this.cd.markForCheck();
        var flags = "st";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        this.LastAutoSync = this.localstorage.getLocalValue('LastSync');
        if (AttendeeID == '' || AttendeeID == null) {
            AttendeeID = '0';
        }
        this.databaseprovider.getDatabaseStats(flags, AttendeeID).then(data => {
            console.log("getDatabaseStats: " + JSON.stringify(data));
            if (data['length'] > 0) {
                for (var i = 0; i < data['length']; i++) {
                    this.DatabaseStatsListing.push({
                        DatabaseTable: data[i].DatabaseTable,
                        DatabaseRecords: data[i].Records
                    });
                }
            }
            this.cd.markForCheck();
            loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
    ResetAutoSync() {
        this.localstorage.setLocalValue('LastSync', '2018-01-01 00:00:01');
        this.LastAutoSync = '2018-01-01 00:00:01';
    }
    ManualSync() {
        // Previously successful sync time
        var LastSync = this.localstorage.getLocalValue('LastSync');
        if (LastSync == '' || LastSync === null) {
            LastSync = '2018-01-01 00:00:01';
        }
        // Current sync time
        var ThisSync = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log('DatabasePage: ManualSync event');
        // Call AutoSync service in providers
        this.syncprovider.DBSyncUpdateM2S(LastSync, ThisSync).then(data => {
            console.log('DatabasePage: Executed UpdateM2S Sync: ' + data);
            // Update LastSync date for next run
            this.localstorage.setLocalValue('LastSync', ThisSync);
            this.LastAutoSync = ThisSync;
        }).catch(function () {
            console.log("DatabasePage: UpdateM2S Sync Promise Rejected");
        });
        this.syncprovider.DBSyncUpdateS2M(LastSync, ThisSync).then(data => {
            console.log('DatabasePage: Executed UpdateS2M Sync: ' + data);
            // Update LastSync date for next run
            this.localstorage.setLocalValue('LastSync', ThisSync);
            this.LastAutoSync = ThisSync;
        }).catch(function () {
            console.log("DatabasePage: UpdateS2M Sync Promise Rejected");
        });
    }
};
DatabasePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-database',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/database/database.html"*/'<ion-header>\n    <ion-navbar color="primary">\n      <button ion-button menuToggle>\n        <ion-icon name="menu"></ion-icon>\n			</button>\n			<ion-title>\n					Database Stats\n				</ion-title>\n			</ion-navbar>\n			</ion-header>\n\n\n<ion-content padding>\n\n	<div>\n		If you see N/A for any entry, then you need to be logged in to see that value.<br/>\n		Application version 4.0.0.0015\n	</div>\n\n	<ion-list id="databasestat-list3">\n		<ion-item class="item-icon-left item-icon-right" *ngFor="let databasestat of DatabaseStatsListing" id="databasestat-list-item19">\n			<div>\n				<div class="row">\n					<div class="col">\n						<div style="float: left; padding-right: 10px;">\n							<ion-icon name="document"></ion-icon>\n						</div>\n						<div class="col">\n							<p class="myLabelBold">\n								{{databasestat.DatabaseTable}}\n							</p>\n						</div>\n						<div style="float: right">\n							{{databasestat.DatabaseRecords}}\n						</div>\n					</div>\n				</div>\n			</div>\n		</ion-item>\n	</ion-list>\n\n	<div style="text-align:center">\n		<ion-row>\n			<ion-col>\n				<button ion-button outline [color]="btnEmail" (tap)="ResetAutoSync()">\n					<div>\n						<ion-icon name="refresh"></ion-icon>\n						<label>Reset AutoSync</label>\n					</div>\n				</button>\n			</ion-col>\n			<ion-col>\n				<button ion-button outline [color]="btnEmail" (tap)="ManualSync()">\n					<div>\n						<ion-icon name="refresh"></ion-icon>\n						<label>Manual Sync</label>\n					</div>\n				</button>\n			</ion-col>\n		</ion-row>\n\n		<ion-row>\n			<ion-col>\n				<ion-label><b>Last Sync: {{LastAutoSync}} UTC</b></ion-label>\n			</ion-col>\n			<ion-col>\n				<ion-label><b>&nbsp;</b></ion-label>\n			</ion-col>\n		</ion-row>\n	</div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/database/database.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_4__providers_localstorage_localstorage__["a" /* Localstorage */],
        __WEBPACK_IMPORTED_MODULE_5__providers_synchronization_synchronization__["a" /* Synchronization */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */]])
], DatabasePage);

//# sourceMappingURL=database.js.map

/***/ }),

/***/ 538:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConversationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_chat_service__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_keyboard__ = __webpack_require__(154);
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






let ConversationPage = class ConversationPage {
    constructor(navParams, nav, chatService, localstorage, cd, keyboard, events) {
        this.nav = nav;
        this.chatService = chatService;
        this.localstorage = localstorage;
        this.cd = cd;
        this.keyboard = keyboard;
        this.events = events;
        this.msgList = [];
        this.editorMsg = '';
        this.showEmojiPicker = true;
        //keyboard.disableScroll(true)
    }
    ngOnInit() {
        console.log('Conversation entered');
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var UserFullName = this.localstorage.getLocalValue('LoginFullName');
        var rAttendeeID = this.localstorage.getLocalValue('ConversationAttendeeID');
        var rAttendeeName = this.localstorage.getLocalValue('ConversationAttendeeName');
        this.AttendeeName = rAttendeeName;
        // Set up sender
        this.user = {
            id: AttendeeID,
            name: UserFullName,
            avatar: 'https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/' + AttendeeID + '.jpg'
        };
        // Set up receiver
        this.toUser = {
            id: rAttendeeID,
            name: rAttendeeName,
            avatar: 'https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/' + rAttendeeID + '.jpg'
        };
        var temp = this;
        this.setIntervalID = setInterval(function () {
            console.log('Calling getNewMessages(' + AttendeeID + ', ' + rAttendeeID + ')');
            temp.chatService.getNewMessages(AttendeeID, rAttendeeID);
        }, 4000);
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }
    ionViewWillLeave() {
        // unsubscribe
        this.events.unsubscribe('chat:received');
        clearInterval(this.setIntervalID);
    }
    ionViewDidEnter() {
        //get message list
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var rAttendeeID = this.localstorage.getLocalValue('ConversationAttendeeID');
        this.getMsg(AttendeeID, rAttendeeID);
        // Subscribe to receive new message events
        this.events.subscribe('chat:received', msg => {
            this.pushNewMsg(msg);
        });
    }
    onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    }
    /**
    * @name getMsg
    * @returns {Promise<ChatMessage[]>}
    */
    getMsg(sAttendeeID, rAttendeeID) {
        return this.chatService
            .getMsgList(sAttendeeID, rAttendeeID)
            .subscribe(res => {
            console.log('Initial message list: ' + JSON.stringify(res));
            this.msgList = res;
            this.content.resize();
            this.cd.markForCheck();
            this.scrollToBottom();
        });
    }
    /**
    * @name sendMsg
    */
    sendMsg() {
        if (!this.editorMsg.trim())
            return;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        // Mock message
        var DateNow = new Date().toISOString();
        console.log('Datestamp: ' + DateNow);
        const id = Date.now().toString();
        let newMsg = {
            messageId: DateNow,
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            toUserId: this.toUser.id,
            time: DateNow,
            message: this.editorMsg,
            status: 'pending'
        };
        this.pushNewMsg(newMsg);
        this.editorMsg = '';
        //if (!this.showEmojiPicker) {
        //	this.focus();
        //}
        this.chatService.sendMsg(newMsg, AttendeeID).then(() => {
            let index = this.getMsgIndexById(id);
            if (index !== -1) {
                this.msgList[index].status = 'success';
            }
        });
    }
    /**
    * @name pushNewMsg
    * @param msg
    */
    pushNewMsg(msg) {
        /*
        const userId = this.user.id,
        toUserId = this.toUser.id;

        // Verify user relationships
        if (msg.userId === userId && msg.toUserId === toUserId) {
            this.msgList.push(msg);
        } else if (msg.toUserId === userId && msg.userId === toUserId) {
            this.msgList.push(msg);
        }
        */
        this.msgList.push(msg);
        this.content.resize();
        this.cd.markForCheck();
        this.scrollToBottom();
    }
    getMsgIndexById(id) {
        return this.msgList.findIndex(e => e.messageId === id);
    }
    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom !== null) {
                if (this.content.scrollToBottom) {
                    this.content.scrollToBottom();
                }
            }
        }, 400);
    }
    focus() {
        if (this.messageInput && this.messageInput.nativeElement) {
            this.messageInput.nativeElement.focus();
        }
    }
    setTextareaScroll() {
        const textarea = this.messageInput.nativeElement;
        textarea.scrollTop = textarea.scrollHeight;
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Content */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Content */])
], ConversationPage.prototype, "content", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('chat_input'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
], ConversationPage.prototype, "messageInput", void 0);
ConversationPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-conversation',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/conversation/conversation.html"*/'<ion-header>\n	<ion-navbar color="primary" >\n		<ion-title>{{AttendeeName}}</ion-title>\n	</ion-navbar>\n\n\n</ion-header>\n\n<ion-content style="background:#800000">\n	<div class="message-wrap">\n\n		<div *ngFor="let msg of msgList"\n			class="message"\n			[class.left]=" msg.userId === toUser.id "\n			[class.right]=" msg.userId === user.id ">\n			\n			<!--<img-loader class="user-img" [src]="msg.userAvatar" useImg [spinner]=false></img-loader>-->\n			<img class="user-img" [src]="msg.userAvatar" alt="" onerror="this.src=\'assets/img/personIcon.png\'">\n			<!--<ion-spinner name="dots" *ngIf="msg.status === \'pending\'"></ion-spinner>-->\n			<div class="msg-detail">\n				<div class="msg-info">\n					<p>\n						{{msg.userName}}&nbsp;&nbsp;&nbsp;{{msg.time | relativeTime}}\n					</p>\n				</div>\n				<div class="msg-content">\n					<span class="triangle"></span>\n					<p class="line-breaker ">{{msg.message}}</p>\n				</div>\n			</div>\n		</div>\n\n	</div>\n\n\n\n\n</ion-content>\n\n<ion-footer>\n<ion-toolbar no-border [style.height]="showEmojiPicker ? \'255px\' : \'55px\'">\n	<div class="input-wrap">\n		<textarea #chat_input\n			placeholder="Text Input"\n			[(ngModel)]="editorMsg"\n			(keyup.enter)="sendMsg()"\n			(focusin)="onFocus()">\n		</textarea>\n		<button ion-button clear icon-only item-right (click)="sendMsg()">\n			<ion-icon name="ios-send" ios="ios-send" md="md-send"></ion-icon>\n		</button>\n	</div>\n</ion-toolbar>\n</ion-footer>\n\n<!--\n\n<ion-footer>\n<ion-toolbar no-border [style.height]="showEmojiPicker ? \'255px\' : \'55px\'">\n	<div class="input-wrap">\n		<ion-textarea #chat_input\n			placeholder="Text Input"\n			[(ngModel)]="editorMsg"\n			(keyup.enter)="sendMsg()"\n			(focusin)="onFocus()">\n		</ion-textarea>\n		<button ion-button clear icon-only item-right (tap)="sendMsg()">\n			<ion-icon name="ios-send" ios="ios-send" md="md-send"></ion-icon>\n		</button>\n	</div>\n	</ion-toolbar>\n</ion-footer>\n\n\n<ion-footer>\n	<ion-toolbar>\n	  <ion-grid class="input-wrap">\n		<ion-row>\n		  <ion-col col-10 padding-left>\n			<ion-textarea #chat_input\n						  placeholder="Text Input"\n						  [(ngModel)]="msgText"\n						  (keyup.enter)="sendMsg()">\n			</ion-textarea>\n		  </ion-col>\n		  <ion-col col-2>\n			<button ion-button clear icon-only item-right (click)="sendMsg()">\n			  <ion-icon name="ios-send" ios="ios-send" md="md-send"></ion-icon>\n			</button>\n		  </ion-col>\n		</ion-row>\n	  </ion-grid>\n	</ion-toolbar>\n	</ion-footer>\n	\n\n<ion-footer no-border [style.height]="showEmojiPicker ? \'255px\' : \'55px\'">\n<div class="input-wrap">\n<textarea style="background:#fff;color:#444" \n#chat_input\nplaceholder="Text Input"\n[(ngModel)]="editorMsg"\n(keyup.enter)="sendMsg()"\n(focusin)="onFocus()">\n</textarea>\n\n<button ion-button clear icon-only item-right (tap)="sendMsg()">\n<ion-icon name="ios-send" ios="ios-send" md="md-send"></ion-icon>\n</button>\n</div>\n</ion-footer>\n\n\n\n  -->'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/conversation/conversation.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2__services_chat_service__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_localstorage_localstorage__["a" /* Localstorage */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_keyboard__["a" /* Keyboard */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */]])
], ConversationPage);

//# sourceMappingURL=conversation.js.map

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_http__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_synchronization_synchronization__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__home_home__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__notes_notes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__ = __webpack_require__(110);
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









// Pages





let LoginPage = class LoginPage {
    constructor(navCtrl, navParams, http, http2, alertCtrl, storage, cd, syncprovider, localstorage, events, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.http2 = http2;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.cd = cd;
        this.syncprovider = syncprovider;
        this.localstorage = localstorage;
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.LoggedInUser = "";
        this.LoginSection = false;
        this.LogoutSection = false;
        this.msgRequireLogin = false;
        this.msgRequireLogin2 = false;
        this.displayMultipleLogins = false;
        this.displayMultipleLoginsDropdown = false;
        this.LoginButton = false;
        this.LoginSelectButton = false;
        this.login = [];
        this.teammembers = [];
        /* Determine currently logged in user */
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var LoginName = this.localstorage.getLocalValue('LoginFullName');
        if (AttendeeID == '' || AttendeeID == null) {
            console.log('LS AttendeeID blank');
            this.LoginSection = true;
            this.LogoutSection = false;
        }
        else {
            console.log('Stored AttendeeID: ' + AttendeeID);
            this.LoginSection = false;
            this.LogoutSection = true;
        }
        if (LoginName != '' && LoginName != null) {
            console.log('Stored LoginName: ' + LoginName);
            this.LoggedInUser = LoginName;
        }
        else {
            console.log('User not logged in');
            this.LoggedInUser = '';
        }
        var WarningStatus = this.localstorage.getLocalValue("LoginWarning");
        if (WarningStatus == "1") { // Screen requires account access
            this.msgRequireLogin = true;
            this.msgRequireLogin2 = false;
        }
        if (WarningStatus == "2") { // Agenda requires account access
            this.msgRequireLogin = false;
            this.msgRequireLogin2 = true;
        }
    }
    SetTeamMember(event) {
        console.log("SetTeamMember function: " + JSON.stringify(event));
    }
    // If page is in Sign In mode and user hits enter (from web version 
    // or mobile keyboard), initiate LoginUser function
    handleKeyboardEvent(event) {
        if (event.key == 'Enter' && this.LoginSection == true) {
            console.log('Enter key detected');
            this.LoginUser();
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }
    // Logout button clicked, clear stored values
    LogoutUser() {
        this.localstorage.setLocalValue('LoginName', '');
        this.localstorage.setLocalValue('LoginFullName', '');
        this.localstorage.setLocalValue("LoginNameInitials", '');
        this.localstorage.setLocalValue('AttendeeID', '');
        this.localstorage.setLocalValue("loginUsername", '');
        this.localstorage.setLocalValue("loginPassword", '');
        this.localstorage.setLocalValue('LastSync', '');
        //this.localstorage.setLocalValue("AgendaDays", '');
        //this.localstorage.setLocalValue("AgendaDates", '');
        //this.localstorage.setLocalValue("AgendaDayButtonLabels", '');
        this.LoginName = '';
        this.LoginPassword = '';
        this.LoggedInUser = "";
        let alert = this.alertCtrl.create({
            title: 'App Logout',
            subTitle: 'Logout successful',
            buttons: ['OK']
        });
        alert.present();
        this.LoginSection = true;
        this.LogoutSection = false;
        this.localstorage.setLocalValue('ForwardingPage', '');
        this.events.publish('user:Status', 'Logged Out');
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
    }
    // Login button clicked, process input
    LoginUser() {
        let loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Validating login...'
        });
        loading.present();
        console.log("Login button clicked.");
        console.log("User name: " + this.LoginName);
        console.log("User password: " + this.LoginPassword);
        if (this.LoginName == undefined || this.LoginPassword == undefined) {
            let alert = this.alertCtrl.create({
                title: 'App Login',
                subTitle: 'Both fields must be filled in before signing in.',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            // Reset stored values
            this.localstorage.setLocalValue('LoginName', '');
            this.localstorage.setLocalValue('LoginFullName', '');
            this.localstorage.setLocalValue("LoginNameInitials", '');
            this.localstorage.setLocalValue('AttendeeID', '');
            this.localstorage.setLocalValue("loginUsername", '');
            this.localstorage.setLocalValue("loginPassword", '');
            this.localstorage.setLocalValue('LastSync', '');
            //this.localstorage.setLocalValue("AgendaDays", '');
            //this.localstorage.setLocalValue("AgendaDates", '');
            //this.localstorage.setLocalValue("AgendaDayButtonLabels", '');
            var pushID = this.localstorage.getLocalValue('PlayerID');
            var deviceType = this.localstorage.getLocalValue('DevicePlatform');
            var encodedLoginName = encodeURI(this.LoginName);
            var encodedLoginPassword = encodeURI(this.LoginPassword);
            var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
            if (DevicePlatform == 'Android' || DevicePlatform == 'iOS') {
                console.log('Login: Check Clarity API');
                // AACD Login API			
                this.http.get('https://aacd.com/wsAPI.php', {
                    //params: {
                    // 2017 parameters
                    //'u': this.LoginName,
                    //'p': this.LoginPassword,
                    //'module': 'thunder',
                    //'method': 'validateMember',
                    //'username': 'wsAPIUser',
                    //'password': 'apple13',
                    //'output': 'json'
                    // Test parameter for Convergence API
                    //'action':   'authenticate'
                    // 2018-2019 parameters
                    'u': encodedLoginName,
                    'p': encodedLoginPassword,
                    'module': 'aacd.websiteforms',
                    'method': 'validateMember',
                    'username': 'wsapiconvergence',
                    'password': 'apple181',
                    'output': 'json'
                    //}
                }, { 'Content-Type': 'application/json' }).then(loginService => {
                    console.log("Login: API Response: " + JSON.stringify(loginService));
                    var loginService2 = JSON.parse(loginService.data);
                    var TMlength = Object.keys(loginService2.data.login.teammembers).length;
                    console.log("Login: Parsed results: " + JSON.stringify(loginService2));
                    console.log('Login: Parsed results, HTTP status: ' + loginService.status);
                    console.log('Login: Parsed results: API status: ' + loginService2.status);
                    console.log('Login: Parsed results: Authentication: ' + loginService2.data.login.authenticated);
                    console.log('Login: Parsed results, # of team members: ' + TMlength);
                    if (loginService2.status == 1) { // Response from Clarity authentication API received/processed
                        if (loginService2.data.login.authenticated == 1) { // Successful authentication
                            // Save credentials
                            this.localstorage.setLocalValue('LoginName', this.LoginName);
                            this.localstorage.setLocalValue('LoginFullName', '');
                            this.localstorage.setLocalValue('AttendeeID', '');
                            this.localstorage.setLocalValue("loginUsername", this.LoginName);
                            this.localstorage.setLocalValue("loginPassword", this.LoginPassword);
                            // Determine if single or multiple teammembers
                            console.log("Team Member count: " + TMlength);
                            if (TMlength == 0) {
                                // Doctor isn't registered but some team members are
                                let alert = this.alertCtrl.create({
                                    title: 'Login Error',
                                    subTitle: 'Your login was unsuccessful.  There is a problem with your registration.  Please visit the Registration counter.',
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                            if (TMlength == 1) { // Single team member
                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                                var hr = today.getHours();
                                var mn = today.getMinutes();
                                if (dd < 10) {
                                    var ds = '0' + dd;
                                }
                                if (mm < 10) {
                                    var ms = '0' + mm;
                                }
                                if (hr < 10) {
                                    var hs = '0' + hr;
                                }
                                if (mn < 10) {
                                    var ns = '0' + mn;
                                }
                                var todayS = yyyy + '-' + ms + '-' + ds + ' ' + hs + ':' + ns + ':00';
                                var Fullname = loginService2.data.login.teammembers[0].fullname;
                                var n = Fullname.indexOf(',');
                                Fullname = Fullname.substring(0, n != -1 ? n : Fullname.length);
                                var initials = Fullname.match(/\b\w/g) || [];
                                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                                this.localstorage.setLocalValue("LoginNameInitials", initials);
                                // Use the only one available
                                this.localstorage.setLocalValue("AttendeeID", loginService2.data.login.teammembers[0].ct_id);
                                this.localstorage.setLocalValue("AttendeeFullName", loginService2.data.login.teammembers[0].fullname);
                                this.localstorage.setLocalValue('LoginFullName', loginService2.data.login.teammembers[0].fullname);
                                this.localstorage.setLocalValue("LastLoggedInDate", todayS);
                                // -------------------------------------------
                                // Get conference dates after successful login
                                // -------------------------------------------
                                var URL2 = 'https://aacdmobile.convergence-us.com/cvPlanner.php';
                                URL2 = URL2 + '?action=conferencedates';
                                //URL2 = URL2 + '&em=' + this.LoginName;
                                //URL2 = URL2 + '&ps=' + this.LoginPassword;
                                URL2 = URL2 + '&atID=' + loginService2.data.login.teammembers[0].ct_id;
                                URL2 = URL2 + '&pushID=' + pushID;
                                URL2 = URL2 + '&deviceType=' + deviceType;
                                console.log('Login URL: ' + URL);
                                this.http.get(URL2, {}, {}).then(data2 => {
                                    var loginService3 = JSON.parse(data2.data);
                                    console.log("API Response: " + JSON.stringify(loginService3));
                                    console.log("Status: " + loginService3.status);
                                    console.log("Conference Dates: " + loginService3.ConferenceDates);
                                    console.log("Conference Date Labels: " + loginService3.ConferenceDateLabels);
                                    //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                                    var diffDays = loginService3.ConferenceDays;
                                    // Store values
                                    this.localstorage.setLocalValue("AgendaDays", diffDays);
                                    this.localstorage.setLocalValue("AgendaDates", loginService3.ConferenceDates);
                                    this.localstorage.setLocalValue("AgendaDayButtonLabels", loginService3.ConferenceDateLabels);
                                });
                                // Initiate manual sync to get latest information
                                this.ManualSync();
                                this.events.publish('user:Status', 'Logged In');
                                // Depending of saved value, return to Home or move forward to MyAgenda or CE Tracking
                                var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
                                switch (ForwardingPage) {
                                    case "MyAgenda":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "MyAgendaFull":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "EventSurvey":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "CETracking":
                                        this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "Notes":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    default:
                                        // Navigate back to Home page but eliminate Back button by setting it to Root
                                        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                                        break;
                                }
                            }
                            if (TMlength > 1) { // Multiple team members
                                console.log('Multiple members');
                                // Multiple so show list to pick from
                                this.displayMultipleLoginsDropdown = true;
                                this.teammembers = [];
                                for (var i = 0; i < TMlength; i++) {
                                    this.teammembers.push({
                                        ct_id: loginService2.data.login.teammembers[i].ct_id,
                                        DisplayName: loginService2.data.login.teammembers[i].fullname
                                    });
                                }
                                this.cd.markForCheck();
                                this.LoginButton = false;
                                this.LoginSelectButton = true;
                            }
                        }
                        else {
                            console.log('Login error 1');
                            console.log('Check development login API');
                            this.http.get('https://aacdmobile.convergence-us.com/cvplanner.php?action=authenticate&em=' + this.LoginName + '&ps=' + this.LoginPassword, {}, {}).then(data => {
                                var loginService4 = JSON.parse(data.data);
                                console.log("API Response: " + JSON.stringify(loginService4));
                                console.log("Status: " + loginService4.status);
                                console.log("Attendee ID: " + loginService4.AttendeeID);
                                console.log("Attendee Full Name: " + loginService4.AttendeeFullName);
                                console.log("Conference Dates: " + loginService4.ConferenceDates);
                                console.log("Conference Date Labels: " + loginService4.ConferenceDateLabels);
                                var initials = loginService4.AttendeeFullName.match(/\b\w/g) || [];
                                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                                this.localstorage.setLocalValue("LoginNameInitials", initials);
                                // Store values
                                this.localstorage.setLocalValue('LoginName', this.LoginName);
                                this.localstorage.setLocalValue('LoginFullName', loginService4.AttendeeFullName);
                                this.localstorage.setLocalValue('AttendeeID', loginService4.AttendeeID);
                                //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                                var diffDays = loginService4.ConferenceDays;
                                // Store values
                                this.localstorage.setLocalValue("AgendaDays", diffDays);
                                this.localstorage.setLocalValue("AgendaDates", loginService4.ConferenceDates);
                                this.localstorage.setLocalValue("AgendaDayButtonLabels", loginService4.ConferenceDateLabels);
                                // Show response
                                if (loginService4.status == 200) {
                                    this.events.publish('user:Status', 'Logged In');
                                    let alert = this.alertCtrl.create({
                                        title: 'App Login',
                                        subTitle: 'Login successful',
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                var LoginName = this.localstorage.getLocalValue('LoginName');
                                console.log('Retrieved LoginName: ' + LoginName);
                                this.ManualSync();
                                this.events.publish('user:Status', 'Logged In');
                                // Get forwarding page value
                                var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
                                switch (ForwardingPage) {
                                    case "MyAgenda":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "MyAgendaFull":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "EventSurvey":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "CETracking":
                                        this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "Notes":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    default:
                                        // Navigate back to Home page but eliminate Back button by setting it to Root
                                        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                                        break;
                                }
                                loading.dismiss();
                            }, err => {
                                loading.dismiss();
                                let alert = this.alertCtrl.create({
                                    title: 'App Login',
                                    subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                                    buttons: ['Try Again']
                                });
                                alert.present();
                                console.log("Error");
                                var LoginName = this.localstorage.getLocalValue('LoginName');
                                console.log('Retrieved LoginName [2]: ' + LoginName);
                            });
                            //let alert = this.alertCtrl.create({
                            //	title: 'Login Error',
                            //	subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                            //	buttons: ['OK']
                            //});
                            //alert.present();
                        }
                    }
                    else {
                        console.log('Login error 2');
                        let alert = this.alertCtrl.create({
                            title: 'Login Error',
                            subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                    loading.dismiss();
                }, err => {
                    // Unable to authenticate against AACD API
                    // Try development environment login API as a fallback
                    console.log('Login: Error: ' + err);
                    console.log('Login: Error: ' + JSON.stringify(err));
                    console.log('Login: check development login API');
                    this.http.get('https://aacdmobile.convergence-us.com/cvplanner.php?action=authenticate&em=' + this.LoginName + '&ps=' + this.LoginPassword, {}, {}).then(data => {
                        var loginService5 = JSON.parse(data.data);
                        console.log("API Response: " + JSON.stringify(loginService5));
                        console.log("Status: " + loginService5.status);
                        console.log("Attendee ID: " + loginService5.AttendeeID);
                        console.log("Attendee Full Name: " + loginService5.AttendeeFullName);
                        console.log("Conference Dates: " + loginService5.ConferenceDates);
                        console.log("Conference Date Labels: " + loginService5.ConferenceDateLabels);
                        var initials = loginService5.AttendeeFullName.match(/\b\w/g) || [];
                        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                        this.localstorage.setLocalValue("LoginNameInitials", initials);
                        // Store values
                        this.localstorage.setLocalValue('LoginName', this.LoginName);
                        this.localstorage.setLocalValue('LoginFullName', loginService5.AttendeeFullName);
                        this.localstorage.setLocalValue('AttendeeID', loginService5.AttendeeID);
                        //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                        var diffDays = loginService5.ConferenceDays;
                        // Store values
                        this.localstorage.setLocalValue("AgendaDays", diffDays);
                        this.localstorage.setLocalValue("AgendaDates", loginService5.ConferenceDates);
                        this.localstorage.setLocalValue("AgendaDayButtonLabels", loginService5.ConferenceDateLabels);
                        // Show response
                        if (loginService5.status == 200) {
                            this.events.publish('user:Status', 'Logged In');
                            let alert = this.alertCtrl.create({
                                title: 'App Login',
                                subTitle: 'Login successful',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                        var LoginName = this.localstorage.getLocalValue('LoginName');
                        console.log('Retrieved LoginName: ' + LoginName);
                        this.ManualSync();
                        this.events.publish('user:Status', 'Logged In');
                        // Get forwarding page value
                        var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
                        switch (ForwardingPage) {
                            case "MyAgenda":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "MyAgendaFull":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "EventSurvey":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "CETracking":
                                this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "Notes":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            default:
                                // Navigate back to Home page but eliminate Back button by setting it to Root
                                this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                                break;
                        }
                        loading.dismiss();
                    }, err => {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: 'App Login',
                            subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                            buttons: ['Try Again']
                        });
                        alert.present();
                        console.log("Login: Final Error");
                        var LoginName = this.localstorage.getLocalValue('LoginName');
                        console.log('Retrieved LoginName [2]: ' + LoginName);
                    });
                });
            }
            else {
                this.http2.get('https://aacd.com/wsAPI.php', {
                    params: {
                        // 2017 parameters
                        //'u': this.LoginName,
                        //'p': this.LoginPassword,
                        //'module': 'thunder',
                        //'method': 'validateMember',
                        //'username': 'wsAPIUser',
                        //'password': 'apple13',
                        //'output': 'json'
                        // Test parameter for Convergence API
                        //'action':   'authenticate'
                        // 2018-2019 parameters
                        'u': encodedLoginName,
                        'p': encodedLoginPassword,
                        'module': 'aacd.websiteforms',
                        'method': 'validateMember',
                        'username': 'wsapiconvergence',
                        'password': 'apple181',
                        'output': 'json'
                    }
                }).map(res => res.json()).subscribe(loginService => {
                    console.log("API Response: " + JSON.stringify(loginService));
                    if (loginService.status == "1") { // Response from Clarity authentication API received/processed
                        if (loginService.data.login.authenticated == "1") { // Successful authentication
                            // Save credentials
                            this.localstorage.setLocalValue('LoginName', this.LoginName);
                            this.localstorage.setLocalValue('LoginFullName', loginService.AttendeeFullName);
                            this.localstorage.setLocalValue('AttendeeID', loginService.AttendeeID);
                            this.localstorage.setLocalValue("loginUsername", this.LoginName);
                            this.localstorage.setLocalValue("loginPassword", this.LoginPassword);
                            // Determine if single or multiple teammembers
                            console.log("Team Member count: " + loginService.data.login.teammembers.length);
                            if (loginService.data.login.teammembers.length == 0) {
                                let alert = this.alertCtrl.create({
                                    title: 'Login Error',
                                    subTitle: 'Your login was unsuccessful.  Either your credentials are incorrect or you are not registered for the conference.',
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                            if (loginService.data.login.teammembers.length == 1) { // Single team member
                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth() + 1; //January is 0!
                                var yyyy = today.getFullYear();
                                var hr = today.getHours();
                                var mn = today.getMinutes();
                                if (dd < 10) {
                                    var ds = '0' + dd;
                                }
                                if (mm < 10) {
                                    var ms = '0' + mm;
                                }
                                if (hr < 10) {
                                    var hs = '0' + hr;
                                }
                                if (mn < 10) {
                                    var ns = '0' + mn;
                                }
                                var todayS = yyyy + '-' + ms + '-' + ds + ' ' + hs + ':' + ns + ':00';
                                var Fullname = loginService.data.login.teammembers[0].fullname;
                                var n = Fullname.indexOf(',');
                                Fullname = Fullname.substring(0, n != -1 ? n : Fullname.length);
                                var initials = Fullname.match(/\b\w/g) || [];
                                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                                this.localstorage.setLocalValue("LoginNameInitials", initials);
                                // Use the only one available
                                this.localstorage.setLocalValue("AttendeeID", loginService.data.login.teammembers[0].ct_id);
                                this.localstorage.setLocalValue("AttendeeFullName", loginService.data.login.teammembers[0].fullname);
                                this.localstorage.setLocalValue('LoginFullName', loginService.data.login.teammembers[0].fullname);
                                this.localstorage.setLocalValue("LastLoggedInDate", todayS);
                                // -------------------------------------------
                                // Get conference dates after successful login
                                // -------------------------------------------
                                var URL2 = 'https://aacdmobile.convergence-us.com/cvPlanner.php';
                                URL2 = URL2 + '?action=conferencedates';
                                //URL2 = URL2 + '&em=' + this.LoginName;
                                //URL2 = URL2 + '&ps=' + this.LoginPassword;
                                URL2 = URL2 + '&atID=' + loginService.data.login.teammembers[0].ct_id;
                                URL2 = URL2 + '&pushID=' + pushID;
                                URL2 = URL2 + '&deviceType=' + deviceType;
                                console.log('Login URL: ' + URL);
                                this.http2.get(URL2).map(res2 => res2.json()).subscribe(data2 => {
                                    console.log("API Response: " + JSON.stringify(data2));
                                    console.log("Status: " + data2.status);
                                    console.log("Conference Dates: " + data2.ConferenceDates);
                                    console.log("Conference Date Labels: " + data2.ConferenceDateLabels);
                                    //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                                    var diffDays = data2.ConferenceDays;
                                    // Store values
                                    this.localstorage.setLocalValue("AgendaDays", diffDays);
                                    this.localstorage.setLocalValue("AgendaDates", data2.ConferenceDates);
                                    this.localstorage.setLocalValue("AgendaDayButtonLabels", data2.ConferenceDateLabels);
                                });
                                // Initiate manual sync to get latest information
                                this.ManualSync();
                                this.events.publish('user:Status', 'Logged In');
                                // Depending of saved value, return to Home or move forward to MyAgenda or CE Tracking
                                var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
                                switch (ForwardingPage) {
                                    case "MyAgenda":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "MyAgendaFull":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "EventSurvey":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "CETracking":
                                        this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "Notes":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    default:
                                        // Navigate back to Home page but eliminate Back button by setting it to Root
                                        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                                        break;
                                }
                            }
                            if (loginService.data.login.teammembers.length > 1) { // Multiple team members
                                console.log('Multiple members');
                                // Multiple so show list to pick from
                                this.displayMultipleLoginsDropdown = true;
                                this.teammembers = [];
                                for (var i = 0; i < loginService.data.login.teammembers.length; i++) {
                                    this.teammembers.push({
                                        ct_id: loginService.data.login.teammembers[i].ct_id,
                                        DisplayName: loginService.data.login.teammembers[i].fullname
                                    });
                                }
                                this.cd.markForCheck();
                                this.LoginButton = false;
                                this.LoginSelectButton = true;
                            }
                        }
                        else {
                            console.log('Login error 1');
                            console.log('Check development login API');
                            this.http2.get('https://aacdmobile.convergence-us.com/cvplanner.php?action=authenticate&em=' + this.LoginName + '&ps=' + this.LoginPassword).map(res => res.json()).subscribe(data => {
                                console.log("API Response: " + JSON.stringify(data));
                                console.log("Status: " + data.status);
                                console.log("Attendee ID: " + data.AttendeeID);
                                console.log("Attendee Full Name: " + data.AttendeeFullName);
                                console.log("Conference Dates: " + data.ConferenceDates);
                                console.log("Conference Date Labels: " + data.ConferenceDateLabels);
                                var initials = data.AttendeeFullName.match(/\b\w/g) || [];
                                initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                                this.localstorage.setLocalValue("LoginNameInitials", initials);
                                // Store values
                                this.localstorage.setLocalValue('LoginName', this.LoginName);
                                this.localstorage.setLocalValue('LoginFullName', data.AttendeeFullName);
                                this.localstorage.setLocalValue('AttendeeID', data.AttendeeID);
                                //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                                var diffDays = data.ConferenceDays;
                                // Store values
                                this.localstorage.setLocalValue("AgendaDays", diffDays);
                                this.localstorage.setLocalValue("AgendaDates", data.ConferenceDates);
                                this.localstorage.setLocalValue("AgendaDayButtonLabels", data.ConferenceDateLabels);
                                // Show response
                                if (data.status == "200") {
                                    this.events.publish('user:Status', 'Logged In');
                                    let alert = this.alertCtrl.create({
                                        title: 'App Login',
                                        subTitle: 'Login successful',
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                var LoginName = this.localstorage.getLocalValue('LoginName');
                                console.log('Retrieved LoginName: ' + LoginName);
                                this.ManualSync();
                                this.events.publish('user:Status', 'Logged In');
                                // Get forwarding page value
                                var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
                                switch (ForwardingPage) {
                                    case "MyAgenda":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "MyAgendaFull":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "EventSurvey":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "CETracking":
                                        this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    case "Notes":
                                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                                            const startIndex = this.navCtrl.getActive().index - 1;
                                            this.navCtrl.remove(startIndex, 1);
                                        });
                                        break;
                                    default:
                                        // Navigate back to Home page but eliminate Back button by setting it to Root
                                        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                                        break;
                                }
                                loading.dismiss();
                            }, err => {
                                loading.dismiss();
                                let alert = this.alertCtrl.create({
                                    title: 'App Login',
                                    subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                                    buttons: ['Try Again']
                                });
                                alert.present();
                                console.log("Error");
                                var LoginName = this.localstorage.getLocalValue('LoginName');
                                console.log('Retrieved LoginName [2]: ' + LoginName);
                            });
                            //let alert = this.alertCtrl.create({
                            //	title: 'Login Error',
                            //	subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                            //	buttons: ['OK']
                            //});
                            //alert.present();
                        }
                    }
                    else {
                        console.log('Login error 2');
                        let alert = this.alertCtrl.create({
                            title: 'Login Error',
                            subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                    loading.dismiss();
                }, err => {
                    // Unable to authenticate against AACD API
                    // Try development environment login API as a fallback
                    console.log('Check development login API');
                    this.http2.get('https://aacdmobile.convergence-us.com/cvplanner.php?action=authenticate&em=' + this.LoginName + '&ps=' + this.LoginPassword).map(res => res.json()).subscribe(data => {
                        console.log("API Response: " + JSON.stringify(data));
                        console.log("Status: " + data.status);
                        console.log("Attendee ID: " + data.AttendeeID);
                        console.log("Attendee Full Name: " + data.AttendeeFullName);
                        console.log("Conference Dates: " + data.ConferenceDates);
                        console.log("Conference Date Labels: " + data.ConferenceDateLabels);
                        var initials = data.AttendeeFullName.match(/\b\w/g) || [];
                        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                        this.localstorage.setLocalValue("LoginNameInitials", initials);
                        // Store values
                        this.localstorage.setLocalValue('LoginName', this.LoginName);
                        this.localstorage.setLocalValue('LoginFullName', data.AttendeeFullName);
                        this.localstorage.setLocalValue('AttendeeID', data.AttendeeID);
                        //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                        var diffDays = data.ConferenceDays;
                        // Store values
                        this.localstorage.setLocalValue("AgendaDays", diffDays);
                        this.localstorage.setLocalValue("AgendaDates", data.ConferenceDates);
                        this.localstorage.setLocalValue("AgendaDayButtonLabels", data.ConferenceDateLabels);
                        // Show response
                        if (data.status == "200") {
                            this.events.publish('user:Status', 'Logged In');
                            let alert = this.alertCtrl.create({
                                title: 'App Login',
                                subTitle: 'Login successful',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                        var LoginName = this.localstorage.getLocalValue('LoginName');
                        console.log('Retrieved LoginName: ' + LoginName);
                        this.ManualSync();
                        this.events.publish('user:Status', 'Logged In');
                        // Get forwarding page value
                        var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
                        switch (ForwardingPage) {
                            case "MyAgenda":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "MyAgendaFull":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "EventSurvey":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "CETracking":
                                this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            case "Notes":
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                                break;
                            default:
                                // Navigate back to Home page but eliminate Back button by setting it to Root
                                this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                                break;
                        }
                        loading.dismiss();
                    }, err => {
                        loading.dismiss();
                        let alert = this.alertCtrl.create({
                            title: 'App Login',
                            subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
                            buttons: ['Try Again']
                        });
                        alert.present();
                        console.log("Error");
                        var LoginName = this.localstorage.getLocalValue('LoginName');
                        console.log('Retrieved LoginName [2]: ' + LoginName);
                    });
                });
            }
        }
    }
    SelectLogin() {
        console.log('SelectLogin method chosen');
        console.log(JSON.stringify(this.selectedLogin));
        if ((this.selectedLogin["DisplayName"] === undefined) || (this.selectedLogin["DisplayName"] == "")) {
            let alert = this.alertCtrl.create({
                title: 'Login Error',
                subTitle: 'You cannot select a blank name.&nbsp; Please try again.',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            console.log("ID: " + this.selectedLogin["ct_id"]);
            console.log("Name: " + this.selectedLogin["DisplayName"]);
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            var hr = today.getHours();
            var mn = today.getMinutes();
            if (dd < 10) {
                var ds = '0' + dd;
            }
            if (mm < 10) {
                var ms = '0' + mm;
            }
            if (hr < 10) {
                var hs = '0' + hr;
            }
            if (mn < 10) {
                var ns = '0' + mn;
            }
            var todayS = yyyy + '-' + ms + '-' + ds + ' ' + hs + ':' + ns + ':00';
            this.localstorage.setLocalValue("AttendeeID", this.selectedLogin["ct_id"]);
            this.localstorage.setLocalValue("AttendeeFullName", this.selectedLogin["DisplayName"]);
            this.localstorage.setLocalValue("LastLoggedInDate", todayS);
            this.localstorage.setLocalValue('LoginFullName', this.selectedLogin["DisplayName"]);
            var Fullname = this.selectedLogin["DisplayName"];
            var n = Fullname.indexOf(',');
            Fullname = Fullname.substring(0, n != -1 ? n : Fullname.length);
            var initials = Fullname.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            this.localstorage.setLocalValue("LoginNameInitials", initials);
            var pushID = this.localstorage.getLocalValue('PlayerID');
            var deviceType = this.localstorage.getLocalValue('DevicePlatform');
            // -------------------------------------------
            // Get conference dates after successful login
            // -------------------------------------------
            var URL2 = 'https://aacdmobile.convergence-us.com/cvPlanner.php';
            URL2 = URL2 + '?action=conferencedates';
            URL2 = URL2 + '&atID=' + this.selectedLogin["ct_id"];
            URL2 = URL2 + '&pushID=' + pushID;
            URL2 = URL2 + '&deviceType=' + deviceType;
            console.log('Login URL: ' + URL);
            this.http.get(URL2, {}, {}).then(data2 => {
                var loginService6 = JSON.parse(data2.data);
                console.log("API Response: " + JSON.stringify(loginService6));
                console.log("Status: " + loginService6.status);
                console.log("Conference Dates: " + loginService6.ConferenceDates);
                console.log("Conference Date Labels: " + loginService6.ConferenceDateLabels);
                //var diffDays = Math.round(Math.abs((StartDate.getTime() - EndDate.getTime())/(oneDay)));
                var diffDays = loginService6.ConferenceDays;
                // Store values
                this.localstorage.setLocalValue("AgendaDays", diffDays);
                this.localstorage.setLocalValue("AgendaDates", loginService6.ConferenceDates);
                this.localstorage.setLocalValue("AgendaDayButtonLabels", loginService6.ConferenceDateLabels);
            });
            // Initiate manual sync to get latest information
            this.ManualSync();
            this.events.publish('user:Status', 'Logged In');
            // Save Push Notification token
            // var currentPlatform = ionic.Platform.platform();
            //$ionicPush.register().then(function (t) {
            //    return $ionicPush.saveToken(t);
            //}).then(function (t) {
            //    var PushPromise = PushSyncService.SendPushRecord(t.token, this.login.selectedLogin.ct_id, this.login.selectedLogin.DisplayName, currentPlatform, "Register");
            //    console.log('Push token saved: ' + t.token);
            //});
            // Depending of saved value, return to Home or move forward to MyAgenda or CE Tracking
            // Get forwarding page value
            var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
            switch (ForwardingPage) {
                case "MyAgenda":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' }).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 1;
                        this.navCtrl.remove(startIndex, 1);
                    });
                    break;
                case "MyAgendaFull":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' }).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 1;
                        this.navCtrl.remove(startIndex, 1);
                    });
                    break;
                case "EventSurvey":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__evaluationconference_evaluationconference__["a" /* EvaluationConference */], {}, { animate: true, direction: 'forward' }).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 1;
                        this.navCtrl.remove(startIndex, 1);
                    });
                    break;
                case "CETracking":
                    this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' }).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 1;
                        this.navCtrl.remove(startIndex, 1);
                    });
                    break;
                case "Notes":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' }).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 1;
                        this.navCtrl.remove(startIndex, 1);
                    });
                    break;
                default:
                    // Navigate back to Home page but eliminate Back button by setting it to Root
                    this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */], {}, { animate: true, direction: 'forward' });
                    break;
            }
        }
    }
    ManualSync() {
        var DevicePlatform = this.localstorage.getLocalValue('DevicePlatform');
        // Check to start AutoSync if not running a browser and user is logged in
        //if ((this.DevicePlatform != "Browser") && (AttendeeID !== null && AttendeeID != '')) {
        if (DevicePlatform != "Browser") {
            // Previously successful sync time
            var LastSync3 = this.localstorage.getLocalValue('LastSync');
            if (LastSync3 == '' || LastSync3 === null) {
                LastSync3 = '2019-01-01T00:00:01Z';
            }
            var LastSync2 = new Date(LastSync3).toUTCString();
            var LastSync = dateFormat(LastSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            // Current sync time in UTC
            var ThisSync2 = new Date().toUTCString();
            var ThisSync = dateFormat(ThisSync2, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            console.log('LoginPage: ManualSync event');
            // Call AutoSync service in providers
            this.syncprovider.DBSyncUpdateM2S(LastSync, ThisSync).then(data => {
                console.log('LoginPage: Executed UpdateM2S Sync: ' + data);
                // Update LastSync date for next run
                this.localstorage.setLocalValue('LastSync', ThisSync);
            }).catch(function () {
                console.log("LoginPage: UpdateM2S Sync Promise Rejected");
            });
            this.syncprovider.DBSyncUpdateS2M(LastSync, ThisSync).then(data => {
                console.log('LoginPage: Executed UpdateS2M Sync: ' + data);
                // Update LastSync date for next run
                this.localstorage.setLocalValue('LastSync', ThisSync);
            }).catch(function () {
                console.log("LoginPage: UpdateS2M Sync Promise Rejected");
            });
        }
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('document:keypress', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], LoginPage.prototype, "handleKeyboardEvent", null);
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-login',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/login/login.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>User Account</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content style="background:url(assets/img/SDBeach.png)no-repeat center;background-size:cover;">\n\n\n\n	<div class="spacer" style="width: 300px; height: 3%;"></div>\n\n	<div style="text-align: center;" *ngIf="msgRequireLogin">\n\n		<div style="display: inline-block; width:75%; padding:10px; background-color:white; color: black; text-align:center;font-size:18px;">\n\n			The screen you are requesting requires that you be logged into your account.&nbsp; Please log in below.\n\n		</div>\n\n	</div>\n\n	<div style="text-align: center;" *ngIf="msgRequireLogin2">\n\n		<div style="display: inline-block; width:75%; padding:10px; background-color:white; color: black; text-align:center;font-size:18px;">\n\n			Managing your agenda requires that you be logged into your account.&nbsp; Please log in below.\n\n		</div>\n\n	</div>\n\n	<div class="spacer" style="width: 300px; height: 3%;"></div>\n\n\n\n\n\n\n\n	<div *ngIf="LoginSection">\n\n		<ion-list>\n\n				<ion-item style="background:transparent!important;color:#fff;font-size:20px!important">\n\n				<ion-icon name="mail" item-start></ion-icon>\n\n				<ion-label floating>Username</ion-label>\n\n				<ion-input [(ngModel)]="LoginName"></ion-input>\n\n			</ion-item>\n\n\n\n			\n\n\n\n\n\n			<ion-item style="background:transparent!important;color:#fff;font-size:20px!important">\n\n				<ion-icon name="lock" item-start></ion-icon>\n\n				<ion-label floating>Password</ion-label>\n\n			<ion-input [(ngModel)]="LoginPassword" type="password"></ion-input>\n\n		</ion-item>\n\n\n\n	</ion-list>\n\n\n\n\n\n		<div style="text-align:center;  margin:auto">\n\n			<button ion-button color=secondary style="width:90%; margin-top:20px" (click)="LoginUser();">Sign In</button>\n\n		</div>\n\n\n\n</div>\n\n\n\n\n\n\n\n\n\n\n\n\n\n	<div *ngIf="displayMultipleLoginsDropdown">\n\n		<div style="text-align: center;">\n\n			<div style="display: inline-block; width:75%; padding:10px; background-color:white; color: black; text-align:center;font-size:18px;">\n\n				Multiple team members are linked to that login. &nbsp;Please choose your name from the dropdown and tap Select Team Member.\n\n			</div>\n\n		</div>\n\n		<br/><br/>\n\n		<label class="item item-select" id="searchByTopic-select1">\n\n			<ion-label style="color:#fff">Team Member</ion-label>\n\n			<ion-select [(ngModel)]="selectedLogin" (ionChange)="SetTeamMember($event)" style="color:#fff">\n\n				 <ion-option *ngFor="let teammember of teammembers" [value]="teammember">{{teammember.DisplayName}}</ion-option>\n\n			</ion-select>\n\n		</label>\n\n		<button ion-button full *ngIf="LoginSelectButton" (click)="SelectLogin()">Select Team Member</button>\n\n	</div>\n\n\n\n	<div *ngIf="displayMultipleLogins">\n\n		<ion-list id="topic-list3" style="color:#fff">\n\n			<ion-item class="item-icon-right" (click)="ChooseID(login.ct_id)" *ngFor="let login of teammembers" id="topics-list-item19" style="color:#fff">\n\n				<p class="myLabelBold" style="color:#fff">\n\n					{{login.DisplayName}}\n\n				</p>\n\n			</ion-item>\n\n		</ion-list>\n\n	</div>\n\n\n\n	<div *ngIf="LogoutSection">\n\n		<ion-label text-wrap style="width:90%; text-align:center; margin-left:30px; background:transparent!important;color:#fff; padding: 10px">You are currently signed in as <b>{{LoggedInUser}}</b>.  If you wish to view the\n\n		app under a different user, then Sign Out and sign back in using their credentials.</ion-label>\n\n		\n\n		<button ion-button full style="width:90%; text-align:center; margin:auto" (click)="LogoutUser();">Sign Out</button>\n\n\n\n	</div>\n\n\n\n\n\n\n\n	\n\n</ion-content>\n\n\n\n\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/login/login.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_http__["a" /* HTTP */],
        __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_7__providers_synchronization_synchronization__["a" /* Synchronization */],
        __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__["a" /* Localstorage */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 540:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPage", function() { return MainPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(548);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MainPage_1;


//import { enableProdMode } from '@angular/core';
//enableProdMode();
Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);


let MainPage = MainPage_1 = class MainPage {
    constructor(navCtrl) {
        this.navCtrl = navCtrl;
        this.rootPage = MainPage_1;
    }
    openMain() {
        this.rootPage = MainPage_1;
    }
};
MainPage = MainPage_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
        selector: 'page-main',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/app/main.html"*/''/*ion-inline-end:"/Users/petervroom/aacd19/src/app/main.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["u" /* NavController */]])
], MainPage);

//# sourceMappingURL=main.js.map

/***/ }),

/***/ 542:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotesDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_localstorage_localstorage__ = __webpack_require__(15);
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





let NotesDetailsPage = class NotesDetailsPage {
    constructor(navCtrl, navParams, databaseprovider, cd, loadingCtrl, alertCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.localstorage = localstorage;
        this.EventID = this.navParams.get('EventID');
        this.DisplayEventName = "";
        this.SpeakerDisplayName = "";
        this.NoteDetails = "";
        this.AttendeeID = "";
        this.NoteID = "";
        this.NoteStatus = "";
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        // Blank and show loading info
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var EventID = this.localstorage.getLocalValue('EventID');
        if (AttendeeID != '' && AttendeeID != null) {
            //loading.present();
            flags = "0|dt|" + EventID;
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log('Session Title: ' + data[0].session_title);
                    if (data[0].Note != "" && data[0].Note != null && data[0].Note != undefined) {
                        console.log('Existing note');
                        this.DisplayEventName = data[0].session_title;
                        this.NoteDetails = data[0].Note;
                        this.NoteID = data[0].id;
                        this.NoteStatus = 'Update';
                    }
                    else {
                        console.log('New note');
                        this.DisplayEventName = data[0].session_title;
                        this.NoteDetails = "";
                        this.NoteID = '0';
                        this.NoteStatus = 'New';
                    }
                    this.cd.markForCheck();
                }
                //console.log('Note details: ' + data[0].Note);
                //loading.dismiss();
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        else {
            console.log('User not logged in');
            //loading.dismiss();
        }
    }
    SaveNote() {
        console.log('Process note');
        // Saving progress
        let saving = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Saving...'
        });
        // Alert for successful save
        let savealert = this.alertCtrl.create({
            title: 'Note Entry',
            subTitle: 'Note has been saved.',
            buttons: ['Ok']
        });
        // Alert for failed save
        let failalert = this.alertCtrl.create({
            title: 'Note Entry',
            subTitle: 'Unable to save your note at this time - please try again in a little bit.',
            buttons: ['Ok']
        });
        // Show saving progress
        saving.present();
        var NoteStatus = this.NoteStatus;
        var NoteID = this.NoteID;
        var sessionID = this.EventID;
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var NoteEventID = this.localstorage.getLocalValue('EventID');
        var NewNote = this.NoteDetails;
        var flags;
        // If New note, create record
        if (NoteStatus == 'New') {
            console.log('Save New Note');
            flags = "0|sn|" + NoteEventID + "|" + NoteID + "|" + NewNote;
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].status == "Saved") {
                        // Saved
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.pop();
                    }
                    else {
                        // Not saved
                        saving.dismiss();
                        failalert.present();
                    }
                }
                else {
                    // Not saved
                    saving.dismiss();
                    failalert.present();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        // If existing note, update record
        if (NoteStatus == 'Update') {
            console.log('Update Existing Note');
            flags = "0|un|" + NoteEventID + "|" + NoteID + "|" + NewNote;
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    if (data[0].status == "Saved") {
                        // Saved
                        saving.dismiss();
                        savealert.present();
                        this.navCtrl.pop();
                    }
                    else {
                        // Not saved
                        saving.dismiss();
                        failalert.present();
                    }
                }
                else {
                    // Not saved
                    saving.dismiss();
                    failalert.present();
                }
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
    }
    ;
    // Cancel by returning to calling page.  This could be the Notes Listing or Education Details page
    CancelNote() {
        this.navCtrl.pop();
    }
    ;
};
NotesDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-notesdetails',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/notesdetails/notesdetails.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Notes</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-card>\n\n		<ion-card-header style="background:#2c3e50; color:#fff">\n			{{DisplayEventName}}\n			{{SpeakerDisplayName}}\n		</ion-card-header>\n\n		<ion-card-content>\n			<ion-textarea (input)=\'NoteDetails = $event.target.value\' name="NoteDetails" [value]="NoteDetails" placeholder="Enter notes..."></ion-textarea>\n		</ion-card-content>\n\n	</ion-card>\n\n	<ion-grid>\n		<ion-row>\n			<ion-col col-3 >\n				<button ion-button full color=secondary (click)="SaveNote()">\n					Save\n				</button>\n			</ion-col>\n			<ion-col col-3 >\n				<button ion-button full color=secondary (click)="CancelNote()">\n					Cancel\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n	<div style=\'display:none\'>\n		{{AttendeeID}}\n		{{EventID}}\n		{{NoteID}}\n		{{NoteStatus}}\n	</div>\n	\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/notesdetails/notesdetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_localstorage_localstorage__["a" /* Localstorage */]])
], NotesDetailsPage);

//# sourceMappingURL=notesdetails.js.map

/***/ }),

/***/ 543:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SliderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the SliderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let SliderPage = class SliderPage {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SliderPage');
    }
};
SliderPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-slider',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/slider/slider.html"*/'<!--\n  Generated template for the SliderPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Slider</ion-title>\n  </ion-navbar>\n  </ion-header>\n\n\n  <ion-content>\n    <ion-slides autoplay="5000" loop="true" speed="1000">\n      <ion-slide>\n        <img src="../../assets/img/head5.jpg">\n      </ion-slide>\n      <ion-slide>\n        <img src="../../assets/img/head6.jpg">\n      </ion-slide>\n      <ion-slide>\n        <img src="../../assets/img/head17.jpg">\n      </ion-slide>\n    </ion-slides>\n  </ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/slider/slider.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */]])
], SliderPage);

//# sourceMappingURL=slider.js.map

/***/ }),

/***/ 548:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_http__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_http__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__ = __webpack_require__(530);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__ = __webpack_require__(531);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_sqlite__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_component__ = __webpack_require__(912);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_onesignal__ = __webpack_require__(532);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ionic_img_viewer__ = __webpack_require__(913);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_camera__ = __webpack_require__(539);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_ionic_text_avatar__ = __webpack_require__(920);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_ionic_image_loader__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_ng2_charts__ = __webpack_require__(541);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_ng2_charts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17_ng2_charts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_ng2_file_upload__ = __webpack_require__(922);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_keyboard__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__providers_synchronization_synchronization__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pipes_relative_time__ = __webpack_require__(925);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__services_post_service__ = __webpack_require__(940);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__services_user_service__ = __webpack_require__(942);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__services_chat_service__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_home_home__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_conferencecity_conferencecity__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_social_social__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_more_more__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_slider_slider__ = __webpack_require__(543);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_help_help__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_speakers_speakers__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_program_program__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_map_map__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_login_login__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_exhibitors_exhibitors__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_notes_notes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_database_database__ = __webpack_require__(489);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_evaluationconference_evaluationconference__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_myagenda_myagenda__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_myagendafull_myagendafull__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_educationdetails_educationdetails__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_activity_activity__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_profile_profile__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_notifications_notifications__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_attendees_attendees__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_networking_networking__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_attendeebookmarks_attendeebookmarks__ = __webpack_require__(944);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_conversation_conversation__ = __webpack_require__(538);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Components, functions, plugins













//import { GoogleMaps } from '@ionic-native/google-maps';






//import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';

//import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
// Providers




// Services



// Pages
























// Temporary Support Pages
//import { FloorplanMappingPage } from '../pages/floorplanmapping/floorplanmapping';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_27__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_29__pages_social_social__["a" /* SocialPage */],
            __WEBPACK_IMPORTED_MODULE_30__pages_more_more__["a" /* MorePage */],
            __WEBPACK_IMPORTED_MODULE_31__pages_slider_slider__["a" /* SliderPage */],
            __WEBPACK_IMPORTED_MODULE_32__pages_help_help__["a" /* HelpPage */],
            __WEBPACK_IMPORTED_MODULE_33__pages_speakers_speakers__["a" /* SpeakersPage */],
            __WEBPACK_IMPORTED_MODULE_34__pages_program_program__["a" /* ProgramPage */],
            __WEBPACK_IMPORTED_MODULE_35__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_36__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_28__pages_conferencecity_conferencecity__["a" /* ConferenceCityPage */],
            __WEBPACK_IMPORTED_MODULE_37__pages_exhibitors_exhibitors__["a" /* ExhibitorsPage */],
            __WEBPACK_IMPORTED_MODULE_38__pages_notes_notes__["a" /* NotesPage */],
            __WEBPACK_IMPORTED_MODULE_39__pages_database_database__["a" /* DatabasePage */],
            __WEBPACK_IMPORTED_MODULE_43__pages_educationdetails_educationdetails__["a" /* EducationDetailsPage */],
            __WEBPACK_IMPORTED_MODULE_40__pages_evaluationconference_evaluationconference__["a" /* EvaluationConference */],
            //FloorplanMappingPage,
            __WEBPACK_IMPORTED_MODULE_41__pages_myagenda_myagenda__["a" /* MyAgenda */],
            __WEBPACK_IMPORTED_MODULE_42__pages_myagendafull_myagendafull__["a" /* MyAgendaFull */],
            __WEBPACK_IMPORTED_MODULE_50__pages_conversation_conversation__["a" /* ConversationPage */],
            __WEBPACK_IMPORTED_MODULE_46__pages_notifications_notifications__["a" /* NotificationsPage */],
            __WEBPACK_IMPORTED_MODULE_47__pages_attendees_attendees__["a" /* AttendeesPage */],
            __WEBPACK_IMPORTED_MODULE_49__pages_attendeebookmarks_attendeebookmarks__["a" /* AttendeeBookmarksPage */],
            __WEBPACK_IMPORTED_MODULE_48__pages_networking_networking__["a" /* NetworkingPage */],
            __WEBPACK_IMPORTED_MODULE_23__pipes_relative_time__["a" /* RelativeTime */],
            __WEBPACK_IMPORTED_MODULE_15_ionic_text_avatar__["a" /* IonTextAvatar */],
            __WEBPACK_IMPORTED_MODULE_45__pages_profile_profile__["a" /* ProfilePage */],
            //ProgressBarComponent,
            __WEBPACK_IMPORTED_MODULE_44__pages_activity_activity__["a" /* ActivityPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_5__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_17_ng2_charts__["ChartsModule"],
            __WEBPACK_IMPORTED_MODULE_18_ng2_file_upload__["FileUploadModule"],
            __WEBPACK_IMPORTED_MODULE_13_ionic_img_viewer__["a" /* IonicImageViewerModule */],
            //IonAlphaScrollModule,
            __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["b" /* HttpClientModule */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_16_ionic_image_loader__["b" /* IonicImageLoader */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["o" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */], { tabsPlacement: 'bottom' }, {
                links: [
                    { loadChildren: 'main.module#MainPageModule', name: 'MainPage', segment: 'main', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/activityfeedcomment/activityfeedcomment.module#ActivityFeedCommentPageModule', name: 'ActivityFeedCommentPage', segment: 'activityfeedcomment', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/activityfeedleaderboard/activityfeedleaderboard.module#ActivityFeedLeaderboardPageModule', name: 'ActivityFeedLeaderboardPage', segment: 'activityfeedleaderboard', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/cetracking/cetracking.module#CetrackingPageModule', name: 'CetrackingPage', segment: 'cetracking', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/conversations/conversations.module#ConversationsPageModule', name: 'ConversationsPage', segment: 'conversations', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/evaluationlecture/evaluationlecture.module#EvaluationLectureModule', name: 'EvaluationLecture', segment: 'evaluationlecture', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/notesdetails/notesdetails.module#NotesDetailsPageModule', name: 'NotesDetailsPage', segment: 'notesdetails', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/notifications/notifications.module#NotificationsPageModule', name: 'NotificationsPage', segment: 'notifications', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/profileimage/profileimage.module#ProfileImagePageModule', name: 'ProfileImagePage', segment: 'profileimage', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/profilepasswordchange/profilepasswordchange.module#ProfilePasswordChangePageModule', name: 'ProfilePasswordChangePage', segment: 'profilepasswordchange', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/profilesocialmediaentry/profilesocialmediaentry.module#ProfileSocialMediaEntryPageModule', name: 'ProfileSocialMediaEntryPage', segment: 'profilesocialmediaentry', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/searchbytopic/searchbytopic.module#SearchByTopicPageModule', name: 'SearchByTopicPage', segment: 'searchbytopic', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/slider/slider.module#SliderPageModule', name: 'SliderPage', segment: 'slider', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/speakerdetails/speakerdetails.module#SpeakerDetailsPageModule', name: 'SpeakerDetailsPage', segment: 'speakerdetails', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/activityfeeddetails/activityfeeddetails.module#ActivityFeedDetailsPageModule', name: 'ActivityFeedDetailsPage', segment: 'activityfeeddetails', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/attendeesprofile/attendeesprofile.module#AttendeesProfilePageModule', name: 'AttendeesProfilePage', segment: 'attendeesprofile', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/activityfeedposting/activityfeedposting.module#ActivityFeedPostingPageModule', name: 'ActivityFeedPostingPage', segment: 'activityfeedposting', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/evaluationworkshop/evaluationworkshop.module#EvaluationWorkshopModule', name: 'EvaluationWorkshop', segment: 'evaluationworkshop', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/exhibitordetails/exhibitordetails.module#ExhibitorDetailsPageModule', name: 'ExhibitorDetailsPage', segment: 'exhibitordetails', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/myagendapersonal/myagendapersonal.module#MyAgendaPersonalModule', name: 'MyAgendaPersonal', segment: 'myagendapersonal', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/profile/profile.module#ProfilePageModule', name: 'ProfilePage', segment: 'profile', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/listinglevel1/listinglevel1.module#ListingLevel1Module', name: 'ListingLevel1', segment: 'listinglevel1', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/searchresults/searchresults.module#SearchResultsPageModule', name: 'SearchResultsPage', segment: 'searchresults', priority: 'low', defaultHistory: [] }
                ]
            })
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["m" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_27__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_31__pages_slider_slider__["a" /* SliderPage */],
            __WEBPACK_IMPORTED_MODULE_29__pages_social_social__["a" /* SocialPage */],
            __WEBPACK_IMPORTED_MODULE_30__pages_more_more__["a" /* MorePage */],
            __WEBPACK_IMPORTED_MODULE_32__pages_help_help__["a" /* HelpPage */],
            __WEBPACK_IMPORTED_MODULE_33__pages_speakers_speakers__["a" /* SpeakersPage */],
            __WEBPACK_IMPORTED_MODULE_34__pages_program_program__["a" /* ProgramPage */],
            __WEBPACK_IMPORTED_MODULE_35__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_36__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_28__pages_conferencecity_conferencecity__["a" /* ConferenceCityPage */],
            __WEBPACK_IMPORTED_MODULE_39__pages_database_database__["a" /* DatabasePage */],
            __WEBPACK_IMPORTED_MODULE_43__pages_educationdetails_educationdetails__["a" /* EducationDetailsPage */],
            __WEBPACK_IMPORTED_MODULE_37__pages_exhibitors_exhibitors__["a" /* ExhibitorsPage */],
            __WEBPACK_IMPORTED_MODULE_38__pages_notes_notes__["a" /* NotesPage */],
            __WEBPACK_IMPORTED_MODULE_40__pages_evaluationconference_evaluationconference__["a" /* EvaluationConference */],
            //FloorplanMappingPage,
            __WEBPACK_IMPORTED_MODULE_41__pages_myagenda_myagenda__["a" /* MyAgenda */],
            __WEBPACK_IMPORTED_MODULE_42__pages_myagendafull_myagendafull__["a" /* MyAgendaFull */],
            __WEBPACK_IMPORTED_MODULE_50__pages_conversation_conversation__["a" /* ConversationPage */],
            __WEBPACK_IMPORTED_MODULE_46__pages_notifications_notifications__["a" /* NotificationsPage */],
            __WEBPACK_IMPORTED_MODULE_47__pages_attendees_attendees__["a" /* AttendeesPage */],
            __WEBPACK_IMPORTED_MODULE_49__pages_attendeebookmarks_attendeebookmarks__["a" /* AttendeeBookmarksPage */],
            __WEBPACK_IMPORTED_MODULE_48__pages_networking_networking__["a" /* NetworkingPage */],
            __WEBPACK_IMPORTED_MODULE_45__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_44__pages_activity_activity__["a" /* ActivityPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_14__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_onesignal__["a" /* OneSignal */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_http__["a" /* HTTP */],
            __WEBPACK_IMPORTED_MODULE_19__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_21__providers_localstorage_localstorage__["a" /* Localstorage */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__["a" /* SplashScreen */],
            { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* IonicErrorHandler */] },
            //[{ provide: ErrorHandler, useClass: MyErrorHandler }],
            __WEBPACK_IMPORTED_MODULE_20__providers_database_database__["a" /* Database */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_sqlite__["a" /* SQLite */],
            __WEBPACK_IMPORTED_MODULE_24__services_post_service__["a" /* PostService */],
            __WEBPACK_IMPORTED_MODULE_25__services_user_service__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_26__services_chat_service__["a" /* ChatService */],
            __WEBPACK_IMPORTED_MODULE_22__providers_synchronization_synchronization__["a" /* Synchronization */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyAgenda; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__myagendafull_myagendafull__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__educationdetails_educationdetails__ = __webpack_require__(62);
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






// Pages


let MyAgenda = class MyAgenda {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        // Display control variables, Wide Column
        this.agendaEventShowW0700 = false;
        this.agendaEventShowW0730 = false;
        this.agendaEventShowW0800 = false;
        this.agendaEventShowW0830 = false;
        this.agendaEventShowW0900 = false;
        this.agendaEventShowW0930 = false;
        this.agendaEventShowW1000 = false;
        this.agendaEventShowW1030 = false;
        this.agendaEventShowW1100 = false;
        this.agendaEventShowW1130 = false;
        this.agendaEventShowW1200 = false;
        this.agendaEventShowW1230 = false;
        this.agendaEventShowW1300 = false;
        this.agendaEventShowW1330 = false;
        this.agendaEventShowW1400 = false;
        this.agendaEventShowW1430 = false;
        this.agendaEventShowW1500 = false;
        this.agendaEventShowW1530 = false;
        this.agendaEventShowW1600 = false;
        this.agendaEventShowW1630 = false;
        this.agendaEventShowW1700 = false;
        this.agendaEventShowW1730 = false;
        this.agendaEventShowW1800 = false;
        this.agendaEventShowW1830 = false;
        this.agendaEventShowW1900 = false;
        this.agendaEventShowW1930 = false;
        this.agendaEventShowW2000 = false;
        this.agendaEventShowW2030 = false;
        this.agendaEventShowW2100 = false;
        this.agendaEventShowW2130 = false;
        this.agendaEventShowW2200 = false;
        this.agendaEventShowW2230 = false;
        // Display control variables, Column 1
        this.agendaEventShow0700 = false;
        this.agendaEventShow0730 = false;
        this.agendaEventShow0800 = false;
        this.agendaEventShow0830 = false;
        this.agendaEventShow0900 = false;
        this.agendaEventShow0930 = false;
        this.agendaEventShow1000 = false;
        this.agendaEventShow1030 = false;
        this.agendaEventShow1100 = false;
        this.agendaEventShow1130 = false;
        this.agendaEventShow1200 = false;
        this.agendaEventShow1230 = false;
        this.agendaEventShow1300 = false;
        this.agendaEventShow1330 = false;
        this.agendaEventShow1400 = false;
        this.agendaEventShow1430 = false;
        this.agendaEventShow1500 = false;
        this.agendaEventShow1530 = false;
        this.agendaEventShow1600 = false;
        this.agendaEventShow1630 = false;
        this.agendaEventShow1700 = false;
        this.agendaEventShow1730 = false;
        this.agendaEventShow1800 = false;
        this.agendaEventShow1830 = false;
        this.agendaEventShow1900 = false;
        this.agendaEventShow1930 = false;
        this.agendaEventShow2000 = false;
        this.agendaEventShow2030 = false;
        this.agendaEventShow2100 = false;
        this.agendaEventShow2130 = false;
        this.agendaEventShow2200 = false;
        this.agendaEventShow2230 = false;
        // Display control variables, Column 2
        this.agendaEventShowC20700 = false;
        this.agendaEventShowC20730 = false;
        this.agendaEventShowC20800 = false;
        this.agendaEventShowC20830 = false;
        this.agendaEventShowC20900 = false;
        this.agendaEventShowC20930 = false;
        this.agendaEventShowC21000 = false;
        this.agendaEventShowC21030 = false;
        this.agendaEventShowC21100 = false;
        this.agendaEventShowC21130 = false;
        this.agendaEventShowC21200 = false;
        this.agendaEventShowC21230 = false;
        this.agendaEventShowC21300 = false;
        this.agendaEventShowC21330 = false;
        this.agendaEventShowC21400 = false;
        this.agendaEventShowC21430 = false;
        this.agendaEventShowC21500 = false;
        this.agendaEventShowC21530 = false;
        this.agendaEventShowC21600 = false;
        this.agendaEventShowC21630 = false;
        this.agendaEventShowC21700 = false;
        this.agendaEventShowC21730 = false;
        this.agendaEventShowC21800 = false;
        this.agendaEventShowC21830 = false;
        this.agendaEventShowC21900 = false;
        this.agendaEventShowC21930 = false;
        this.agendaEventShowC22000 = false;
        this.agendaEventShowC22030 = false;
        this.agendaEventShowC22200 = false;
        this.agendaEventShowC22230 = false;
        this.agendaEventShowC22300 = false;
        this.agendaEventShowC22330 = false;
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
        this.AllDayLeft = true;
        this.AllDayRight = true;
        // Wide Column data placeholders
        this.agendaEventTitleW0700 = "";
        this.agendaEventTitleW0730 = "";
        this.agendaEventTitleW0800 = "";
        this.agendaEventTitleW0830 = "";
        this.agendaEventTitleW0900 = "";
        this.agendaEventTitleW0930 = "";
        this.agendaEventTitleW1000 = "";
        this.agendaEventTitleW1030 = "";
        this.agendaEventTitleW1100 = "";
        this.agendaEventTitleW1130 = "";
        this.agendaEventTitleW1200 = "";
        this.agendaEventTitleW1230 = "";
        this.agendaEventTitleW1300 = "";
        this.agendaEventTitleW1330 = "";
        this.agendaEventTitleW1400 = "";
        this.agendaEventTitleW1430 = "";
        this.agendaEventTitleW1500 = "";
        this.agendaEventTitleW1530 = "";
        this.agendaEventTitleW1600 = "";
        this.agendaEventTitleW1630 = "";
        this.agendaEventTitleW1700 = "";
        this.agendaEventTitleW1730 = "";
        this.agendaEventTitleW1800 = "";
        this.agendaEventTitleW1830 = "";
        this.agendaEventTitleW1900 = "";
        this.agendaEventTitleW1930 = "";
        this.agendaEventTitleW2000 = "";
        this.agendaEventTitleW2030 = "";
        this.agendaEventTitleW2100 = "";
        this.agendaEventTitleW2130 = "";
        this.agendaEventTitleW2200 = "";
        this.agendaEventTitleW2230 = "";
        this.agendaEventTitleW2300 = "";
        this.agendaEventTitleW2330 = "";
        this.agendaEventTitleW2400 = "";
        this.agendaEventTitleW2430 = "";
        this.agendaLocationW0700 = "";
        this.agendaLocationW0730 = "";
        this.agendaLocationW0800 = "";
        this.agendaLocationW0830 = "";
        this.agendaLocationW0900 = "";
        this.agendaLocationW0930 = "";
        this.agendaLocationW1000 = "";
        this.agendaLocationW1030 = "";
        this.agendaLocationW1100 = "";
        this.agendaLocationW1130 = "";
        this.agendaLocationW1200 = "";
        this.agendaLocationW1230 = "";
        this.agendaLocationW1300 = "";
        this.agendaLocationW1330 = "";
        this.agendaLocationW1400 = "";
        this.agendaLocationW1430 = "";
        this.agendaLocationW1500 = "";
        this.agendaLocationW1530 = "";
        this.agendaLocationW1600 = "";
        this.agendaLocationW1630 = "";
        this.agendaLocationW1700 = "";
        this.agendaLocationW1730 = "";
        this.agendaLocationW1800 = "";
        this.agendaLocationW1830 = "";
        this.agendaLocationW1900 = "";
        this.agendaLocationW1930 = "";
        this.agendaLocationW2000 = "";
        this.agendaLocationW2030 = "";
        this.agendaLocationW2100 = "";
        this.agendaLocationW2130 = "";
        this.agendaLocationW2200 = "";
        this.agendaLocationW2230 = "";
        this.agendaLocationW2300 = "";
        this.agendaLocationW2330 = "";
        this.agendaLocationW2400 = "";
        this.agendaLocationW2430 = "";
        this.agendaStatusW0700 = "";
        this.agendaStatusW0730 = "";
        this.agendaStatusW0800 = "";
        this.agendaStatusW0830 = "";
        this.agendaStatusW0900 = "";
        this.agendaStatusW0930 = "";
        this.agendaStatusW1000 = "";
        this.agendaStatusW1030 = "";
        this.agendaStatusW1100 = "";
        this.agendaStatusW1130 = "";
        this.agendaStatusW1200 = "";
        this.agendaStatusW1230 = "";
        this.agendaStatusW1300 = "";
        this.agendaStatusW1330 = "";
        this.agendaStatusW1400 = "";
        this.agendaStatusW1430 = "";
        this.agendaStatusW1500 = "";
        this.agendaStatusW1530 = "";
        this.agendaStatusW1600 = "";
        this.agendaStatusW1630 = "";
        this.agendaStatusW1700 = "";
        this.agendaStatusW1730 = "";
        this.agendaStatusW1800 = "";
        this.agendaStatusW1830 = "";
        this.agendaStatusW1900 = "";
        this.agendaStatusW1930 = "";
        this.agendaStatusW2000 = "";
        this.agendaStatusW2030 = "";
        this.agendaStatusW2100 = "";
        this.agendaStatusW2130 = "";
        this.agendaStatusW2200 = "";
        this.agendaStatusW2230 = "";
        this.agendaStatusW2300 = "";
        this.agendaStatusW2330 = "";
        this.agendaStatusW2400 = "";
        this.agendaStatusW2430 = "";
        this.agendaStatusStyleW0700 = "";
        this.agendaStatusStyleW0730 = "";
        this.agendaStatusStyleW0800 = "";
        this.agendaStatusStyleW0830 = "";
        this.agendaStatusStyleW0900 = "";
        this.agendaStatusStyleW0930 = "";
        this.agendaStatusStyleW1000 = "";
        this.agendaStatusStyleW1030 = "";
        this.agendaStatusStyleW1100 = "";
        this.agendaStatusStyleW1130 = "";
        this.agendaStatusStyleW1200 = "";
        this.agendaStatusStyleW1230 = "";
        this.agendaStatusStyleW1300 = "";
        this.agendaStatusStyleW1330 = "";
        this.agendaStatusStyleW1400 = "";
        this.agendaStatusStyleW1430 = "";
        this.agendaStatusStyleW1500 = "";
        this.agendaStatusStyleW1530 = "";
        this.agendaStatusStyleW1600 = "";
        this.agendaStatusStyleW1630 = "";
        this.agendaStatusStyleW1700 = "";
        this.agendaStatusStyleW1730 = "";
        this.agendaStatusStyleW1800 = "";
        this.agendaStatusStyleW1830 = "";
        this.agendaStatusStyleW1900 = "";
        this.agendaStatusStyleW1930 = "";
        this.agendaStatusStyleW2000 = "";
        this.agendaStatusStyleW2030 = "";
        this.agendaStatusStyleW2100 = "";
        this.agendaStatusStyleW2130 = "";
        this.agendaStatusStyleW2200 = "";
        this.agendaStatusStyleW2230 = "";
        this.agendaStatusStyleW2300 = "";
        this.agendaStatusStyleW2330 = "";
        this.agendaStatusStyleW2400 = "";
        this.agendaStatusStyleW2430 = "";
        this.agendaEventClassW0700 = "";
        this.agendaEventClassW0730 = "";
        this.agendaEventClassW0800 = "";
        this.agendaEventClassW0830 = "";
        this.agendaEventClassW0900 = "";
        this.agendaEventClassW0930 = "";
        this.agendaEventClassW1000 = "";
        this.agendaEventClassW1030 = "";
        this.agendaEventClassW1100 = "";
        this.agendaEventClassW1130 = "";
        this.agendaEventClassW1200 = "";
        this.agendaEventClassW1230 = "";
        this.agendaEventClassW1300 = "";
        this.agendaEventClassW1330 = "";
        this.agendaEventClassW1400 = "";
        this.agendaEventClassW1430 = "";
        this.agendaEventClassW1500 = "";
        this.agendaEventClassW1530 = "";
        this.agendaEventClassW1600 = "";
        this.agendaEventClassW1630 = "";
        this.agendaEventClassW1700 = "";
        this.agendaEventClassW1730 = "";
        this.agendaEventClassW1800 = "";
        this.agendaEventClassW1830 = "";
        this.agendaEventClassW1900 = "";
        this.agendaEventClassW1930 = "";
        this.agendaEventClassW2000 = "";
        this.agendaEventClassW2030 = "";
        this.agendaEventClassW2100 = "";
        this.agendaEventClassW2130 = "";
        this.agendaEventClassW2200 = "";
        this.agendaEventClassW2230 = "";
        this.agendaEventClassW2300 = "";
        this.agendaEventClassW2330 = "";
        this.agendaEventClassW2400 = "";
        this.agendaEventClassW2430 = "";
        this.agendaEventIDW0700 = "";
        this.agendaEventIDW0730 = "";
        this.agendaEventIDW0800 = "";
        this.agendaEventIDW0830 = "";
        this.agendaEventIDW0900 = "";
        this.agendaEventIDW0930 = "";
        this.agendaEventIDW1000 = "";
        this.agendaEventIDW1030 = "";
        this.agendaEventIDW1100 = "";
        this.agendaEventIDW1130 = "";
        this.agendaEventIDW1200 = "";
        this.agendaEventIDW1230 = "";
        this.agendaEventIDW1300 = "";
        this.agendaEventIDW1330 = "";
        this.agendaEventIDW1400 = "";
        this.agendaEventIDW1430 = "";
        this.agendaEventIDW1500 = "";
        this.agendaEventIDW1530 = "";
        this.agendaEventIDW1600 = "";
        this.agendaEventIDW1630 = "";
        this.agendaEventIDW1700 = "";
        this.agendaEventIDW1730 = "";
        this.agendaEventIDW1800 = "";
        this.agendaEventIDW1830 = "";
        this.agendaEventIDW1900 = "";
        this.agendaEventIDW1930 = "";
        this.agendaEventIDW2000 = "";
        this.agendaEventIDW2030 = "";
        this.agendaEventIDW2100 = "";
        this.agendaEventIDW2130 = "";
        this.agendaEventIDW2200 = "";
        this.agendaEventIDW2230 = "";
        this.agendaEventIDW2300 = "";
        this.agendaEventIDW2330 = "";
        this.agendaEventIDW2400 = "";
        this.agendaEventIDW2430 = "";
        // Column 1 data placeholders
        this.agendaEventTitle0700 = "";
        this.agendaEventTitle0730 = "";
        this.agendaEventTitle0800 = "";
        this.agendaEventTitle0830 = "";
        this.agendaEventTitle0900 = "";
        this.agendaEventTitle0930 = "";
        this.agendaEventTitle1000 = "";
        this.agendaEventTitle1030 = "";
        this.agendaEventTitle1100 = "";
        this.agendaEventTitle1130 = "";
        this.agendaEventTitle1200 = "";
        this.agendaEventTitle1230 = "";
        this.agendaEventTitle1300 = "";
        this.agendaEventTitle1330 = "";
        this.agendaEventTitle1400 = "";
        this.agendaEventTitle1430 = "";
        this.agendaEventTitle1500 = "";
        this.agendaEventTitle1530 = "";
        this.agendaEventTitle1600 = "";
        this.agendaEventTitle1630 = "";
        this.agendaEventTitle1700 = "";
        this.agendaEventTitle1730 = "";
        this.agendaEventTitle1800 = "";
        this.agendaEventTitle1830 = "";
        this.agendaEventTitle1900 = "";
        this.agendaEventTitle1930 = "";
        this.agendaEventTitle2000 = "";
        this.agendaEventTitle2030 = "";
        this.agendaEventTitle2100 = "";
        this.agendaEventTitle2130 = "";
        this.agendaEventTitle2200 = "";
        this.agendaEventTitle2230 = "";
        this.agendaEventTitle2300 = "";
        this.agendaEventTitle2330 = "";
        this.agendaEventTitle2400 = "";
        this.agendaEventTitle2430 = "";
        this.agendaLocation0700 = "";
        this.agendaLocation0730 = "";
        this.agendaLocation0800 = "";
        this.agendaLocation0830 = "";
        this.agendaLocation0900 = "";
        this.agendaLocation0930 = "";
        this.agendaLocation1000 = "";
        this.agendaLocation1030 = "";
        this.agendaLocation1100 = "";
        this.agendaLocation1130 = "";
        this.agendaLocation1200 = "";
        this.agendaLocation1230 = "";
        this.agendaLocation1300 = "";
        this.agendaLocation1330 = "";
        this.agendaLocation1400 = "";
        this.agendaLocation1430 = "";
        this.agendaLocation1500 = "";
        this.agendaLocation1530 = "";
        this.agendaLocation1600 = "";
        this.agendaLocation1630 = "";
        this.agendaLocation1700 = "";
        this.agendaLocation1730 = "";
        this.agendaLocation1800 = "";
        this.agendaLocation1830 = "";
        this.agendaLocation1900 = "";
        this.agendaLocation1930 = "";
        this.agendaLocation2000 = "";
        this.agendaLocation2030 = "";
        this.agendaLocation2100 = "";
        this.agendaLocation2130 = "";
        this.agendaLocation2200 = "";
        this.agendaLocation2230 = "";
        this.agendaLocation2300 = "";
        this.agendaLocation2330 = "";
        this.agendaLocation2400 = "";
        this.agendaLocation2430 = "";
        this.agendaStatus0700 = "";
        this.agendaStatus0730 = "";
        this.agendaStatus0800 = "";
        this.agendaStatus0830 = "";
        this.agendaStatus0900 = "";
        this.agendaStatus0930 = "";
        this.agendaStatus1000 = "";
        this.agendaStatus1030 = "";
        this.agendaStatus1100 = "";
        this.agendaStatus1130 = "";
        this.agendaStatus1200 = "";
        this.agendaStatus1230 = "";
        this.agendaStatus1300 = "";
        this.agendaStatus1330 = "";
        this.agendaStatus1400 = "";
        this.agendaStatus1430 = "";
        this.agendaStatus1500 = "";
        this.agendaStatus1530 = "";
        this.agendaStatus1600 = "";
        this.agendaStatus1630 = "";
        this.agendaStatus1700 = "";
        this.agendaStatus1730 = "";
        this.agendaStatus1800 = "";
        this.agendaStatus1830 = "";
        this.agendaStatus1900 = "";
        this.agendaStatus1930 = "";
        this.agendaStatus2000 = "";
        this.agendaStatus2030 = "";
        this.agendaStatus2100 = "";
        this.agendaStatus2130 = "";
        this.agendaStatus2200 = "";
        this.agendaStatus2230 = "";
        this.agendaStatus2300 = "";
        this.agendaStatus2330 = "";
        this.agendaStatus2400 = "";
        this.agendaStatus2430 = "";
        this.agendaStatusStyle0700 = "";
        this.agendaStatusStyle0730 = "";
        this.agendaStatusStyle0800 = "";
        this.agendaStatusStyle0830 = "";
        this.agendaStatusStyle0900 = "";
        this.agendaStatusStyle0930 = "";
        this.agendaStatusStyle1000 = "";
        this.agendaStatusStyle1030 = "";
        this.agendaStatusStyle1100 = "";
        this.agendaStatusStyle1130 = "";
        this.agendaStatusStyle1200 = "";
        this.agendaStatusStyle1230 = "";
        this.agendaStatusStyle1300 = "";
        this.agendaStatusStyle1330 = "";
        this.agendaStatusStyle1400 = "";
        this.agendaStatusStyle1430 = "";
        this.agendaStatusStyle1500 = "";
        this.agendaStatusStyle1530 = "";
        this.agendaStatusStyle1600 = "";
        this.agendaStatusStyle1630 = "";
        this.agendaStatusStyle1700 = "";
        this.agendaStatusStyle1730 = "";
        this.agendaStatusStyle1800 = "";
        this.agendaStatusStyle1830 = "";
        this.agendaStatusStyle1900 = "";
        this.agendaStatusStyle1930 = "";
        this.agendaStatusStyle2000 = "";
        this.agendaStatusStyle2030 = "";
        this.agendaStatusStyle2100 = "";
        this.agendaStatusStyle2130 = "";
        this.agendaStatusStyle2200 = "";
        this.agendaStatusStyle2230 = "";
        this.agendaStatusStyle2300 = "";
        this.agendaStatusStyle2330 = "";
        this.agendaStatusStyle2400 = "";
        this.agendaStatusStyle2430 = "";
        this.agendaEventClass0700 = "";
        this.agendaEventClass0730 = "";
        this.agendaEventClass0800 = "";
        this.agendaEventClass0830 = "";
        this.agendaEventClass0900 = "";
        this.agendaEventClass0930 = "";
        this.agendaEventClass1000 = "";
        this.agendaEventClass1030 = "";
        this.agendaEventClass1100 = "";
        this.agendaEventClass1130 = "";
        this.agendaEventClass1200 = "";
        this.agendaEventClass1230 = "";
        this.agendaEventClass1300 = "";
        this.agendaEventClass1330 = "";
        this.agendaEventClass1400 = "";
        this.agendaEventClass1430 = "";
        this.agendaEventClass1500 = "";
        this.agendaEventClass1530 = "";
        this.agendaEventClass1600 = "";
        this.agendaEventClass1630 = "";
        this.agendaEventClass1700 = "";
        this.agendaEventClass1730 = "";
        this.agendaEventClass1800 = "";
        this.agendaEventClass1830 = "";
        this.agendaEventClass1900 = "";
        this.agendaEventClass1930 = "";
        this.agendaEventClass2000 = "";
        this.agendaEventClass2030 = "";
        this.agendaEventClass2100 = "";
        this.agendaEventClass2130 = "";
        this.agendaEventClass2200 = "";
        this.agendaEventClass2230 = "";
        this.agendaEventClass2300 = "";
        this.agendaEventClass2330 = "";
        this.agendaEventClass2400 = "";
        this.agendaEventClass2430 = "";
        this.agendaEventID0700 = "";
        this.agendaEventID0730 = "";
        this.agendaEventID0800 = "";
        this.agendaEventID0830 = "";
        this.agendaEventID0900 = "";
        this.agendaEventID0930 = "";
        this.agendaEventID1000 = "";
        this.agendaEventID1030 = "";
        this.agendaEventID1100 = "";
        this.agendaEventID1130 = "";
        this.agendaEventID1200 = "";
        this.agendaEventID1230 = "";
        this.agendaEventID1300 = "";
        this.agendaEventID1330 = "";
        this.agendaEventID1400 = "";
        this.agendaEventID1430 = "";
        this.agendaEventID1500 = "";
        this.agendaEventID1530 = "";
        this.agendaEventID1600 = "";
        this.agendaEventID1630 = "";
        this.agendaEventID1700 = "";
        this.agendaEventID1730 = "";
        this.agendaEventID1800 = "";
        this.agendaEventID1830 = "";
        this.agendaEventID1900 = "";
        this.agendaEventID1930 = "";
        this.agendaEventID2000 = "";
        this.agendaEventID2030 = "";
        this.agendaEventID2100 = "";
        this.agendaEventID2130 = "";
        this.agendaEventID2200 = "";
        this.agendaEventID2230 = "";
        this.agendaEventID2300 = "";
        this.agendaEventID2330 = "";
        this.agendaEventID2400 = "";
        this.agendaEventID2430 = "";
        // Column 2 data placeholders
        this.agendaEventTitleC20700 = "";
        this.agendaEventTitleC20730 = "";
        this.agendaEventTitleC20800 = "";
        this.agendaEventTitleC20830 = "";
        this.agendaEventTitleC20900 = "";
        this.agendaEventTitleC20930 = "";
        this.agendaEventTitleC21000 = "";
        this.agendaEventTitleC21030 = "";
        this.agendaEventTitleC21100 = "";
        this.agendaEventTitleC21130 = "";
        this.agendaEventTitleC21200 = "";
        this.agendaEventTitleC21230 = "";
        this.agendaEventTitleC21300 = "";
        this.agendaEventTitleC21330 = "";
        this.agendaEventTitleC21400 = "";
        this.agendaEventTitleC21430 = "";
        this.agendaEventTitleC21500 = "";
        this.agendaEventTitleC21530 = "";
        this.agendaEventTitleC21600 = "";
        this.agendaEventTitleC21630 = "";
        this.agendaEventTitleC21700 = "";
        this.agendaEventTitleC21730 = "";
        this.agendaEventTitleC21800 = "";
        this.agendaEventTitleC21830 = "";
        this.agendaEventTitleC21900 = "";
        this.agendaEventTitleC21930 = "";
        this.agendaEventTitleC22000 = "";
        this.agendaEventTitleC22030 = "";
        this.agendaEventTitleC22100 = "";
        this.agendaEventTitleC22130 = "";
        this.agendaEventTitleC22200 = "";
        this.agendaEventTitleC22230 = "";
        this.agendaEventTitleC22300 = "";
        this.agendaEventTitleC22330 = "";
        this.agendaEventTitleC22400 = "";
        this.agendaEventTitleC22430 = "";
        this.agendaLocationC20700 = "";
        this.agendaLocationC20730 = "";
        this.agendaLocationC20800 = "";
        this.agendaLocationC20830 = "";
        this.agendaLocationC20900 = "";
        this.agendaLocationC20930 = "";
        this.agendaLocationC21000 = "";
        this.agendaLocationC21030 = "";
        this.agendaLocationC21100 = "";
        this.agendaLocationC21130 = "";
        this.agendaLocationC21200 = "";
        this.agendaLocationC21230 = "";
        this.agendaLocationC21300 = "";
        this.agendaLocationC21330 = "";
        this.agendaLocationC21400 = "";
        this.agendaLocationC21430 = "";
        this.agendaLocationC21500 = "";
        this.agendaLocationC21530 = "";
        this.agendaLocationC21600 = "";
        this.agendaLocationC21630 = "";
        this.agendaLocationC21700 = "";
        this.agendaLocationC21730 = "";
        this.agendaLocationC21800 = "";
        this.agendaLocationC21830 = "";
        this.agendaLocationC21900 = "";
        this.agendaLocationC21930 = "";
        this.agendaLocationC22000 = "";
        this.agendaLocationC22030 = "";
        this.agendaLocationC22100 = "";
        this.agendaLocationC22130 = "";
        this.agendaLocationC22200 = "";
        this.agendaLocationC22230 = "";
        this.agendaLocationC22300 = "";
        this.agendaLocationC22330 = "";
        this.agendaLocationC22400 = "";
        this.agendaLocationC22430 = "";
        this.agendaStatusC20700 = "";
        this.agendaStatusC20730 = "";
        this.agendaStatusC20800 = "";
        this.agendaStatusC20830 = "";
        this.agendaStatusC20900 = "";
        this.agendaStatusC20930 = "";
        this.agendaStatusC21000 = "";
        this.agendaStatusC21030 = "";
        this.agendaStatusC21100 = "";
        this.agendaStatusC21130 = "";
        this.agendaStatusC21200 = "";
        this.agendaStatusC21230 = "";
        this.agendaStatusC21300 = "";
        this.agendaStatusC21330 = "";
        this.agendaStatusC21400 = "";
        this.agendaStatusC21430 = "";
        this.agendaStatusC21500 = "";
        this.agendaStatusC21530 = "";
        this.agendaStatusC21600 = "";
        this.agendaStatusC21630 = "";
        this.agendaStatusC21700 = "";
        this.agendaStatusC21730 = "";
        this.agendaStatusC21800 = "";
        this.agendaStatusC21830 = "";
        this.agendaStatusC21900 = "";
        this.agendaStatusC21930 = "";
        this.agendaStatusC22000 = "";
        this.agendaStatusC22030 = "";
        this.agendaStatusC22100 = "";
        this.agendaStatusC22130 = "";
        this.agendaStatusC22200 = "";
        this.agendaStatusC22230 = "";
        this.agendaStatusC22300 = "";
        this.agendaStatusC22330 = "";
        this.agendaStatusC22400 = "";
        this.agendaStatusC22430 = "";
        this.agendaStatusStyleC20700 = "";
        this.agendaStatusStyleC20730 = "";
        this.agendaStatusStyleC20800 = "";
        this.agendaStatusStyleC20830 = "";
        this.agendaStatusStyleC20900 = "";
        this.agendaStatusStyleC20930 = "";
        this.agendaStatusStyleC21000 = "";
        this.agendaStatusStyleC21030 = "";
        this.agendaStatusStyleC21100 = "";
        this.agendaStatusStyleC21130 = "";
        this.agendaStatusStyleC21200 = "";
        this.agendaStatusStyleC21230 = "";
        this.agendaStatusStyleC21300 = "";
        this.agendaStatusStyleC21330 = "";
        this.agendaStatusStyleC21400 = "";
        this.agendaStatusStyleC21430 = "";
        this.agendaStatusStyleC21500 = "";
        this.agendaStatusStyleC21530 = "";
        this.agendaStatusStyleC21600 = "";
        this.agendaStatusStyleC21630 = "";
        this.agendaStatusStyleC21700 = "";
        this.agendaStatusStyleC21730 = "";
        this.agendaStatusStyleC21800 = "";
        this.agendaStatusStyleC21830 = "";
        this.agendaStatusStyleC21900 = "";
        this.agendaStatusStyleC21930 = "";
        this.agendaStatusStyleC22000 = "";
        this.agendaStatusStyleC22030 = "";
        this.agendaStatusStyleC22100 = "";
        this.agendaStatusStyleC22130 = "";
        this.agendaStatusStyleC22200 = "";
        this.agendaStatusStyleC22230 = "";
        this.agendaStatusStyleC22300 = "";
        this.agendaStatusStyleC22330 = "";
        this.agendaStatusStyleC22400 = "";
        this.agendaStatusStyleC22430 = "";
        this.agendaEventClassC20700 = "";
        this.agendaEventClassC20730 = "";
        this.agendaEventClassC20800 = "";
        this.agendaEventClassC20830 = "";
        this.agendaEventClassC20900 = "";
        this.agendaEventClassC20930 = "";
        this.agendaEventClassC21000 = "";
        this.agendaEventClassC21030 = "";
        this.agendaEventClassC21100 = "";
        this.agendaEventClassC21130 = "";
        this.agendaEventClassC21200 = "";
        this.agendaEventClassC21230 = "";
        this.agendaEventClassC21300 = "";
        this.agendaEventClassC21330 = "";
        this.agendaEventClassC21400 = "";
        this.agendaEventClassC21430 = "";
        this.agendaEventClassC21500 = "";
        this.agendaEventClassC21530 = "";
        this.agendaEventClassC21600 = "";
        this.agendaEventClassC21630 = "";
        this.agendaEventClassC21700 = "";
        this.agendaEventClassC21730 = "";
        this.agendaEventClassC21800 = "";
        this.agendaEventClassC21830 = "";
        this.agendaEventClassC21900 = "";
        this.agendaEventClassC21930 = "";
        this.agendaEventClassC22000 = "";
        this.agendaEventClassC22030 = "";
        this.agendaEventClassC22100 = "";
        this.agendaEventClassC22130 = "";
        this.agendaEventClassC22200 = "";
        this.agendaEventClassC22230 = "";
        this.agendaEventClassC22300 = "";
        this.agendaEventClassC22330 = "";
        this.agendaEventClassC22400 = "";
        this.agendaEventClassC22430 = "";
        this.agendaEventIDC20700 = "";
        this.agendaEventIDC20730 = "";
        this.agendaEventIDC20800 = "";
        this.agendaEventIDC20830 = "";
        this.agendaEventIDC20900 = "";
        this.agendaEventIDC20930 = "";
        this.agendaEventIDC21000 = "";
        this.agendaEventIDC21030 = "";
        this.agendaEventIDC21100 = "";
        this.agendaEventIDC21130 = "";
        this.agendaEventIDC21200 = "";
        this.agendaEventIDC21230 = "";
        this.agendaEventIDC21300 = "";
        this.agendaEventIDC21330 = "";
        this.agendaEventIDC21400 = "";
        this.agendaEventIDC21430 = "";
        this.agendaEventIDC21500 = "";
        this.agendaEventIDC21530 = "";
        this.agendaEventIDC21600 = "";
        this.agendaEventIDC21630 = "";
        this.agendaEventIDC21700 = "";
        this.agendaEventIDC21730 = "";
        this.agendaEventIDC21800 = "";
        this.agendaEventIDC21830 = "";
        this.agendaEventIDC21900 = "";
        this.agendaEventIDC21930 = "";
        this.agendaEventIDC22000 = "";
        this.agendaEventIDC22030 = "";
        this.agendaEventIDC22100 = "";
        this.agendaEventIDC22130 = "";
        this.agendaEventIDC22200 = "";
        this.agendaEventIDC22230 = "";
        this.agendaEventIDC22300 = "";
        this.agendaEventIDC22330 = "";
        this.agendaEventIDC22400 = "";
        this.agendaEventIDC22430 = "";
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MyAgenda');
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: MyAgenda');
        // Load / refresh data when coming to this page
        this.LoadData();
    }
    ngOnInit() {
        this.AllDayLeft = false;
        this.AllDayRight = false;
        this.dayButton1 = "myButtonGreyBlue";
        this.dayButton2 = "myButtonGreyBlue";
        this.dayButton3 = "myButtonGreyBlue";
        this.dayButton4 = "myButtonGreyBlue";
        this.dayButton5 = "myButtonGreyBlue";
        var AgendaDays = this.localstorage.getLocalValue("AgendaDays");
        var AgendaDayButtonLabels = this.localstorage.getLocalValue("AgendaDayButtonLabels");
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
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
    }
    LoadData() {
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Show/Hide agenda item placeholders, wide column
        this.agendaEventShowW0700 = false;
        this.agendaEventShowW0730 = false;
        this.agendaEventShowW0800 = false;
        this.agendaEventShowW0830 = false;
        this.agendaEventShowW0900 = false;
        this.agendaEventShowW0930 = false;
        this.agendaEventShowW1000 = false;
        this.agendaEventShowW1030 = false;
        this.agendaEventShowW1100 = false;
        this.agendaEventShowW1130 = false;
        this.agendaEventShowW1200 = false;
        this.agendaEventShowW1230 = false;
        this.agendaEventShowW1300 = false;
        this.agendaEventShowW1330 = false;
        this.agendaEventShowW1400 = false;
        this.agendaEventShowW1430 = false;
        this.agendaEventShowW1500 = false;
        this.agendaEventShowW1530 = false;
        this.agendaEventShowW1600 = false;
        this.agendaEventShowW1630 = false;
        this.agendaEventShowW1700 = false;
        this.agendaEventShowW1730 = false;
        this.agendaEventShowW1800 = false;
        this.agendaEventShowW1830 = false;
        this.agendaEventShowW1900 = false;
        this.agendaEventShowW1930 = false;
        this.agendaEventShowW2000 = false;
        this.agendaEventShowW2030 = false;
        this.agendaEventShowW2100 = false;
        this.agendaEventShowW2130 = false;
        this.agendaEventShowW2200 = false;
        this.agendaEventShowW2230 = false;
        // Show/Hide agenda item placeholders, column 1
        this.agendaEventShow0700 = false;
        this.agendaEventShow0730 = false;
        this.agendaEventShow0800 = false;
        this.agendaEventShow0830 = false;
        this.agendaEventShow0900 = false;
        this.agendaEventShow0930 = false;
        this.agendaEventShow1000 = false;
        this.agendaEventShow1030 = false;
        this.agendaEventShow1100 = false;
        this.agendaEventShow1130 = false;
        this.agendaEventShow1200 = false;
        this.agendaEventShow1230 = false;
        this.agendaEventShow1300 = false;
        this.agendaEventShow1330 = false;
        this.agendaEventShow1400 = false;
        this.agendaEventShow1430 = false;
        this.agendaEventShow1500 = false;
        this.agendaEventShow1530 = false;
        this.agendaEventShow1600 = false;
        this.agendaEventShow1630 = false;
        this.agendaEventShow1700 = false;
        this.agendaEventShow1730 = false;
        this.agendaEventShow1800 = false;
        this.agendaEventShow1830 = false;
        this.agendaEventShow1900 = false;
        this.agendaEventShow1930 = false;
        this.agendaEventShow2000 = false;
        this.agendaEventShow2030 = false;
        this.agendaEventShow2100 = false;
        this.agendaEventShow2130 = false;
        this.agendaEventShow2200 = false;
        this.agendaEventShow2230 = false;
        // Show/Hide agenda item placeholders, column 2
        this.agendaEventShowC20700 = false;
        this.agendaEventShowC20730 = false;
        this.agendaEventShowC20800 = false;
        this.agendaEventShowC20830 = false;
        this.agendaEventShowC20900 = false;
        this.agendaEventShowC20930 = false;
        this.agendaEventShowC21000 = false;
        this.agendaEventShowC21030 = false;
        this.agendaEventShowC21100 = false;
        this.agendaEventShowC21130 = false;
        this.agendaEventShowC21200 = false;
        this.agendaEventShowC21230 = false;
        this.agendaEventShowC21300 = false;
        this.agendaEventShowC21330 = false;
        this.agendaEventShowC21400 = false;
        this.agendaEventShowC21430 = false;
        this.agendaEventShowC21500 = false;
        this.agendaEventShowC21530 = false;
        this.agendaEventShowC21600 = false;
        this.agendaEventShowC21630 = false;
        this.agendaEventShowC21700 = false;
        this.agendaEventShowC21730 = false;
        this.agendaEventShowC21800 = false;
        this.agendaEventShowC21830 = false;
        this.agendaEventShowC21900 = false;
        this.agendaEventShowC21930 = false;
        this.agendaEventShowC22000 = false;
        this.agendaEventShowC22030 = false;
        this.agendaEventShowC22200 = false;
        this.agendaEventShowC22230 = false;
        this.agendaEventShowC22300 = false;
        this.agendaEventShowC22330 = false;
        var AgendaQueryDate = "";
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var AgendaDisplayDate = this.localstorage.getLocalValue('AgendaDisplayDate');
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
        var AgendaQueryDates = AgendaDates.split("|");
        this.dayButton1 = "myButtonGreyBlue";
        this.dayButton2 = "myButtonGreyBlue";
        this.dayButton3 = "myButtonGreyBlue";
        this.dayButton4 = "myButtonGreyBlue";
        this.dayButton5 = "myButtonGreyBlue";
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
        var d = new Date(AgendaDisplayDate);
        var flags = "";
        flags = "li|" + AgendaQueryDate;
        this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
            console.log("getAgendaData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                console.log(data['length'] + ' agenda items for ' + AgendaDisplayDate);
                //this.agendaitems = [];
                for (var i1 = 0; i1 < data['length']; i1++) {
                    var eventSTime = data[i1].EventStartTime;
                    var Sparts = eventSTime.split(':'), Starthour = Sparts[0], Startminutes = Sparts[1];
                    // Quarter hour adjustment
                    if (Startminutes == '15') {
                        Startminutes = '00';
                    }
                    if (Startminutes == '45') {
                        Startminutes = '00';
                        Starthour = parseInt(Starthour, 10) + 1;
                    }
                    var agendaStartTime = Starthour + Startminutes;
                    // Adjustment to ensure leading zero
                    agendaStartTime = '0' + agendaStartTime;
                    agendaStartTime = agendaStartTime.substr(-4);
                    var eventETime = data[i1].EventEndTime;
                    var Eparts = eventETime.split(':'), Endhour = Eparts[0], Endminutes = Eparts[1];
                    // Quarter hour adjustment
                    if (Endminutes == '15') {
                        Endminutes = '00';
                    }
                    if (Endminutes == '45') {
                        Endminutes = '00';
                        Endhour = parseInt(Endhour, 10) + 1;
                    }
                    var agendaEndTime = Endhour + Endminutes;
                    // Adjustment to ensure leading zero
                    agendaEndTime = '0' + agendaEndTime;
                    agendaEndTime = agendaEndTime.substr(-4);
                    var idEventTitle = "";
                    var idEventLocation = "";
                    var idEventStatus = "";
                    var idEventStatusStyle = "";
                    var idEventClass = "";
                    var idEventID = "";
                    var idEventShow = "";
                    var ColumnSelection = "";
                    // Status checks
                    var visSessionStatus = "";
                    var visStatusStyle = "SessionStatusNormal";
                    idEventClass = "agendaEventClass" + agendaStartTime;
                    idEventShow = "agendaEventShowW" + agendaStartTime;
                    if (!this[idEventShow]) {
                        // Wide Column
                        idEventTitle = "agendaEventTitleW" + agendaStartTime;
                        idEventLocation = "agendaLocationW" + agendaStartTime;
                        idEventStatus = "agendaStatusW" + agendaStartTime;
                        idEventStatusStyle = "agendaStatusStyleW" + agendaStartTime;
                        idEventClass = "agendaEventClassW" + agendaStartTime;
                        idEventID = "agendaEventIDW" + agendaStartTime;
                        idEventShow = "agendaEventShowW" + agendaStartTime;
                        ColumnSelection = "";
                        if (data[i1].EventName != null) {
                            this[idEventTitle] = data[i1].EventName;
                            this[idEventLocation] = data[i1].EventLocation;
                        }
                        else {
                            var tempTitle = "Meeting with ";
                            // If available, use Nickname field for First Name
                            if (data[i1].Nickname != "" && data[i1].Nickname != null) {
                                tempTitle = tempTitle + data[i1].Nickname;
                            }
                            else {
                                tempTitle = tempTitle + data[i1].FirstName;
                            }
                            tempTitle = tempTitle + " " + data[i1].LastName;
                            tempTitle = tempTitle + " (" + data[i1].Party.charAt(0) + " - " + data[i1].State + ")";
                            this[idEventTitle] = tempTitle;
                            this[idEventLocation] = data[i1].Address;
                        }
                        this[idEventStatus] = visSessionStatus;
                        this[idEventStatusStyle] = visStatusStyle;
                        this[idEventID] = "'" + data[i1].EventID + '|' + data[i1].itID + "'";
                        this[idEventShow] = true;
                        // Calculate course duration and use an appropriate card
                        var CalcstartDate = +new Date(0, 0, 0, Starthour, Startminutes);
                        var CalcendDate = +new Date(0, 0, 0, Endhour, Endminutes);
                        var millis = CalcendDate - CalcstartDate;
                        var minutes = millis / 1000 / 60;
                        if (data[i1].EventID != "0") {
                            if ((minutes >= 0) && (minutes <= 30)) {
                                this[idEventClass] = "myCard30" + ColumnSelection;
                            }
                            else if ((minutes > 30) && (minutes <= 60)) {
                                this[idEventClass] = "myCard60" + ColumnSelection;
                            }
                            else if ((minutes > 60) && (minutes <= 90)) {
                                this[idEventClass] = "myCard90" + ColumnSelection;
                            }
                            else if ((minutes > 90) && (minutes <= 120)) {
                                this[idEventClass] = "myCard120" + ColumnSelection;
                            }
                            else if ((minutes > 120) && (minutes <= 150)) {
                                this[idEventClass] = "myCard150" + ColumnSelection;
                            }
                            else if ((minutes > 150) && (minutes <= 180)) {
                                this[idEventClass] = "myCard180" + ColumnSelection;
                            }
                            else if ((minutes > 180) && (minutes <= 210)) {
                                this[idEventClass] = "myCard210" + ColumnSelection;
                            }
                            else if ((minutes > 210) && (minutes <= 240)) {
                                this[idEventClass] = "myCard240" + ColumnSelection;
                            }
                            else if ((minutes > 330) && (minutes <= 360)) {
                                this[idEventClass] = "myCard360" + ColumnSelection;
                            }
                            else {
                                this[idEventClass] = "myCard120" + ColumnSelection;
                            }
                            console.log(this[idEventClass] + ": " + data[i1].EventName);
                            console.log('Start: ' + agendaStartTime + ', End: ' + agendaEndTime);
                        }
                        else {
                            if ((minutes >= 0) && (minutes <= 30)) {
                                this[idEventClass] = "myCard30P" + ColumnSelection;
                            }
                            else if ((minutes > 30) && (minutes <= 60)) {
                                this[idEventClass] = "myCard60P" + ColumnSelection;
                            }
                            else if ((minutes > 60) && (minutes <= 90)) {
                                this[idEventClass] = "myCard90P" + ColumnSelection;
                            }
                            else if ((minutes > 90) && (minutes <= 120)) {
                                this[idEventClass] = "myCard120P" + ColumnSelection;
                            }
                            else if ((minutes > 120) && (minutes <= 150)) {
                                this[idEventClass] = "myCard150P" + ColumnSelection;
                            }
                            else if ((minutes > 150) && (minutes <= 180)) {
                                this[idEventClass] = "myCard180P" + ColumnSelection;
                            }
                            else if ((minutes > 180) && (minutes <= 210)) {
                                this[idEventClass] = "myCard210P" + ColumnSelection;
                            }
                            else if ((minutes > 210) && (minutes <= 240)) {
                                this[idEventClass] = "myCard240P" + ColumnSelection;
                            }
                            else if ((minutes > 330) && (minutes <= 360)) {
                                this[idEventClass] = "myCard360P" + ColumnSelection;
                            }
                            else {
                                this[idEventClass] = "myCard120P" + ColumnSelection;
                            }
                            console.log(this[idEventClass] + ": " + data[i1].EventName);
                            console.log('Start: ' + agendaStartTime + ', End: ' + agendaEndTime);
                        }
                        // Column 1
                        idEventTitle = "agendaEventTitle" + agendaStartTime;
                        idEventLocation = "agendaLocation" + agendaStartTime;
                        idEventStatus = "agendaStatus" + agendaStartTime;
                        idEventStatusStyle = "agendaStatusStyle" + agendaStartTime;
                        idEventClass = "agendaEventClass" + agendaStartTime;
                        idEventID = "agendaEventID" + agendaStartTime;
                        idEventShow = "agendaEventShow" + agendaStartTime;
                        if (data[i1].EventName != null) {
                            this[idEventTitle] = data[i1].EventName;
                            this[idEventLocation] = data[i1].EventLocation;
                        }
                        else {
                            var tempTitle = "Meeting with ";
                            // If available, use Nickname field for First Name
                            if (data[i1].Nickname != "" && data[i1].Nickname != null) {
                                tempTitle = tempTitle + data[i1].Nickname;
                            }
                            else {
                                tempTitle = tempTitle + data[i1].FirstName;
                            }
                            tempTitle = tempTitle + " " + data[i1].LastName;
                            tempTitle = tempTitle + " (" + data[i1].Party.charAt(0) + " - " + data[i1].State + ")";
                            this[idEventTitle] = tempTitle;
                            this[idEventLocation] = data[i1].Address;
                        }
                        this[idEventStatus] = visSessionStatus;
                        this[idEventStatusStyle] = visStatusStyle;
                        this[idEventID] = "'" + data[i1].EventID + '|' + data[i1].itID + "'";
                        // Calculate course duration and use an appropriate card
                        var CalcstartDate = +new Date(0, 0, 0, Starthour, Startminutes);
                        var CalcendDate = +new Date(0, 0, 0, Endhour, Endminutes);
                        var millis = CalcendDate - CalcstartDate;
                        var minutes = millis / 1000 / 60;
                        if (data[i1].EventID != "0") {
                            if ((minutes >= 0) && (minutes <= 30)) {
                                this[idEventClass] = "myCard30" + ColumnSelection;
                            }
                            else if ((minutes > 30) && (minutes <= 60)) {
                                this[idEventClass] = "myCard60" + ColumnSelection;
                            }
                            else if ((minutes > 60) && (minutes <= 90)) {
                                this[idEventClass] = "myCard90" + ColumnSelection;
                            }
                            else if ((minutes > 90) && (minutes <= 120)) {
                                this[idEventClass] = "myCard120" + ColumnSelection;
                            }
                            else if ((minutes > 120) && (minutes <= 150)) {
                                this[idEventClass] = "myCard150" + ColumnSelection;
                            }
                            else if ((minutes > 150) && (minutes <= 180)) {
                                this[idEventClass] = "myCard180" + ColumnSelection;
                            }
                            else if ((minutes > 180) && (minutes <= 210)) {
                                this[idEventClass] = "myCard210" + ColumnSelection;
                            }
                            else if ((minutes > 210) && (minutes <= 240)) {
                                this[idEventClass] = "myCard240" + ColumnSelection;
                            }
                            else if ((minutes > 330) && (minutes <= 360)) {
                                this[idEventClass] = "myCard360" + ColumnSelection;
                            }
                            else {
                                this[idEventClass] = "myCard120" + ColumnSelection;
                            }
                            console.log(this[idEventClass] + ": " + data[i1].EventName);
                            console.log('Start: ' + agendaStartTime + ', End: ' + agendaEndTime);
                        }
                        else {
                            if ((minutes >= 0) && (minutes <= 30)) {
                                this[idEventClass] = "myCard30P" + ColumnSelection;
                            }
                            else if ((minutes > 30) && (minutes <= 60)) {
                                this[idEventClass] = "myCard60P" + ColumnSelection;
                            }
                            else if ((minutes > 60) && (minutes <= 90)) {
                                this[idEventClass] = "myCard90P" + ColumnSelection;
                            }
                            else if ((minutes > 90) && (minutes <= 120)) {
                                this[idEventClass] = "myCard120P" + ColumnSelection;
                            }
                            else if ((minutes > 120) && (minutes <= 150)) {
                                this[idEventClass] = "myCard150P" + ColumnSelection;
                            }
                            else if ((minutes > 150) && (minutes <= 180)) {
                                this[idEventClass] = "myCard180P" + ColumnSelection;
                            }
                            else if ((minutes > 180) && (minutes <= 210)) {
                                this[idEventClass] = "myCard210P" + ColumnSelection;
                            }
                            else if ((minutes > 210) && (minutes <= 240)) {
                                this[idEventClass] = "myCard240P" + ColumnSelection;
                            }
                            else if ((minutes > 330) && (minutes <= 360)) {
                                this[idEventClass] = "myCard360P" + ColumnSelection;
                            }
                            else {
                                this[idEventClass] = "myCard120P" + ColumnSelection;
                            }
                            console.log(this[idEventClass] + ": " + data[i1].EventName);
                            console.log('Start: ' + agendaStartTime + ', End: ' + agendaEndTime);
                        }
                    }
                    else {
                        idEventTitle = "agendaEventTitleC2" + agendaStartTime;
                        idEventLocation = "agendaLocationC2" + agendaStartTime;
                        idEventStatus = "agendaStatusC2" + agendaStartTime;
                        idEventStatusStyle = "agendaStatusStyleC2" + agendaStartTime;
                        idEventClass = "agendaEventClassC2" + agendaStartTime;
                        idEventID = "agendaEventIDC2" + agendaStartTime;
                        idEventShow = "agendaEventShowC2" + agendaStartTime;
                        ColumnSelection = "C2";
                        if (data[i1].EventName != null) {
                            this[idEventTitle] = data[i1].EventName;
                            this[idEventLocation] = data[i1].EventLocation;
                        }
                        else {
                            var tempTitle = "Meeting with ";
                            // If available, use Nickname field for First Name
                            if (data[i1].Nickname != "" && data[i1].Nickname != null) {
                                tempTitle = tempTitle + data[i1].Nickname;
                            }
                            else {
                                tempTitle = tempTitle + data[i1].FirstName;
                            }
                            tempTitle = tempTitle + " " + data[i1].LastName;
                            tempTitle = tempTitle + " (" + data[i1].Party.charAt(0) + " - " + data[i1].State + ")";
                            this[idEventTitle] = tempTitle;
                            this[idEventLocation] = data[i1].Address;
                        }
                        this[idEventStatus] = visSessionStatus;
                        this[idEventStatusStyle] = visStatusStyle;
                        this[idEventID] = "'" + data[i1].EventID + '|' + data[i1].itID + "'";
                        this[idEventShow] = true;
                        // Calculate course duration and use an appropriate card
                        var CalcstartDate = +new Date(0, 0, 0, Starthour, Startminutes);
                        var CalcendDate = +new Date(0, 0, 0, Endhour, Endminutes);
                        var millis = CalcendDate - CalcstartDate;
                        var minutes = millis / 1000 / 60;
                        if (data[i1].EventID != "0") {
                            if ((minutes >= 0) && (minutes <= 30)) {
                                this[idEventClass] = "myCard30" + ColumnSelection;
                            }
                            else if ((minutes > 30) && (minutes <= 60)) {
                                this[idEventClass] = "myCard60" + ColumnSelection;
                            }
                            else if ((minutes > 60) && (minutes <= 90)) {
                                this[idEventClass] = "myCard90" + ColumnSelection;
                            }
                            else if ((minutes > 90) && (minutes <= 120)) {
                                this[idEventClass] = "myCard120" + ColumnSelection;
                            }
                            else if ((minutes > 120) && (minutes <= 150)) {
                                this[idEventClass] = "myCard150" + ColumnSelection;
                            }
                            else if ((minutes > 150) && (minutes <= 180)) {
                                this[idEventClass] = "myCard180" + ColumnSelection;
                            }
                            else if ((minutes > 180) && (minutes <= 210)) {
                                this[idEventClass] = "myCard210" + ColumnSelection;
                            }
                            else if ((minutes > 210) && (minutes <= 240)) {
                                this[idEventClass] = "myCard240" + ColumnSelection;
                            }
                            else if ((minutes > 330) && (minutes <= 360)) {
                                this[idEventClass] = "myCard360" + ColumnSelection;
                            }
                            else {
                                this[idEventClass] = "myCard120" + ColumnSelection;
                            }
                            console.log(this[idEventClass] + ": " + data[i1].EventName);
                            console.log('Start: ' + agendaStartTime + ', End: ' + agendaEndTime);
                        }
                        else {
                            if ((minutes >= 0) && (minutes <= 30)) {
                                this[idEventClass] = "myCard30P" + ColumnSelection;
                            }
                            else if ((minutes > 30) && (minutes <= 60)) {
                                this[idEventClass] = "myCard60P" + ColumnSelection;
                            }
                            else if ((minutes > 60) && (minutes <= 90)) {
                                this[idEventClass] = "myCard90P" + ColumnSelection;
                            }
                            else if ((minutes > 90) && (minutes <= 120)) {
                                this[idEventClass] = "myCard120P" + ColumnSelection;
                            }
                            else if ((minutes > 120) && (minutes <= 150)) {
                                this[idEventClass] = "myCard150P" + ColumnSelection;
                            }
                            else if ((minutes > 150) && (minutes <= 180)) {
                                this[idEventClass] = "myCard180P" + ColumnSelection;
                            }
                            else if ((minutes > 180) && (minutes <= 210)) {
                                this[idEventClass] = "myCard210P" + ColumnSelection;
                            }
                            else if ((minutes > 210) && (minutes <= 240)) {
                                this[idEventClass] = "myCard240P" + ColumnSelection;
                            }
                            else if ((minutes > 330) && (minutes <= 360)) {
                                this[idEventClass] = "myCard360P" + ColumnSelection;
                            }
                            else {
                                this[idEventClass] = "myCard120P" + ColumnSelection;
                            }
                            console.log(this[idEventClass] + ": " + data[i1].EventName);
                            console.log('Start: ' + agendaStartTime + ', End: ' + agendaEndTime);
                        }
                        // Switch from Wide Column to Column 1
                        idEventShow = "agendaEventShowW" + agendaStartTime;
                        this[idEventShow] = false;
                        idEventShow = "agendaEventShow" + agendaStartTime;
                        this[idEventShow] = true;
                    }
                }
            }
            this.cd.markForCheck();
            //loading.dismiss();
        }).catch(function () {
            console.log("Promise Rejected");
        });
    }
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
        this.LoadData();
    }
    ;
    GoMyAgendaFull(fab) {
        // Close fab buttons
        fab.close();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' });
    }
    ;
    AddPersonalEvent(fab) {
        // Close fab buttons
        fab.close();
        // Generate random number for personal event ID
        var min = Math.ceil(10000);
        var max = Math.floor(99999);
        var storePersonalEventID = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log('New personalID: ' + storePersonalEventID);
        // Set EventID to LocalStorage
        this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);
        // Navigate to Personal Event page
        this.navCtrl.push('MyAgendaPersonal', { EventID: storePersonalEventID }, { animate: true, direction: 'forward' });
    }
    ;
    navViewFullAgenda() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' });
    }
    ;
    nav(EventID) {
        console.log("Btn ID: " + EventID);
        var IDSplit = EventID.split("|");
        var storeEventID = IDSplit[0].replace("'", "");
        var storePersonalEventID = IDSplit[1].replace("'", "");
        console.log("storeEventID: " + storeEventID);
        console.log("storePersonalEventID: " + storePersonalEventID);
        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        }
        else {
            if (storeEventID == "0") {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);
                // Navigate to Education Details page
                this.navCtrl.push('MyAgendaPersonal', { EventID: storePersonalEventID }, { animate: true, direction: 'forward' });
            }
            else {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('EventID', storeEventID);
                // Navigate to Education Details page
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: storeEventID }, { animate: true, direction: 'forward' });
            }
        }
    }
    ;
};
MyAgenda = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-myagenda',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/myagenda/myagenda.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>My Agenda</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content style="padding:0; margin:0">\n\n	<!-- Floating button menu for adding new comment -->\n    <ion-fab bottom right #fab>\n		<button ion-fab color="secondary" ion-fab>\n			<ion-icon name="add"></ion-icon>\n		</button>\n		<ion-fab-list side="top">\n			<button ion-fab (click)="AddPersonalEvent(fab)">\n				<ion-icon name="time"></ion-icon>\n				<div class="fabdivbutton">Personal Appt</div>\n			</button>\n			<button ion-fab (click)="GoMyAgendaFull(fab)">\n				<ion-icon name="calendar"></ion-icon>\n				<div class="fabdivbutton">Review Schedule</div>\n			</button>\n		</ion-fab-list>\n    </ion-fab>\n\n\n	<!-- Buttons in flexbox grid for date selection-->\n	<ion-grid style="padding:0; margin:0">\n		<ion-row>\n\n			<ion-col style="padding:0" *ngIf=DayButton1Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton1" (click)="DayUpdate(\'1\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton1Label}}</label>\n				</button>\n			</ion-col>\n			<ion-col style="padding:0" *ngIf=DayButton2Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton2" (click)="DayUpdate(\'2\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton2Label}}</label>\n				</button>\n			</ion-col>\n			\n			<ion-col style="padding:0" *ngIf=DayButton3Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton3" style="padding:0; margin:0" (click)="DayUpdate(\'3\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton3Label}}</label>\n				</button>\n			</ion-col>\n\n			<ion-col style="padding:0" *ngIf=DayButton4Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton4" style="padding:0; margin:0" (click)="DayUpdate(\'4\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton4Label}}</label>\n				</button>\n			</ion-col>\n			<ion-col style="padding:0" *ngIf=DayButton5Show>\n				<button ion-button full style="margin:0"[ngClass]="dayButton5" style="padding:0; margin:0" (click)="DayUpdate(\'5\')">\n						<ion-icon name="calendar"></ion-icon>\n						<label style="padding-left:3px">{{DayButton5Label}}</label>\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n\n	<!-- Announcement space at top of grid-->\n	<ion-grid>\n		<ion-row class="MyGridCellMargin">\n		  <ion-col col-2>All</ion-col>\n		  <ion-col col-10 class="myCard25" *ngIf="AllDayLeft" (click)="nav(\'201590029|0\')">\n		<div class="myRow">Registration Open</div>\n		  </ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				7:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW0700}}" *ngIf="agendaEventShowW0700" (click)="nav(agendaEventIDW0700)">\n				<div class="myRow">{{agendaEventTitleW0700}}</div>\n				<div class="myRow2">{{agendaLocationW0700}}</div>\n				<div [ngClass]="agendaStatusStyleW0700">{{agendaStatusW0700}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass0700}}" *ngIf="agendaEventShow0700" (click)="nav(agendaEventID0700)">\n				<div class="myRow">{{agendaEventTitle0700}}</div>\n				<div class="myRow2">{{agendaLocation0700}}</div>\n				<div [ngClass]="agendaStatusStyle0700">{{agendaStatus0700}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC20700}}" *ngIf="agendaEventShowC20700" (click)="nav(agendaEventIDC20700)">\n				<div class="myRow">{{agendaEventTitleC20700}}</div>\n				<div>{{agendaLocationC20700}}</div>\n				<div [ngClass]="agendaStatusStyleC20700">{{agendaStatusC20700}}</div>\n			</ion-col>\n		</ion-row>\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				7:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW0730}}" *ngIf="agendaEventShowW0730" (click)="nav(agendaEventIDW0730)">\n				<div class="myRow">{{agendaEventTitleW0730}}</div>\n				<div class="myRow2">{{agendaLocationW0730}}</div>\n				<div [ngClass]="agendaStatusStyleW0730">{{agendaStatusW0730}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass0730}}" *ngIf="agendaEventShow0730" (click)="nav(agendaEventID0730)">\n				<div class="myRow">{{agendaEventTitle0730}}</div>\n				<div class="myRow2">{{agendaLocation0730}}</div>\n				<div [ngClass]="agendaStatusStyle0730">{{agendaStatus0730}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC20730}}" *ngIf="agendaEventShowC20730" (click)="nav(agendaEventIDC20730)">\n				<div class="myRow">{{agendaEventTitleC20730}}</div>\n				<div class="myRow2">{{agendaLocationC20730}}</div>\n				<div [ngClass]="agendaStatusStyleC20730">{{agendaStatusC20730}}</div>\n			</ion-col>\n		</ion-row>\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				8:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW0800}}" *ngIf="agendaEventShowW0800" (click)="nav(agendaEventIDW0800)">\n				<div class="myRow">{{agendaEventTitleW0800}}</div>\n				<div class="myRow2">{{agendaLocationW0800}}</div>\n				<div [ngClass]="agendaStatusStyleW0800">{{agendaStatusW0800}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass0800}}" *ngIf="agendaEventShow0800" (click)="nav(agendaEventID0800)">\n				<div class="myRow">{{agendaEventTitle0800}}</div>\n				<div class="myRow2">{{agendaLocation0800}}</div>\n				<div [ngClass]="agendaStatusStyle0800">{{agendaStatus0800}}</div>\n			</ion-col>\n		\n			<ion-col col-5 class="{{agendaEventClassC20800}}" *ngIf="agendaEventShowC20800" (click)="nav(agendaEventIDC20800)">\n				<div class="myRow">{{agendaEventTitleC20800}}</div>\n				<div class="myRow2">{{agendaLocationC20800}}</div>\n				<div [ngClass]="agendaStatusStyleC20800">{{agendaStatusC20800}}</div>\n			</ion-col>\n		</ion-row>\n					\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				8:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW0830}}" *ngIf="agendaEventShowW0830" (click)="nav(agendaEventIDW0830)">\n				<div class="myRow">{{agendaEventTitleW0830}}</div>\n				<div class="myRow2">{{agendaLocationW0830}}</div>\n				<div [ngClass]="agendaStatusStyleW0830">{{agendaStatusW0830}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass0830}}" *ngIf="agendaEventShow0830" (click)="nav(agendaEventID0830)">\n				<div class="myRow">{{agendaEventTitle0830}}</div>\n				<div class="myRow2">{{agendaLocation0830}}</div>\n				<div [ngClass]="agendaStatusStyle0830">{{agendaStatus0830}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC20830}}" *ngIf="agendaEventShowC20830" (click)="nav(agendaEventIDC20830)">\n				<div class="myRow">{{agendaEventTitleC20830}}</div>\n				<div class="myRow2">{{agendaLocationC20830}}</div>\n				<div [ngClass]="agendaStatusStyleC20830">{{agendaStatusC20830}}</div>\n			</ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				9:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW0900}}" *ngIf="agendaEventShowW0900" (click)="nav(agendaEventIDW0900)">\n				<div class="myRow">{{agendaEventTitleW0900}}</div>\n				<div class="myRow2">{{agendaLocationW0900}}</div>\n				<div [ngClass]="agendaStatusStyleW0900">{{agendaStatusW0900}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass0900}}" *ngIf="agendaEventShow0900" (click)="nav(agendaEventID0900)">\n				<div class="myRow">{{agendaEventTitle0900}}</div>\n				<div class="myRow2">{{agendaLocation0900}}</div>\n				<div [ngClass]="agendaStatusStyle0900">{{agendaStatus0900}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC20900}}" *ngIf="agendaEventShowC20900" (click)="nav(agendaEventIDC20900)">\n				<div class="myRow">{{agendaEventTitleC20900}}</div>\n				<div class="myRow2">{{agendaLocationC20900}}</div>\n				<div [ngClass]="agendaStatusStyleC20900">{{agendaStatusC20900}}</div>\n			</ion-col>\n		</ion-row>\n\n								\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				9:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW0930}}" *ngIf="agendaEventShowW0930" (click)="nav(agendaEventIDW0930)">\n				<div class="myRow">{{agendaEventTitleW0930}}</div>\n				<div class="myRow2">{{agendaLocationW0930}}</div>\n				<div [ngClass]="agendaStatusStyleW0930">{{agendaStatusW0930}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass0930}}" *ngIf="agendaEventShow0930" (click)="nav(agendaEventID0930)">\n				<div class="myRow">{{agendaEventTitle0930}}</div>\n				<div class="myRow2">{{agendaLocationC20930}}</div>\n				<div [ngClass]="agendaStatusStyle0930">{{agendaStatus0930}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC20930}}" *ngIf="agendaEventShowC20930" (click)="nav(agendaEventIDC20930)">\n				<div class="myRow">{{agendaEventTitleC20930}}</div>\n				<div class="myRow2">{{agendaLocationC20930}}</div>\n				<div [ngClass]="agendaStatusStyleC20930">{{agendaStatusC20930}}</div>\n			</ion-col>\n		</ion-row>\n\n				\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				10:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1000}}" *ngIf="agendaEventShowW1000" (click)="nav(agendaEventIDW1000)">\n				<div class="myRow">{{agendaEventTitleW1000}}</div>\n				<div class="myRow2">{{agendaLocationW1000}}</div>\n				<div [ngClass]="agendaStatusStyleW1000">{{agendaStatusW1000}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1000}}" *ngIf="agendaEventShow1000" (click)="nav(agendaEventID1000)">\n				<div class="myRow">{{agendaEventTitle1000}}</div>\n				<div class="myRow2">{{agendaLocation1000}}</div>\n				<div [ngClass]="agendaStatusStyle1000">{{agendaStatus1000}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21000}}" *ngIf="agendaEventShowC21000" (click)="nav(agendaEventIDC21000)">\n				<div class="myRow">{{agendaEventTitleC21000}}</div>\n				<div class="myRow2">{{agendaLocationC21000}}</div>\n				<div [ngClass]="agendaStatusStyleC21000">{{agendaStatusC21000}}</div>\n			</ion-col>\n		</ion-row>\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				10:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1030}}" *ngIf="agendaEventShowW1030" (click)="nav(agendaEventIDW1030)">\n				<div class="myRow">{{agendaEventTitleW1030}}</div>\n				<div class="myRow2">{{agendaLocationW1030}}</div>\n				<div [ngClass]="agendaStatusStyleW1030">{{agendaStatusW1030}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1030}}" *ngIf="agendaEventShow1030" (click)="nav(agendaEventID1030)">\n				<div class="myRow">{{agendaEventTitle1030}}</div>\n				<div class="myRow2">{{agendaLocation1030}}</div>\n				<div [ngClass]="agendaStatusStyle1030">{{agendaStatus1030}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21030}}" *ngIf="agendaEventShowC21030" (click)="nav(agendaEventIDC21030)">\n				<div class="myRow">{{agendaEventTitleC21030}}</div>\n				<div class="myRow2">{{agendaLocationC21030}}</div>\n				<div [ngClass]="agendaStatusStyleC21030">{{agendaStatusC21030}}</div>\n			</ion-col>\n		</ion-row>				\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				11:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1100}}" *ngIf="agendaEventShowW1100" (click)="nav(agendaEventIDW1100)">\n				<div class="myRow">{{agendaEventTitleW1100}}</div>\n				<div class="myRow2">{{agendaLocationW1100}}</div>\n				<div [ngClass]="agendaStatusStyleW1100">{{agendaStatusW1100}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1100}}" *ngIf="agendaEventShow1100" (click)="nav(agendaEventID1100)">\n				<div class="myRow">{{agendaEventTitle1100}}</div>\n				<div class="myRow2">{{agendaLocation1100}}</div>\n				<div [ngClass]="agendaStatusStyle1100">{{agendaStatus1100}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC21100}}" *ngIf="agendaEventShowC21100" (click)="nav(agendaEventIDC21100)">\n				<div class="myRow">>{{agendaEventTitleC21100}}</div>\n				<div class="myRow2">{{agendaLocationC21100}}</div>\n				<div [ngClass]="agendaStatusStyleC21100">{{agendaStatusC21100}}</div>\n			</ion-col>\n		</ion-row>\n				\n	\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				11:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1130}}" *ngIf="agendaEventShowW1130" (click)="nav(agendaEventIDW1130)">\n				<div class="myRow">{{agendaEventTitleW1130}}</div>\n				<div class="myRow2">{{agendaLocationW1130}}</div>\n				<div [ngClass]="agendaStatusStyleW1130">{{agendaStatusW1130}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1130}}" *ngIf="agendaEventShow1130" (click)="nav(agendaEventID1130)">\n				<div class="myRow">{{agendaEventTitle1130}}</div>\n				<div class="myRow2">{{agendaLocation1130}}</div>\n				<div [ngClass]="agendaStatusStyle1130">{{agendaStatus1130}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21130}}" *ngIf="agendaEventShowC21130" (click)="nav(agendaEventIDC21130)">\n				<div class="myRow">{{agendaEventTitleC21130}}</div>\n				<div class="myRow2">{{agendaLocationC21130}}</div>\n				<div [ngClass]="agendaStatusStyleC21130">{{agendaStatusC21130}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				12:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1200}}" *ngIf="agendaEventShowW1200" (click)="nav(agendaEventIDW1200)">\n				<div class="myRow">{{agendaEventTitleW1200}}</div>\n				<div class="myRow2">{{agendaLocationW1200}}</div>\n				<div [ngClass]="agendaStatusStyleW1200">{{agendaStatusW1200}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1200}}" *ngIf="agendaEventShow1200" (click)="nav(agendaEventID1200)">\n				<div class="myRow">{{agendaEventTitle1200}}</div>\n				<div class="myRow2">{{agendaLocation1200}}</div>\n				<div [ngClass]="agendaStatusStyle1200">{{agendaStatus1200}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21200}}" *ngIf="agendaEventShowC21200" (click)="nav(agendaEventIDC21200)">\n				<div class="myRow">{{agendaEventTitleC21200}}</div>\n				<div class="myRow2">{{agendaLocationC21200}}</div>\n				<div [ngClass]="agendaStatusStyleC21200">{{agendaStatusC21200}}</div>\n			</ion-col>\n		</ion-row>\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				12:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1230}}" *ngIf="agendaEventShowW1230" (click)="nav(agendaEventIDW1230)">\n				<div class="myRow">{{agendaEventTitleW1230}}</div>\n				<div class="myRow2">{{agendaLocationW1230}}</div>\n				<div [ngClass]="agendaStatusStyleW1230">{{agendaStatusW1230}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1230}}" *ngIf="agendaEventShow1230" (click)="nav(agendaEventID1230)">\n				<div class="myRow">{{agendaEventTitle1230}}</div>\n				<div class="myRow2">{{agendaLocation1230}}</div>\n				<div [ngClass]="agendaStatusStyle1230">{{agendaStatus1230}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21230}}" *ngIf="agendaEventShowC21230" (click)="nav(agendaEventIDC21230)">\n				<div class="myRow">{{agendaEventTitleC21230}}</div>\n				<div class="myRow2">{{agendaLocationC21230}}</div>\n				<div [ngClass]="agendaStatusStyleC21230">{{agendaStatusC21230}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				1:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1300}}" *ngIf="agendaEventShowW1300" (click)="nav(agendaEventIDW1300)">\n				<div class="myRow">{{agendaEventTitleW1300}}</div>\n				<div class="myRow2">{{agendaLocationW1300}}</div>\n				<div [ngClass]="agendaStatusStyleW1300">{{agendaStatusW1300}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1300}}" *ngIf="agendaEventShow1300" (click)="nav(agendaEventID1300)">\n				<div class="myRow truncate">{{agendaEventTitle1300}}</div>\n				<div class="myRow2">{{agendaLocation1300}}</div>\n				<div [ngClass]="agendaStatusStyle1300">{{agendaStatus1300}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21300}}" *ngIf="agendaEventShowC21300" (click)="nav(agendaEventIDC21300)">\n				<div class="myRow">{{agendaEventTitleC21300}}</div>\n				<div class="myRow2">{{agendaLocationC21300}}</div>\n				<div [ngClass]="agendaStatusStyleC21300">{{agendaStatusC21300}}</div>\n			</ion-col>\n		</ion-row>\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				1:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1330}}" *ngIf="agendaEventShowW1330" (click)="nav(agendaEventIDW1330)">\n				<div class="myRow">{{agendaEventTitleW1330}}</div>\n				<div class="myRow2">{{agendaLocationW1330}}</div>\n				<div [ngClass]="agendaStatusStyleW1330">{{agendaStatusW1330}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1330}}" *ngIf="agendaEventShow1330" (click)="nav(agendaEventID1330)">\n				<div class="myRow">{{agendaEventTitle1330}}</div>\n				<div class="myRow2">{{agendaLocation1330}}</div>\n				<div [ngClass]="agendaStatusStyle1330">{{agendaStatus1330}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC21330}}" *ngIf="agendaEventShowC21330" (click)="nav(agendaEventIDC21330)">\n				<div class="myRow">{{agendaEventTitleC21330}}</div>\n				<div class="myRow2">{{agendaLocationC21330}}</div>\n				<div [ngClass]="agendaStatusStyleC21330">{{agendaStatusC21330}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				2:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1400}}" *ngIf="agendaEventShowW1400" (click)="nav(agendaEventIDW1400)">\n				<div class="myRow">{{agendaEventTitleW1400}}</div>\n				<div class="myRow2">{{agendaLocationW1400}}</div>\n				<div [ngClass]="agendaStatusStyleW1400">{{agendaStatusW1400}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1400}}" *ngIf="agendaEventShow1400" (click)="nav(agendaEventID1400)">\n				<div class="myRow truncate">{{agendaEventTitle1400}}</div>\n				<div class="myRow2">{{agendaLocation1400}}</div>\n				<div [ngClass]="agendaStatusStyle1400">{{agendaStatus1400}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21400}}" *ngIf="agendaEventShowC21400" (click)="nav(agendaEventIDC21400)">\n				<div class="myRow">{{agendaEventTitleC21400}}</div>\n				<div class="myRow2">{{agendaLocationC21400}}</div>\n				<div [ngClass]="agendaStatusStyleC21400">{{agendaStatusC21400}}</div>\n			</ion-col>\n		</ion-row>\n		\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				2:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1430}}" *ngIf="agendaEventShowW1430" (click)="nav(agendaEventIDW1430)">\n				<div class="myRow">{{agendaEventTitleW1430}}</div>\n				<div class="myRow2">{{agendaLocationW1430}}</div>\n				<div [ngClass]="agendaStatusStyleW1430">{{agendaStatusW1430}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1430}}" *ngIf="agendaEventShow1430" (click)="nav(agendaEventID1430)">\n				<div class="myRow">{{agendaEventTitle1430}}</div>\n				<div class="myRow2">{{agendaLocation1430}}</div>\n				<div [ngClass]="agendaStatusStyle1430">{{agendaStatus1430}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC21430}}" *ngIf="agendaEventShowC21430" (click)="nav(agendaEventIDC21430)">\n				<div class="myRow">{{agendaEventTitleC21430}}</div>\n				<div class="myRow2">{{agendaLocationC21430}}</div>\n				<div [ngClass]="agendaStatusStyleC21430">{{agendaStatusC21430}}</div>\n			</ion-col>\n		</ion-row>	\n				\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				3:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1500}}" *ngIf="agendaEventShowW1500" (click)="nav(agendaEventIDW1500)">\n				<div class="myRow">{{agendaEventTitleW1500}}</div>\n				<div class="myRow2">{{agendaLocationW1500}}</div>\n				<div [ngClass]="agendaStatusStyleW1500">{{agendaStatusW1500}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1500}}" *ngIf="agendaEventShow1500" (click)="nav(agendaEventID1500)">\n				<div class="myRow">{{agendaEventTitle1500}}</div>\n				<div class="myRow2">{{agendaLocation1500}}</div>\n				<div [ngClass]="agendaStatusStyle1500">{{agendaStatus1500}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC21500}}" *ngIf="agendaEventShowC21500" (click)="nav(agendaEventIDC21500)">\n				<div class="myRow">{{agendaEventTitleC21500}}</div>\n				<div class="myRow2">{{agendaLocationC21500}}</div>\n				<div [ngClass]="agendaStatusStyleC21500">{{agendaStatusC21500}}</div>\n			</ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				3:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1530}}" *ngIf="agendaEventShowW1530" (click)="nav(agendaEventIDW1530)">\n				<div class="myRow">{{agendaEventTitleW1530}}</div>\n				<div class="myRow2">{{agendaLocationW1530}}</div>\n				<div [ngClass]="agendaStatusStyleW1530">{{agendaStatusW1530}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1530}}" *ngIf="agendaEventShow1530" (click)="nav(agendaEventID1530)">\n				<div class="myRow">{{agendaEventTitle1530}}</div>\n				<div class="myRow2">{{agendaLocation1530}}</div>\n				<div [ngClass]="agendaStatusStyle1530">{{agendaStatus1530}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21530}}" *ngIf="agendaEventShowC21530" (click)="nav(agendaEventIDC21530)">\n				<div class="myRow">{{agendaEventTitleC21530}}</div>\n				<div class="myRow2">{{agendaLocationC21530}}</div>\n				<div [ngClass]="agendaStatusStyleC21530">{{agendaStatusC21530}}</div>\n			</ion-col>\n		</ion-row>	\n						\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				4:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1600}}" *ngIf="agendaEventShowW1600" (click)="nav(agendaEventIDW1600)">\n				<div class="myRow">{{agendaEventTitleW1600}}</div>\n				<div class="myRow2">{{agendaLocationW1600}}</div>\n				<div [ngClass]="agendaStatusStyleW1600">{{agendaStatusW1600}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1600}}" *ngIf="agendaEventShow1600" (click)="nav(agendaEventID1600)">\n				<div class="myRow">{{agendaEventTitle1600}}</div>\n				<div class="myRow2">{{agendaLocation1600}}</div>\n				<div [ngClass]="agendaStatusStyle1600">{{agendaStatus1600}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21600}}" *ngIf="agendaEventShowC21600" (click)="nav(agendaEventIDC21600)">\n				<div class="myRow">{{agendaEventTitleC21600}}</div>\n				<div class="myRow2">{{agendaLocationC21600}}</div>\n				<div [ngClass]="agendaStatusStyleC21600">{{agendaStatusC21600}}</div>\n			</ion-col>\n		</ion-row>\n				\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				4:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1630}}" *ngIf="agendaEventShowW1630" (click)="nav(agendaEventIDW1630)">\n				<div class="myRow">{{agendaEventTitleW1630}}</div>\n				<div class="myRow2">{{agendaLocationW1630}}</div>\n				<div [ngClass]="agendaStatusStyleW1630">{{agendaStatusW1630}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1630}}" *ngIf="agendaEventShow1630" (click)="nav(agendaEventID1630)">\n				<div class="myRow">{{agendaEventTitle1630}}</div>\n				<div class="myRow2">{{agendaLocation1630}}</div>\n				<div [ngClass]="agendaStatusStyle1630">{{agendaStatus1630}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC21630}}" *ngIf="agendaEventShowC21630" (click)="nav(agendaEventIDC21630)">\n				<div class="myRow">{{agendaEventTitleC21630}}</div>\n				<div class="myRow2">{{agendaLocationC21630}}</div>\n				<div [ngClass]="agendaStatusStyleC21630">{{agendaStatusC21630}}</div>\n			</ion-col>\n		</ion-row>	\n						\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				5:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1700}}" *ngIf="agendaEventShowW1700" (click)="nav(agendaEventIDW1700)">\n				<div class="myRow">{{agendaEventTitleW1700}}</div>\n				<div class="myRow2">{{agendaLocationW1700}}</div>\n				<div [ngClass]="agendaStatusStyleW1700">{{agendaStatusW1700}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1700}}" *ngIf="agendaEventShow1700" (click)="nav(agendaEventID1700)">\n				<div class="myRow">{{agendaEventTitle1700}}</div>\n				<div class="myRow2">{{agendaLocation1700}}</div>\n				<div [ngClass]="agendaStatusStyle1700">{{agendaStatus1700}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21700}}" *ngIf="agendaEventShowC21700" (click)="nav(agendaEventIDC21700)">\n				<div class="myRow">{{agendaEventTitleC21700}}</div>\n				<div class="myRow2">{{agendaLocationC21700}}</div>\n				<div [ngClass]="agendaStatusStyleC21700">{{agendaStatusC21700}}</div>\n			</ion-col>\n		</ion-row>\n						\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				5:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1730}}" *ngIf="agendaEventShowW1730" (click)="nav(agendaEventIDW1730)">\n				<div class="myRow">{{agendaEventTitleW1730}}</div>\n				<div class="myRow2">{{agendaLocationW1730}}</div>\n				<div [ngClass]="agendaStatusStyleW1730">{{agendaStatusW1730}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1730}}" *ngIf="agendaEventShow1730" (click)="nav(agendaEventID1730)">\n				<div class="myRow">{{agendaEventTitle1730}}</div>\n				<div class="myRow2">{{agendaLocationC21730}}</div>\n				<div [ngClass]="agendaStatusStyle1730">{{agendaStatus1730}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21730}}" *ngIf="agendaEventShowC21730" (click)="nav(agendaEventIDC21730)">\n				<div class="myRow">{{agendaEventTitleC21730}}</div>\n				<div class="myRow2">{{agendaLocationC21730}}</div>\n				<div [ngClass]="agendaStatusStyleC21730">{{agendaStatusC21730}}</div>\n			</ion-col>\n		</ion-row>	\n								\n		\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				6:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1800}}" *ngIf="agendaEventShowW1800" (click)="nav(agendaEventIDW1800)">\n				<div class="myRow">{{agendaEventTitleW1800}}</div>\n				<div class="myRow2">{{agendaLocationW1800}}</div>\n				<div [ngClass]="agendaStatusStyleW1800">{{agendaStatusW1800}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1800}}" *ngIf="agendaEventShow1800" (click)="nav(agendaEventID1800)">\n				<div class="myRow">{{agendaEventTitle1800}}</div>\n				<div class="myRow2">{{agendaLocation1800}}</div>\n				<div [ngClass]="agendaStatusStyle1800">{{agendaStatus1800}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21800}}" *ngIf="agendaEventShowC21800" (click)="nav(agendaEventIDC21800)">\n				<div class="myRow">{{agendaEventTitleC21800}}</div>\n				<div class="myRow2">{{agendaLocationC21800}}</div>\n				<div [ngClass]="agendaStatusStyleC21800">{{agendaStatusC21800}}</div>\n			</ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				6:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1830}}" *ngIf="agendaEventShowW1830" (click)="nav(agendaEventIDW1830)">\n				<div class="myRow">{{agendaEventTitleW1830}}</div>\n				<div class="myRow2">{{agendaLocationW1830}}</div>\n				<div [ngClass]="agendaStatusStyleW1830">{{agendaStatusW1830}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1830}}" *ngIf="agendaEventShow1830" (click)="nav(agendaEventID1830)">\n				<div class="myRow">{{agendaEventTitle1830}}</div>\n				<div class="myRow2">{{agendaLocation1830}}</div>\n				<div [ngClass]="agendaStatusStyle1830">{{agendaStatus1830}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC21830}}" *ngIf="agendaEventShowC21830" (click)="nav(agendaEventIDC21830)">\n				<div class="myRow">{{agendaEventTitleC21830}}</div>\n				<div class="myRow2">{{agendaLocationC21830}}</div>\n				<div [ngClass]="agendaStatusStyleC21830">{{agendaStatusC21830}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				7:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1900}}" *ngIf="agendaEventShowW1900" (click)="nav(agendaEventIDW1900)">\n				<div class="myRow">{{agendaEventTitleW1900}}</div>\n				<div class="myRow2">{{agendaLocationW1900}}</div>\n				<div [ngClass]="agendaStatusStyleW1900">{{agendaStatusW1900}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1900}}" *ngIf="agendaEventShow1900" (click)="nav(agendaEventID1900)">\n				<div class="myRow">{{agendaEventTitle1900}}</div>\n				<div class="myRow2">{{agendaLocation1900}}</div>\n				<div [ngClass]="agendaStatusStyle1900">{{agendaStatus1900}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21900}}" *ngIf="agendaEventShowC21900" (click)="nav(agendaEventIDC21900)">\n				<div class="myRow">{{agendaEventTitleC21900}}</div>\n				<div class="myRow2">{{agendaLocationC21900}}</div>\n				<div [ngClass]="agendaStatusStyleC2700">{{agendaStatusC21900}}</div>\n			</ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				7:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW1930}}" *ngIf="agendaEventShowW1930" (click)="nav(agendaEventIDW1930)">\n				<div class="myRow">{{agendaEventTitleW1930}}</div>\n				<div class="myRow2">{{agendaLocationW1930}}</div>\n				<div [ngClass]="agendaStatusStyleW1930">{{agendaStatusW1930}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass1930}}" *ngIf="agendaEventShow1930" (click)="nav(agendaEventID1930)">\n				<div class="myRow">{{agendaEventTitle1930}}</div>\n				<div class="myRow2">{{agendaLocation1930}}</div>\n				<div [ngClass]="agendaStatusStyle1930">{{agendaStatus1930}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC21930}}" *ngIf="agendaEventShowC21930" (click)="nav(agendaEventIDC21930)">\n				<div class="myRow">{{agendaEventTitleC21930}}</div>\n				<div class="myRow2">{{agendaLocationC21930}}</div>\n				<div [ngClass]="agendaStatusStyleC21930">{{agendaStatusC21930}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				8:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2000}}" *ngIf="agendaEventShowW2000" (click)="nav(agendaEventIDW2000)">\n				<div class="myRow">{{agendaEventTitleW2000}}</div>\n				<div class="myRow2">{{agendaLocationW2000}}</div>\n				<div [ngClass]="agendaStatusStyleW2000">{{agendaStatusW2000}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2000}}" *ngIf="agendaEventShow2000" (click)="nav(agendaEventID2000)">\n				<div class="myRow">{{agendaEventTitle2000}}</div>\n				<div class="myRow2">{{agendaLocation2000}}</div>\n				<div [ngClass]="agendaStatusStyle2000">{{agendaStatus2000}}</div>\n			</ion-col>\n			\n			<ion-col col-5 class="{{agendaEventClassC22000}}" *ngIf="agendaEventShowC22000" (click)="nav(agendaEventIDC22000)">\n				<div class="myRow">{{agendaEventTitleC22000}}</div>\n				<div class="myRow2">{{agendaLocationC22000}}</div>\n				<div [ngClass]="agendaStatusStyleC22000">{{agendaStatusC22000}}</div>\n			</ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				8:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2030}}" *ngIf="agendaEventShowW2030" (click)="nav(agendaEventIDW2030)">\n				<div class="myRow">{{agendaEventTitleW2030}}</div>\n				<div class="myRow2">{{agendaLocationW2030}}</div>\n				<div [ngClass]="agendaStatusStyleW2030">{{agendaStatusW2030}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2030}}" *ngIf="agendaEventShow2030" (click)="nav(agendaEventID2030)">\n				<div class="myRow">{{agendaEventTitle2030}}</div>\n				<div class="myRow2">{{agendaLocation2030}}</div>\n				<div [ngClass]="agendaStatusStyle2030">{{agendaStatus2030}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22030}}" *ngIf="agendaEventShowC22030" (click)="nav(agendaEventIDC22030)">\n				<div class="myRow">{{agendaEventTitleC22030}}</div>\n				<div class="myRow2">{{agendaLocationC22030}}</div>\n				<div [ngClass]="agendaStatusStyleC22030">{{agendaStatusC22030}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				9:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2100}}" *ngIf="agendaEventShowW2100" (click)="nav(agendaEventIDW2100)">\n				<div class="myRow">{{agendaEventTitleW2100}}</div>\n				<div class="myRow2">{{agendaLocationW2100}}</div>\n				<div [ngClass]="agendaStatusStyleW2100">{{agendaStatusW2100}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2100}}" *ngIf="agendaEventShow2100" (click)="nav(agendaEventID2100)">\n				<div class="myRow">{{agendaEventTitle2100}}</div>\n				<div class="myRow2">{{agendaLocation2100}}</div>\n				<div [ngClass]="agendaStatusStyle2100">{{agendaStatus2100}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22100}}" *ngIf="agendaEventShowC22100" (click)="nav(agendaEventIDC22100)">\n				<div class="myRow">{{agendaEventTitleC22100}}</div>\n				<div class="myRow2">{{agendaLocationC22100}}</div>\n				<div [ngClass]="agendaStatusStyleC22100">{{agendaStatusC22100}}</div>\n			</ion-col>\n		</ion-row>\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				9:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2130}}" *ngIf="agendaEventShowW2130" (click)="nav(agendaEventIDW2130)">\n				<div class="myRow">{{agendaEventTitleW2130}}</div>\n				<div class="myRow2">{{agendaLocationW2130}}</div>\n				<div [ngClass]="agendaStatusStyleW2130">{{agendaStatusW2130}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2130}}" *ngIf="agendaEventShow2130" (click)="nav(agendaEventID2130)">\n				<div class="myRow">{{agendaEventTitle2130}}</div>\n				<div class="myRow2">{{agendaLocation2130}}</div>\n				<div [ngClass]="agendaStatusStyle2130">{{agendaStatus2130}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22130}}" *ngIf="agendaEventShowC22130" (click)="nav(agendaEventIDC22130)">\n				<div class="myRow">{{agendaEventTitleC22130}}</div>\n				<div class="myRow2">{{agendaLocationC22130}}</div>\n				<div [ngClass]="agendaStatusStyleC2130">{{agendaStatusC22130}}</div>\n			</ion-col>\n		</ion-row>	\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				10:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2200}}" *ngIf="agendaEventShowW2200" (click)="nav(agendaEventIDW2200)">\n				<div class="myRow">{{agendaEventTitleW2200}}</div>\n				<div class="myRow2">{{agendaLocationW2200}}</div>\n				<div [ngClass]="agendaStatusStyleW2200">{{agendaStatusW2200}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2200}}" *ngIf="agendaEventShow2200" (click)="nav(agendaEventID2200)">\n				<div class="myRow">{{agendaEventTitle2200}}</div>\n				<div class="myRow2">{{agendaLocation2200}}</div>\n				<div [ngClass]="agendaStatusStyle2200">{{agendaStatus2200}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22200}}" *ngIf="agendaEventShowC22200" (click)="nav(agendaEventIDC22200)">\n				<div class="myRow">{{agendaEventTitleC22200}}</div>\n				<div class="myRow2">{{agendaLocationC22200}}</div>\n				<div [ngClass]="agendaStatusStyleC22200">{{agendaStatusC22200}}</div>\n			</ion-col>\n		</ion-row>\n\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				10:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2230}}" *ngIf="agendaEventShowW2230" (click)="nav(agendaEventIDW2230)">\n				<div class="myRow">{{agendaEventTitleW2230}}</div>\n				<div class="myRow2">{{agendaLocationW2230}}</div>\n				<div [ngClass]="agendaStatusStyleW2230">{{agendaStatusW2230}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2230}}" *ngIf="agendaEventShow2230" (click)="nav(agendaEventID2230)">\n				<div class="myRow">{{agendaEventTitle2230}}</div>\n				<div class="myRow2">{{agendaLocation2230}}</div>\n				<div [ngClass]="agendaStatusStyle2230">{{agendaStatus2230}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22230}}" *ngIf="agendaEventShowC22230" (click)="nav(agendaEventIDC22230)">\n				<div class="myRow">{{agendaEventTitleC22230}}</div>\n				<div class="myRow2">{{agendaLocationC22230}}</div>\n				<div [ngClass]="agendaStatusStyleC22230">{{agendaStatusC22230}}</div>\n			</ion-col>\n		</ion-row>	\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				11:00\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2300}}" *ngIf="agendaEventShowW2300" (click)="nav(agendaEventIDW2300)">\n				<div class="myRow">{{agendaEventTitleW2300}}</div>\n				<div class="myRow2">{{agendaLocationW2300}}</div>\n				<div [ngClass]="agendaStatusStyleW2300">{{agendaStatusW2300}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2300}}" *ngIf="agendaEventShow2300" (click)="nav(agendaEventID2300)">\n				<div class="myRow">{{agendaEventTitle2300}}</div>\n				<div class="myRow2">{{agendaLocation2300}}</div>\n				<div [ngClass]="agendaStatusStyle2300">{{agendaStatus2300}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22300}}" *ngIf="agendaEventShowC22300" (click)="nav(agendaEventIDC22300)">\n				<div class="myRow">{{agendaEventTitleC22300}}</div>\n				<div class="myRow2">{{agendaLocationC22300}}</div>\n				<div [ngClass]="agendaStatusStyleC22300">{{agendaStatusC22300}}</div>\n			</ion-col>\n		</ion-row>													\n\n\n		<ion-row class="MyGridCellMargin">\n			<ion-col col-2>\n				11:30\n			</ion-col>\n\n			<ion-col col-10 class="{{agendaEventClassW2330}}" *ngIf="agendaEventShowW2330" (click)="nav(agendaEventIDW2330)">\n				<div class="myRow">{{agendaEventTitleW2330}}</div>\n				<div class="myRow2">{{agendaLocationW2330}}</div>\n				<div [ngClass]="agendaStatusStyleW2330">{{agendaStatusW2330}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClass2330}}" *ngIf="agendaEventShow2330" (click)="nav(agendaEventID2330)">\n				<div class="myRow">{{agendaEventTitle2330}}</div>\n				<div class="myRow2">{{agendaLocationC22330}}</div>\n				<div [ngClass]="agendaStatusStyle2330">{{agendaStatus2330}}</div>\n			</ion-col>\n\n			<ion-col col-5 class="{{agendaEventClassC22330}}" *ngIf="agendaEventShowC22330" (click)="nav(agendaEventIDC22330)">\n				<div class="myRow">{{agendaEventTitleC22330}}</div>\n				<div class="myRow2">{{agendaLocationC22330}}</div>\n				<div [ngClass]="agendaStatusStyleC22330">{{agendaStatusC22330}}</div>\n			</ion-col>\n		</ion-row>	\n\n	</ion-grid>\n\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/myagenda/myagenda.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], MyAgenda);

//# sourceMappingURL=myagenda.js.map

/***/ }),

/***/ 600:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 267,
	"./af.js": 267,
	"./ar": 268,
	"./ar-dz": 269,
	"./ar-dz.js": 269,
	"./ar-kw": 270,
	"./ar-kw.js": 270,
	"./ar-ly": 271,
	"./ar-ly.js": 271,
	"./ar-ma": 272,
	"./ar-ma.js": 272,
	"./ar-sa": 273,
	"./ar-sa.js": 273,
	"./ar-tn": 274,
	"./ar-tn.js": 274,
	"./ar.js": 268,
	"./az": 275,
	"./az.js": 275,
	"./be": 276,
	"./be.js": 276,
	"./bg": 277,
	"./bg.js": 277,
	"./bm": 278,
	"./bm.js": 278,
	"./bn": 279,
	"./bn.js": 279,
	"./bo": 280,
	"./bo.js": 280,
	"./br": 281,
	"./br.js": 281,
	"./bs": 282,
	"./bs.js": 282,
	"./ca": 283,
	"./ca.js": 283,
	"./cs": 284,
	"./cs.js": 284,
	"./cv": 285,
	"./cv.js": 285,
	"./cy": 286,
	"./cy.js": 286,
	"./da": 287,
	"./da.js": 287,
	"./de": 288,
	"./de-at": 289,
	"./de-at.js": 289,
	"./de-ch": 290,
	"./de-ch.js": 290,
	"./de.js": 288,
	"./dv": 291,
	"./dv.js": 291,
	"./el": 292,
	"./el.js": 292,
	"./en-au": 293,
	"./en-au.js": 293,
	"./en-ca": 294,
	"./en-ca.js": 294,
	"./en-gb": 295,
	"./en-gb.js": 295,
	"./en-ie": 296,
	"./en-ie.js": 296,
	"./en-il": 297,
	"./en-il.js": 297,
	"./en-nz": 298,
	"./en-nz.js": 298,
	"./eo": 299,
	"./eo.js": 299,
	"./es": 300,
	"./es-do": 301,
	"./es-do.js": 301,
	"./es-us": 302,
	"./es-us.js": 302,
	"./es.js": 300,
	"./et": 303,
	"./et.js": 303,
	"./eu": 304,
	"./eu.js": 304,
	"./fa": 305,
	"./fa.js": 305,
	"./fi": 306,
	"./fi.js": 306,
	"./fo": 307,
	"./fo.js": 307,
	"./fr": 308,
	"./fr-ca": 309,
	"./fr-ca.js": 309,
	"./fr-ch": 310,
	"./fr-ch.js": 310,
	"./fr.js": 308,
	"./fy": 311,
	"./fy.js": 311,
	"./gd": 312,
	"./gd.js": 312,
	"./gl": 313,
	"./gl.js": 313,
	"./gom-latn": 314,
	"./gom-latn.js": 314,
	"./gu": 315,
	"./gu.js": 315,
	"./he": 316,
	"./he.js": 316,
	"./hi": 317,
	"./hi.js": 317,
	"./hr": 318,
	"./hr.js": 318,
	"./hu": 319,
	"./hu.js": 319,
	"./hy-am": 320,
	"./hy-am.js": 320,
	"./id": 321,
	"./id.js": 321,
	"./is": 322,
	"./is.js": 322,
	"./it": 323,
	"./it.js": 323,
	"./ja": 324,
	"./ja.js": 324,
	"./jv": 325,
	"./jv.js": 325,
	"./ka": 326,
	"./ka.js": 326,
	"./kk": 327,
	"./kk.js": 327,
	"./km": 328,
	"./km.js": 328,
	"./kn": 329,
	"./kn.js": 329,
	"./ko": 330,
	"./ko.js": 330,
	"./ku": 331,
	"./ku.js": 331,
	"./ky": 332,
	"./ky.js": 332,
	"./lb": 333,
	"./lb.js": 333,
	"./lo": 334,
	"./lo.js": 334,
	"./lt": 335,
	"./lt.js": 335,
	"./lv": 336,
	"./lv.js": 336,
	"./me": 337,
	"./me.js": 337,
	"./mi": 338,
	"./mi.js": 338,
	"./mk": 339,
	"./mk.js": 339,
	"./ml": 340,
	"./ml.js": 340,
	"./mn": 341,
	"./mn.js": 341,
	"./mr": 342,
	"./mr.js": 342,
	"./ms": 343,
	"./ms-my": 344,
	"./ms-my.js": 344,
	"./ms.js": 343,
	"./mt": 345,
	"./mt.js": 345,
	"./my": 346,
	"./my.js": 346,
	"./nb": 347,
	"./nb.js": 347,
	"./ne": 348,
	"./ne.js": 348,
	"./nl": 349,
	"./nl-be": 350,
	"./nl-be.js": 350,
	"./nl.js": 349,
	"./nn": 351,
	"./nn.js": 351,
	"./pa-in": 352,
	"./pa-in.js": 352,
	"./pl": 353,
	"./pl.js": 353,
	"./pt": 354,
	"./pt-br": 355,
	"./pt-br.js": 355,
	"./pt.js": 354,
	"./ro": 356,
	"./ro.js": 356,
	"./ru": 357,
	"./ru.js": 357,
	"./sd": 358,
	"./sd.js": 358,
	"./se": 359,
	"./se.js": 359,
	"./si": 360,
	"./si.js": 360,
	"./sk": 361,
	"./sk.js": 361,
	"./sl": 362,
	"./sl.js": 362,
	"./sq": 363,
	"./sq.js": 363,
	"./sr": 364,
	"./sr-cyrl": 365,
	"./sr-cyrl.js": 365,
	"./sr.js": 364,
	"./ss": 366,
	"./ss.js": 366,
	"./sv": 367,
	"./sv.js": 367,
	"./sw": 368,
	"./sw.js": 368,
	"./ta": 369,
	"./ta.js": 369,
	"./te": 370,
	"./te.js": 370,
	"./tet": 371,
	"./tet.js": 371,
	"./tg": 372,
	"./tg.js": 372,
	"./th": 373,
	"./th.js": 373,
	"./tl-ph": 374,
	"./tl-ph.js": 374,
	"./tlh": 375,
	"./tlh.js": 375,
	"./tr": 376,
	"./tr.js": 376,
	"./tzl": 377,
	"./tzl.js": 377,
	"./tzm": 378,
	"./tzm-latn": 379,
	"./tzm-latn.js": 379,
	"./tzm.js": 378,
	"./ug-cn": 380,
	"./ug-cn.js": 380,
	"./uk": 381,
	"./uk.js": 381,
	"./ur": 382,
	"./ur.js": 382,
	"./uz": 383,
	"./uz-latn": 384,
	"./uz-latn.js": 384,
	"./uz.js": 383,
	"./vi": 385,
	"./vi.js": 385,
	"./x-pseudo": 386,
	"./x-pseudo.js": 386,
	"./yo": 387,
	"./yo.js": 387,
	"./zh-cn": 388,
	"./zh-cn.js": 388,
	"./zh-hk": 389,
	"./zh-hk.js": 389,
	"./zh-tw": 390,
	"./zh-tw.js": 390
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 600;

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EducationDetailsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_leaflet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__login_login__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__myagenda_myagenda__ = __webpack_require__(59);
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







// Pages


let EducationDetailsPage = class EducationDetailsPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, alertCtrl, events, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        // Control Buttons
        // Disabled per Lisa Bollenbach 2018-04-19
        this.btnAgendaManagement = false;
        this.btnNotes = true;
        this.btnPrint = true;
        // SubSection Control
        this.SpeakerHostShow = true;
        this.CorporateSupporterShow = true;
        this.AuthorsDisplay = false;
        this.AbstractDisplay = true;
        this.DescriptionDisplay = true;
        this.SubEventsDisplay = false;
        this.RecordingShow = true;
        this.HandoutShow = true;
        this.OtherInformationDisplay = true;
        this.MeetingLocationDisplay = true;
        this.SpeakerList = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad EducationDetailsPage');
    }
    ngOnInit() {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID == '' || AttendeeID == null) {
            AttendeeID = '0';
        }
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        //loading.present();
        // Blank and show loading info
        this.cd.markForCheck();
        // Temporary use variables
        var flags = "dt|0|Alpha|" + this.navParams.get('EventID');
        this.EventID = this.navParams.get('EventID');
        this.localstorage.setLocalValue('EventID', this.navParams.get('EventID'));
        // ---------------------
        // Get Education Details
        // ---------------------
        var PrimarySpeakerName = "";
        var SQLDate;
        var DisplayDateTime;
        var dbEventDateTime;
        var courseID = "";
        var UpdatedEventDescription;
        var UpdatedEventDescription2;
        var HandoutPDFName = "";
        console.log('Education Details, flags: ' + flags);
        // Get course detail record
        this.databaseprovider.getLectureData(flags, AttendeeID).then(data => {
            console.log("getLectureData: " + JSON.stringify(data));
            if (data['length'] > 0) {
                console.log("Educationa Details, begin parsing");
                PrimarySpeakerName = "";
                // Display start time
                console.log("Educationa Details, Display start time");
                dbEventDateTime = data[0].session_start_time.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                // Display end time
                console.log("Educationa Details, Display end time");
                dbEventDateTime = data[0].session_end_time.substring(0, 19);
                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                SQLDate = new Date(dbEventDateTime);
                DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                console.log("Educationa Details, Set primary speaker");
                if (data[0].primary_speaker == "") {
                    //PrimarySpeakerName = "No Assigned Primary Presenter";
                    PrimarySpeakerName = "";
                }
                else {
                    PrimarySpeakerName = data[0].primary_speaker;
                }
                console.log("Educationa Details, Set session title");
                this.EventName = data[0].session_title;
                //this.EventSubName = data[0].EventSubName;
                console.log("Educationa Details, Add room name");
                if (data[0].RoomName.length == 0) {
                    this.DisplayEventTimeDateLocation = DisplayDateTime;
                }
                else {
                    this.DisplayEventTimeDateLocation = DisplayDateTime + " in " + data[0].RoomName;
                }
                console.log("Educationa Details, Set speaker name");
                this.SpeakerDisplayName = PrimarySpeakerName;
                //this.EventTypeName = data[0].EventTypeName;
                console.log('Host: ' + data[0].speaker_host_emcee);
                if ((data[0].speaker_host_emcee === undefined) || (data[0].speaker_host_emcee === "") || (data[0].speaker_host_emcee === null)) {
                    this.SpeakerHostShow = false;
                }
                else {
                    this.SpeakerHostEmcee = data[0].speaker_host_emcee;
                }
                if ((data[0].corporate_supporter === undefined) || (data[0].corporate_supporter === "") || (data[0].corporate_supporter === null)) {
                    this.CorporateSupporterShow = false;
                }
                else {
                    this.EventCorporateSupporter = data[0].corporate_supporter;
                }
                UpdatedEventDescription2 = data[0].description;
                UpdatedEventDescription2 = UpdatedEventDescription2.replace(/\\/g, '');
                UpdatedEventDescription = UpdatedEventDescription2.replace("Educational Objectives:", "<br/><br/><b>Educational Objectives:</b>");
                UpdatedEventDescription = UpdatedEventDescription.replace("1.", "<br/>1.");
                UpdatedEventDescription = UpdatedEventDescription.replace("2.", "<br/>2.");
                UpdatedEventDescription = UpdatedEventDescription.replace("3.", "<br/>3.");
                UpdatedEventDescription = UpdatedEventDescription.replace("4.", "<br/>4.");
                UpdatedEventDescription = UpdatedEventDescription.replace("5.", "<br/>5.");
                UpdatedEventDescription = UpdatedEventDescription.replace("6.", "<br/>6.");
                UpdatedEventDescription = UpdatedEventDescription.replace("DISCLAIMER:", "<br/><br/><b>DISCLAIMER:</b>");
                UpdatedEventDescription = UpdatedEventDescription.replace("Learning Objectives:", "<br/><br/><b>Learning Objectives:</b>");
                this.sessionAbstract = UpdatedEventDescription;
                console.log("Abstract: " + UpdatedEventDescription);
                //this.EventID = data[0].session_id;
                console.log('db: ' + data[0].ce_credits_type);
                console.log('db: ' + data[0].course_id);
                console.log('db: ' + data[0].HandoutFilename);
                console.log('db: ' + data[0].type);
                HandoutPDFName = data[0].HandoutFilename + ".pdf";
                this.HandoutURL = "https://aacdmobile.convergence-us.com/aacdmobile/www/assets/Handouts/" + HandoutPDFName;
                this.HandoutFn = HandoutPDFName;
                courseID = data[0].course_id;
                this.localstorage.setLocalValue("PDFLink", data[0].course_id);
                // Values for Agenda Management
                this.localstorage.setLocalValue("AAOID", data[0].session_id);
                this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11, 19));
                this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11, 19));
                this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
                this.localstorage.setLocalValue("EventName", data[0].session_title);
                this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0, 10));
                if (data[0].ce_credits_type == "") {
                    this.AbstractDisplay = false;
                }
                else {
                    this.DescriptionDisplay = false;
                }
                if ((data[0].description === undefined) || (data[0].description === "") || (data[0].description === null)) {
                    this.AbstractDisplay = false;
                    this.DescriptionDisplay = false;
                }
                if (data[0].session_recording.trim() == "N") {
                    this.RecordingShow = false;
                }
                console.log('HandoutFilename: ' + HandoutPDFName);
                if (data[0].HandoutFilename === "" || data[0].HandoutFilename === null) {
                    this.HandoutShow = false;
                }
                if (data[0].OnAgenda != null) {
                    this.visAgendaAddRemoveButton = "Remove";
                }
                else {
                    this.visAgendaAddRemoveButton = "Add";
                }
                // Other Information grid
                this.vSubjectCode = data[0].subject;
                this.vCECredits = data[0].cs_credits;
                this.vCECreditsType = data[0].ce_credits_type;
                this.vSessionType = data[0].type;
                this.vSessionLevel = data[0].level;
                // Status checks
                var SessionStatus = "";
                var StatusStyle = "SessionStatusNormal";
                // Room Capacity check
                if (parseInt(data[0].room_capacity) <= parseInt(data[0].Attendees)) {
                    SessionStatus = "Course at Capacity";
                    StatusStyle = "SessionStatusRed";
                }
                // Waitlist check
                if (data[0].Waitlist == "1") {
                    if (SessionStatus == "") {
                        SessionStatus = "You are Waitlisted";
                        StatusStyle = "SessionStatusRed";
                    }
                    else {
                        SessionStatus = SessionStatus + " / You are Waitlisted";
                        StatusStyle = "SessionStatusRed";
                    }
                }
                console.log(SessionStatus);
                this.SessionStatusStyle = StatusStyle;
                this.SessionStatus = SessionStatus;
                // --------------------
                // Session room mapping
                // --------------------
                console.log('Meeting room mapping');
                var RoomX = data[0].RoomX;
                var RoomY = data[0].RoomY;
                console.log('Variables set');
                console.log('RoomX: ' + RoomX);
                console.log('RoomY: ' + RoomY);
                if (RoomX === null || RoomX == null || RoomY == undefined) {
                    RoomX = 0;
                    RoomY = 0;
                    var OfficeName = "Room: " + data[0].RoomName;
                }
                else {
                    //var FloorNumber = data[0].RoomNumber.charAt(0);
                    var OfficeName = "Room: " + data[0].RoomName;
                }
                // Override
                //RoomX = 10;
                //RoomY = 10;
                console.log('Meeting room mapping: Determine map type');
                console.log('RoomX: ' + RoomX);
                console.log('RoomY: ' + RoomY);
                if (RoomX == 0 || RoomY == 0) {
                    // Don't show the Locator block
                    this.MeetingLocationDisplay = false;
                    this.cd.markForCheck();
                    /*
                    // Show empty map
                    console.log('Meeting room mapping: Show empty map');
                    this.myMap = L.map('map2', {
                        crs: L.CRS.Simple,
                        minZoom: 0,
                        maxZoom: 2,
                        zoomControl: false
                    });

                    var bounds = L.latLngBounds([0, 0], [1500, 2000]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
                    var image = L.imageOverlay('assets/img/SessionRooms.png', bounds, {
                        attribution: 'Convergence'
                    }).addTo(this.myMap);

                    this.myMap.fitBounds(bounds);
                    this.myMap.setMaxBounds(bounds);
                    */
                }
                else {
                    this.MeetingLocationDisplay = true;
                    // Simple coordinate system mapping
                    console.log('Meeting room mapping: Simple coordinate system mapping');
                    this.myMap = __WEBPACK_IMPORTED_MODULE_6_leaflet__["map"]('map1', {
                        crs: __WEBPACK_IMPORTED_MODULE_6_leaflet__["CRS"].Simple,
                        minZoom: -2,
                        maxZoom: 0,
                        zoomControl: true
                    });
                    console.log('Meeting room mapping: Set bounds');
                    var bounds = __WEBPACK_IMPORTED_MODULE_6_leaflet__["latLngBounds"]([0, 0], [1500, 2000]);
                    console.log('Meeting room mapping: Add image');
                    var image = __WEBPACK_IMPORTED_MODULE_6_leaflet__["imageOverlay"]('assets/img/SessionRooms.png', bounds, {
                        attribution: 'Convergence'
                    }).addTo(this.myMap);
                    console.log('Meeting room mapping: Set Fit and max bounds');
                    this.myMap.fitBounds(bounds);
                    this.myMap.setMaxBounds(bounds);
                    console.log('Meeting room mapping: Set pindrop position');
                    var CongressionalOffice = __WEBPACK_IMPORTED_MODULE_6_leaflet__["latLng"]([RoomY, RoomX]);
                    console.log('Meeting room mapping: Display pindrop');
                    __WEBPACK_IMPORTED_MODULE_6_leaflet__["marker"](CongressionalOffice).addTo(this.myMap)
                        .bindPopup(OfficeName)
                        .openPopup();
                    console.log('Meeting room mapping: Center map on pindrop');
                    this.myMap.setView([RoomY, RoomX], 1);
                }
                this.cd.markForCheck();
                // ---------------------------
                // Get Linked Speakers
                // ---------------------------
                this.AuthorsDisplay = false;
                if (data[0].ce_credits_type == "") {
                    // Keep hidden for non-CE events
                    console.log('Non-CE event');
                    this.OtherInformationDisplay = false;
                    this.cd.markForCheck();
                    //loading.dismiss();
                }
                else {
                    console.log('Loading speakers');
                    flags = "cd|Alpha|0|0|" + courseID;
                    // Get speaker detail record
                    this.databaseprovider.getSpeakerData(flags, AttendeeID).then(data2 => {
                        console.log("getSpeakerData: " + JSON.stringify(data2));
                        if (data2['length'] > 0) {
                            // Process returned records to display
                            this.SpeakerList = [];
                            var DisplayName = "";
                            for (var i = 0; i < data2['length']; i++) {
                                DisplayName = "";
                                // Concatenate fields to build displayable name
                                DisplayName = DisplayName + data2[i].FirstName;
                                //if (resA.rows.item(i).MiddleInitial != "") {
                                //    DisplayName = DisplayName + " " + data2[i].MiddleInitial;
                                //}
                                DisplayName = DisplayName + " " + data2[i].LastName;
                                //if (data2[i].imis_designation != "" && data2[i].imis_designation != null) {
                                //    DisplayName = DisplayName + ", " + data2[i].imis_designation;
                                //}
                                //if (data2[i].Credentials != "") {
                                //	DisplayName = DisplayName + " " + data2[i].Credentials;
                                //}
                                //var imageAvatar = data2[i].imageFilename;
                                var imageAvatar = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Speakers/" + data2[i].imageFilename;
                                //imageAvatar = imageAvatar.substr(0, imageAvatar.length - 3) + 'png';
                                //console.log("imageAvatar: " + imageAvatar);
                                //imageAvatar = "assets/img/speakers/" + imageAvatar;
                                this.SpeakerList.push({
                                    speakerIcon: "person",
                                    speakerAvatar: imageAvatar,
                                    navigationArrow: "arrow-dropright",
                                    SpeakerID: data2[i].speakerID,
                                    DisplayNameLastFirst: DisplayName,
                                    DisplayCredentials: data2[i].Credentials
                                    //Affiliation: data2[i].Affiliation
                                });
                            }
                            this.AuthorsDisplay = true;
                        }
                        this.cd.markForCheck();
                        //loading.dismiss();
                    }).catch(function () {
                        console.log("Speaker Promise Rejected");
                    });
                }
            }
        }).catch(function () {
            console.log("Course Promise Rejected");
        });
        // -------------------
        // Get Attendee Status
        // -------------------
        /*
        console.log('Attendee Button Management, AttendeeID: ' + AttendeeID);
        if (AttendeeID == '0') {
            this.btnNotes = false;
            this.btnAgendaManagement = false;
        } else {
            this.btnNotes = true;
            this.btnAgendaManagement = true;
        }
        */
    }
    SpeakerDetails(SpeakerID) {
        if (SpeakerID != 0) {
            // Navigate to Speaker Details page
            this.navCtrl.push('SpeakerDetailsPage', { SpeakerID: SpeakerID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    printWindow() {
        window.open('https://www.google.com/cloudprint/#printers', '_system');
    }
    ;
    openPDF(PDFURL) {
        var ref = window.open(PDFURL, '_system');
    }
    ;
    navToMyAgenda() {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            // If not, store the page they want to go to and go to the Login page
            console.log('Stored AttendeeID: ' + AttendeeID);
            this.localstorage.setLocalValue('NavigateToPage', "MyAgenda");
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
        else {
            // Otherwise just go to the page they want
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' });
        }
    }
    ;
    navToNotes(EventID) {
        console.log("NoteDetails: " + EventID);
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID == '' || AttendeeID == null) {
            // If not, store the page they want to go to and go to the Login page
            console.log('Stored AttendeeID: ' + AttendeeID);
            this.localstorage.setLocalValue('NavigateToPage', "NotesDetailsPage");
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
        else {
            // Otherwise just go to the page they want
            this.navCtrl.push('NotesDetailsPage', { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    AgendaManagement() {
        console.log("Begin AgendaManagement process...");
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        var AAOID = this.localstorage.getLocalValue("AAOID");
        var EventID = this.localstorage.getLocalValue("EventID");
        var EventStartTime = this.localstorage.getLocalValue("EventStartTime");
        var EventEndTime = this.localstorage.getLocalValue("EventEndTime");
        var EventLocation = this.localstorage.getLocalValue("EventLocation");
        var EventName = this.localstorage.getLocalValue("EventName");
        EventName = EventName.replace(/'/g, "''");
        var EventDate = this.localstorage.getLocalValue("EventDate");
        var flags = '';
        // Starting variables
        console.log("AttendeeID: " + AttendeeID);
        console.log("AAOID: " + AAOID);
        console.log("EventID: " + EventID);
        console.log("EventStartTime: " + EventStartTime);
        console.log("EventEndTime: " + EventEndTime);
        console.log("EventLocation: " + EventLocation);
        console.log("EventName: " + EventName);
        console.log("EventDate: " + EventDate);
        this.cd.markForCheck();
        // Get last update performed by this app
        var LastUpdateDate = this.localstorage.getLocalValue("LastUpdateDate");
        if (LastUpdateDate == null) {
            // If never, then set variable and localStorage item to NA
            LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            this.localstorage.setLocalValue("LastUpdateDate", LastUpdateDate);
        }
        if (this.visAgendaAddRemoveButton == "Add") {
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
                        this.visAgendaAddRemoveButton = "Remove";
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
        else {
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
                        this.visAgendaAddRemoveButton = "Add";
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
    }
    ;
};
EducationDetailsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-educationdetails',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/educationdetails/educationdetails.html"*/'<ion-header>\n\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon color="secondary" name="menu"></ion-icon>\n    </button>\n    <ion-title>Education Details</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="page-speakers" padding>\n\n	<div class="myLabelBold" style="margin-top:10px!important">\n		<h2>{{EventName}}</h2>\n		<p>{{EventSubName}}</p>\n		<p>{{DisplayEventTimeDateLocation}}</p>\n		<p>{{SpeakerDisplayName}}</p>\n		<p>{{EventTypeName}}</p>\n		<p [ngClass]="SessionStatusStyle">{{SessionStatus}}</p>\n	</div>\n	<div class="button-bar" style="margin:10px!important">\n\n		<button ion-button outline color="secondary" *ngIf="btnAgendaManagement" (click)="AgendaManagement()" [style.background-color]="AgendaButtonColor" [style.color]="AgendaButtonTextColor">\n			<div>\n				<ion-icon color="secondary" name="calendar"></ion-icon>\n				<label>{{visAgendaAddRemoveButton}}</label>\n			</div>\n		</button>\n		\n		<button ion-button outline color=secondary  *ngIf="btnNotes" (click)="navToNotes(EventID)">\n			<div>\n				<ion-icon name="create"></ion-icon>\n				<label></label>\n			</div>\n		</button>\n\n		<button ion-button outline color=secondary *ngIf="btnPrint" (click)="printWindow()">\n			<div>\n				<ion-icon name="print"></ion-icon>\n				<label></label>\n			</div>\n		</button>\n\n	</div>\n\n	<ion-card *ngIf="SpeakerHostShow">\n\n		<ion-card-header class="cardHeader">\n			Speaker Host / Emcee\n		</ion-card-header>\n		  \n		<ion-card-content>\n			<div class="myMarginTopBottom">\n				{{SpeakerHostEmcee}}\n			</div>\n		</ion-card-content>\n		  \n	</ion-card>\n\n	<ion-card *ngIf="CorporateSupporterShow">\n\n		<ion-card-header class="cardHeader">\n			Corporate Supporter\n		</ion-card-header>\n		  \n		<ion-card-content>\n			<div class="myMarginTopBottom">\n				{{EventCorporateSupporter}}\n			</div>\n		</ion-card-content>\n		  \n	</ion-card>\n\n	<ion-card *ngIf="AuthorsDisplay">\n\n		<ion-card-header class="cardHeader">\n			Speakers\n		</ion-card-header>\n\n		<ion-card-content>\n\n			<ion-list id="author-list3">\n				<ion-item (click)="SpeakerDetails(speaker.SpeakerID)" *ngFor="let speaker of SpeakerList" id="speakersessions-list-item19">\n				\n					<ion-avatar item-start>\n						<img src="{{speaker.speakerAvatar}}" onerror="this.src=\'assets/img/personIcon.png\'">\n					</ion-avatar>\n					<!--<ion-icon item-right  name=bookmarks></ion-icon>-->\n					<ion-icon item-right name="{{speaker.navigationArrow}}"></ion-icon>\n					<h2>{{speaker.DisplayNameLastFirst}}</h2>\n					{{speaker.DisplayCredentials}}\n				</ion-item>\n			</ion-list>\n		</ion-card-content>\n\n	</ion-card>\n	\n	<ion-card *ngIf="AbstractDisplay">\n\n		<ion-card-header class="cardHeader">\n			<div style="color:#fff">\n				Abstract\n			</div>\n		</ion-card-header>\n\n		<ion-card-content>\n\n			<div [innerHTML]="sessionAbstract" class="myMarginTopBottom">\n				{{EventDetails}}\n			</div>\n		</ion-card-content>\n\n	</ion-card>\n\n	<ion-card *ngIf="DescriptionDisplay">\n\n		<ion-card-header class="cardHeader">\n			<div style="color:#fff">\n				Description\n			</div>\n		</ion-card-header>\n\n		<ion-card-content>\n\n			<div [innerHTML]="sessionAbstract" class="myMarginTopBottom">\n				{{EventDetails}}\n			</div>\n		</ion-card-content>\n\n	</ion-card>\n\n	<ion-card *ngIf="SubEventsDisplay">\n\n		<ion-card-header class="cardHeader">\n			<div style="color:#fff">\n				SubEvents\n			</div>\n		</ion-card-header>\n\n		<ion-card-content>\n\n			<ion-list id="session-list3">\n				<ion-item (click)="EventDetails(session.EventID)" *ngFor="let session of sessions" id="speakersessions-list-item20">\n					<div style="float: left; padding-right: 10px;">\n						<ion-icon name="{{session.eventTypeIcon}}"></ion-icon>\n					</div>\n					<div>\n						<p class="myLabelBold">\n							{{session.DisplayEventName}}\n						</p>\n						<p>\n							{{session.DisplayEventTimeDateLocation}}\n						</p>\n					</div>\n					<div style="float: right">\n						<ion-icon name="{{session.navigationArrow}}"></ion-icon>\n					</div>\n				</ion-item>\n			</ion-list>\n		</ion-card-content>\n\n	</ion-card>\n\n	<ion-card *ngIf="RecordingShow">\n\n		<ion-card-header class="cardHeader">\n			Session Recording\n		</ion-card-header>\n		  \n		<ion-card-content>\n			<ion-icon item-left name="mic" style="padding-right: 10px;"></ion-icon>\n			This session is being recorded.\n		</ion-card-content>\n		  \n	</ion-card>\n\n	<ion-card *ngIf="HandoutShow">\n\n		<ion-card-header class="cardHeader">\n			<div style="color:#fff">\n				Handout\n			</div>\n		</ion-card-header>\n\n		<ion-card-content>\n\n			<div class="list" (click)="openPDF(HandoutURL)">\n				<ion-icon item-left name="cloud-download" style="padding-right: 10px;"></ion-icon>\n				{{HandoutFn}}\n			</div>\n		</ion-card-content>\n\n	</ion-card>\n\n	<ion-card *ngIf="OtherInformationDisplay">\n\n		<ion-card-header class="cardHeader">\n			Other Information\n		</ion-card-header>\n		  \n		<ion-card-content>\n			<div class="myMarginTopBottom">\n				<ion-row>\n					<ion-col col-6>\n						<ion-item>\n							<ion-label><b>Subject</b><br/>{{vSubjectCode}}</ion-label>\n						</ion-item>\n					</ion-col>\n					<ion-col col-6>\n						<ion-item>\n							<ion-label><b>CE Credits</b><br/>{{vCECredits}}</ion-label>\n						</ion-item>\n					</ion-col>\n				</ion-row>\n				<ion-row>\n					<ion-col col-6>\n						<ion-item>\n							<ion-label><b>Type</b><br/>{{vSessionType}}</ion-label>\n						</ion-item>\n					</ion-col>\n					<ion-col col-6>\n						<ion-item>\n							<ion-label><b>CE Credits Type</b><br/>{{vCECreditsType}}</ion-label>\n						</ion-item>\n					</ion-col>\n				</ion-row>\n				<ion-row>\n					<ion-col col-6>\n						<ion-item>\n							<ion-label><b>Level</b><br/>{{vSessionLevel}}</ion-label>\n						</ion-item>\n					</ion-col>\n					<ion-col col-6>\n					</ion-col>\n				</ion-row>\n			</div>\n		</ion-card-content>\n		  \n	</ion-card>\n	\n	<ion-card *ngIf="MeetingLocationDisplay">\n\n		<ion-card-header class="cardHeader">\n			<div style="color:#fff">\n				Locator\n			</div>\n		</ion-card-header>\n\n		<ion-card-content>\n\n			<div class="myMarginTopBottom">\n				<div id="map1" style="width:100%; height:400px;"></div>\n			</div>\n		</ion-card-content>\n</ion-card>\n	\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/educationdetails/educationdetails.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], EducationDetailsPage);

//# sourceMappingURL=educationdetails.js.map

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__notesdetails_notesdetails__ = __webpack_require__(542);
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






// Pages

let NotesPage = class NotesPage {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.day1Items = [];
        this.day2Items = [];
        this.day3Items = [];
        this.day4Items = [];
        this.day5Items = [];
        this.Day1Show = false;
        this.Day2Show = false;
        this.Day3Show = false;
        this.Day4Show = false;
        this.Day5Show = false;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad: NotesPage');
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter: NotesPage');
        // Load / refresh data when coming to this page
        this.LoadData();
    }
    LoadData() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        // Blank and show loading info
        this.day1Items = [];
        this.day2Items = [];
        this.day3Items = [];
        this.day4Items = [];
        this.day5Items = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        var DisplayLocation = "";
        var dbEventDateTime;
        var SQLDate;
        var DisplayDateTime;
        var AgendaButtonText;
        var visEventName;
        var ButtonStyle = "";
        var visEventNote = "";
        var DisplayDayLabel;
        var DisplayDay1Label;
        var DisplayDay2Label;
        var DisplayDay3Label;
        var DisplayDay4Label;
        var DisplayDay5Label;
        var AgendaDays = this.localstorage.getLocalValue("AgendaDays");
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
        var DayLabels = AgendaDates.split("|");
        switch (AgendaDays) {
            case "1":
                this.Day1Show = true;
                this.Day2Show = false;
                this.Day3Show = false;
                this.Day4Show = false;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                this.Day2Label = "";
                this.Day3Label = "";
                this.Day4Label = "";
                this.Day5Label = "";
                break;
            case "2":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = false;
                this.Day4Show = false;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                this.Day3Label = "";
                this.Day4Label = "";
                this.Day5Label = "";
                break;
            case "3":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = true;
                this.Day4Show = false;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day3Label = DisplayDay3Label;
                this.Day4Label = "";
                this.Day5Label = "";
                break;
            case "4":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = true;
                this.Day4Show = true;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day3Label = DisplayDay3Label;
                dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
                DisplayDay4Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day4Label = DisplayDay4Label;
                this.Day5Label = "";
                break;
            case "5":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = true;
                this.Day4Show = true;
                this.Day5Show = true;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day3Label = DisplayDay3Label;
                dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
                DisplayDay4Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day4Label = DisplayDay4Label;
                dbEventDateTime = new Date(DayLabels[4] + "T05:00:00Z");
                DisplayDay5Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day5Label = DisplayDay5Label;
                break;
        }
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            //loading.present();
            // -------------------
            // Get data: Day 1
            // -------------------
            flags = DayLabels[0] + "|li";
            //flags = "2018-06-09|li";
            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                //console.log("getNotesData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        // Display start time
                        dbEventDateTime = data[i].StartDateTime.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        visEventName = data[i].MeetingTitle;
                        visEventNote = "Note: " + data[i].Note.substr(0, 30) + " ...";
                        console.log("EventID: " + data[i].meetingID);
                        this.day1Items.push({
                            CourseName: visEventName,
                            visEventTimeframe: DisplayDateTime,
                            EventID: data[i].meetingID,
                            NoteBeginning: visEventNote
                        });
                    }
                }
                else {
                    this.day1Items.push({
                        CourseName: "No notes have been taken for meetings on this day",
                        visEventTimeframe: "",
                        EventID: 0,
                        NoteBeginning: ""
                    });
                }
                this.cd.markForCheck();
                // -------------------
                // Get data: Day 2
                // -------------------
                flags = DayLabels[1] + "|li";
                this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                    //console.log("getNotesData: " + JSON.stringify(data));
                    if (data['length'] > 0) {
                        for (var i = 0; i < data['length']; i++) {
                            // Display start time
                            dbEventDateTime = data[i].StartDateTime.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                            visEventName = data[i].MeetingTitle;
                            visEventNote = "Note: " + data[i].Note.substr(0, 30) + " ...";
                            console.log("EventID: " + data[i].meetingID);
                            this.day2Items.push({
                                CourseName: visEventName,
                                visEventTimeframe: DisplayDateTime,
                                EventID: data[i].meetingID,
                                NoteBeginning: visEventNote
                            });
                        }
                    }
                    else {
                        this.day2Items.push({
                            CourseName: "No notes have been taken for meetings on this day",
                            visEventTimeframe: "",
                            EventID: 0,
                            NoteBeginning: ""
                        });
                    }
                    this.cd.markForCheck();
                    // -------------------
                    // Get data: Day 3
                    // -------------------
                    flags = DayLabels[2] + "|li";
                    this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                        //console.log("getNotesData: " + JSON.stringify(data));
                        if (data['length'] > 0) {
                            for (var i = 0; i < data['length']; i++) {
                                // Display start time
                                dbEventDateTime = data[i].StartDateTime.substring(0, 19);
                                dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                                dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                                SQLDate = new Date(dbEventDateTime);
                                DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                                visEventName = data[i].MeetingTitle;
                                visEventNote = "Note: " + data[i].Note.substr(0, 30) + " ...";
                                this.day3Items.push({
                                    CourseName: visEventName,
                                    visEventTimeframe: DisplayDateTime,
                                    EventID: data[i].meetingID,
                                    NoteBeginning: visEventNote
                                });
                            }
                        }
                        else {
                            this.day3Items.push({
                                CourseName: "No notes have been taken for meetings on this day",
                                visEventTimeframe: "",
                                EventID: 0,
                                NoteBeginning: ""
                            });
                        }
                        this.cd.markForCheck();
                        // -------------------
                        // Get data: Day 4
                        // -------------------
                        flags = DayLabels[3] + "|li";
                        this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                            //console.log("getNotesData: " + JSON.stringify(data));
                            if (data['length'] > 0) {
                                for (var i = 0; i < data['length']; i++) {
                                    // Display start time
                                    dbEventDateTime = data[i].StartDateTime.substring(0, 19);
                                    dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                                    dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                                    SQLDate = new Date(dbEventDateTime);
                                    DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                                    visEventName = data[i].MeetingTitle;
                                    visEventNote = "Note: " + data[i].Note.substr(0, 30) + " ...";
                                    this.day4Items.push({
                                        CourseName: visEventName,
                                        visEventTimeframe: DisplayDateTime,
                                        EventID: data[i].meetingID,
                                        NoteBeginning: visEventNote
                                    });
                                }
                            }
                            else {
                                this.day4Items.push({
                                    CourseName: "No notes have been taken for meetings on this day",
                                    visEventTimeframe: "",
                                    EventID: 0,
                                    NoteBeginning: ""
                                });
                            }
                            this.cd.markForCheck();
                            // -------------------
                            // Get data: Day 5
                            // -------------------
                            flags = DayLabels[4] + "|li";
                            this.databaseprovider.getNotesData(flags, AttendeeID).then(data => {
                                //console.log("getNotesData: " + JSON.stringify(data));
                                if (data['length'] > 0) {
                                    for (var i = 0; i < data['length']; i++) {
                                        // Display start time
                                        dbEventDateTime = data[i].StartDateTime.substring(0, 19);
                                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                                        SQLDate = new Date(dbEventDateTime);
                                        DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                                        visEventName = data[i].MeetingTitle;
                                        visEventNote = "Note: " + data[i].Note.substr(0, 30) + " ...";
                                        this.day5Items.push({
                                            CourseName: visEventName,
                                            visEventTimeframe: DisplayDateTime,
                                            EventID: data[i].meetingID,
                                            NoteBeginning: visEventNote
                                        });
                                    }
                                }
                                else {
                                    this.day5Items.push({
                                        CourseName: "No notes have been taken for meetings on this day",
                                        visEventTimeframe: "",
                                        EventID: 0,
                                        NoteBeginning: ""
                                    });
                                }
                                this.cd.markForCheck();
                                //loading.dismiss();
                            }).catch(function () {
                                console.log("Day 5 Promise Rejected");
                            });
                        }).catch(function () {
                            console.log("DAy 4 Promise Rejected");
                        });
                    }).catch(function () {
                        console.log("Day 3 Promise Rejected");
                    });
                }).catch(function () {
                    console.log("Day 2 Promise Rejected");
                });
            }).catch(function () {
                console.log("Day 1 Promise Rejected");
            });
        }
        else {
            console.log('User not logged in');
            //loading.dismiss();
        }
    }
    NoteDetails(EventID) {
        console.log("NoteDetails: " + EventID);
        if (EventID != 0) {
            // Navigate to Notes Details page
            this.localstorage.setLocalValue('EventID', EventID);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__notesdetails_notesdetails__["a" /* NotesDetailsPage */], { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
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
};
NotesPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-notes',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/notes/notes.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Notes</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<!-- Search input -->\n	<ion-grid style="margin-top:-15px">\n		<ion-row>\n			<ion-col col-9>	\n\n				<ion-item class="item-input; shadow">\n					<ion-icon name="search" item-left></ion-icon>\n					<ion-input name="srchBarEntry" id="srchBarEntry" \n					type="text" placeholder="Search" [(ngModel)]="EntryTerms"></ion-input>\n				</ion-item>\n			</ion-col>\n			<ion-col col-3>\n				<button ion-button block class="buttonPadding" style="background:#2196f3" (tap)="GetSearchResults()">\n					Submit\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n\n	<ion-list id="Notes-list3">\n\n		<!-- Day 1 note items -->\n		<ion-card *ngIf=Day1Show>\n\n			<ion-card-header class="mutedBlue">\n				{{Day1Label}}\n			</ion-card-header>\n\n			<ion-card-content>\n				<ion-item class="item-icon-left item-icon-right" (tap)="NoteDetails(day1item.EventID)" *ngFor="let day1item of day1Items" id="notes-list-item19">\n					<i class="icon {{notesIcon}}"></i>\n					<p>\n						{{day1item.CourseName}}\n					</p>\n					<p>\n						{{day1item.visEventTimeframe}}\n					</p>\n					<p>\n						{{day1item.NoteBeginning}}\n					</p>\n					<i class="icon {{navigationRightArrow}}"></i>\n				</ion-item>\n			</ion-card-content>\n\n		</ion-card>\n\n		<!-- Day 2 note items -->\n		<ion-card *ngIf=Day2Show>\n\n			<ion-card-header  class="mutedBlue">\n				{{Day2Label}}\n			</ion-card-header>\n\n			<ion-card-content>\n				<ion-item class="item-icon-left item-icon-right" (tap)="NoteDetails(day2item.EventID)" *ngFor="let day2item of day2Items" id="notes-list-item19">\n					<i class="icon {{notesIcon}}"></i>\n					<p>\n						{{day2item.CourseName}}\n					</p>\n					<p>\n						{{day2item.visEventTimeframe}}\n					</p>\n					<p>\n						{{day2item.NoteBeginning}}\n					</p>\n					<i class="icon {{navigationRightArrow}}"></i>\n				</ion-item>\n			</ion-card-content>\n\n		</ion-card>\n\n\n		<!-- Day 3 note items -->\n		<ion-card *ngIf=Day3Show>\n\n			<ion-card-header class="mutedBlue">\n				{{Day3Label}}\n			</ion-card-header>\n\n			<ion-card-content>\n				<ion-item class="item-icon-left item-icon-right" (tap)="NoteDetails(day3item.EventID)" *ngFor="let day3item of day3Items" id="notes-list-item19">\n					<i class="icon {{notesIcon}}"></i>\n					<p>\n						{{day3item.CourseName}}\n					</p>\n					<p>\n						{{day3item.visEventTimeframe}}\n					</p>\n					<p>\n						{{day3item.NoteBeginning}}\n					</p>\n					<i class="icon {{navigationRightArrow}}"></i>\n				</ion-item>\n			</ion-card-content>\n\n		</ion-card>\n\n\n		<!-- Day 4 note items -->\n		<ion-card *ngIf=Day4Show>\n\n			<ion-card-header class="mutedBlue">\n				{{Day4Label}}\n			</ion-card-header>\n\n			<ion-card-content>\n				<ion-item class="item-icon-left item-icon-right" (tap)="NoteDetails(day4item.EventID)" *ngFor="let day4item of day4Items" id="notes-list-item21">\n					<i class="icon {{notesIcon}}"></i>\n					<p>\n						{{day4item.CourseName}}\n					</p>\n					<p>\n						{{day4item.visEventTimeframe}}\n					</p>\n					<p>\n						{{day4item.NoteBeginning}}\n					</p>\n					<i class="icon {{navigationRightArrow}}"></i>\n				</ion-item>\n			</ion-card-content>\n\n		</ion-card>\n\n		<!-- Day 5 note items -->\n		<ion-card *ngIf=Day5Show>\n\n			<ion-card-header class="mutedBlue">\n				{{Day5Label}}\n			</ion-card-header>\n\n			<ion-card-content>\n				<ion-item class="item-icon-left item-icon-right" (tap)="NoteDetails(day5item.EventID)" *ngFor="let day5item of day5Items" id="notes-list-item22">\n					<i class="icon {{notesIcon}}"></i>\n					<p>\n						{{day5item.CourseName}}\n					</p>\n					<p>\n						{{day5item.visEventTimeframe}}\n					</p>\n					<p>\n						{{day5item.NoteBeginning}}\n					</p>\n					<i class="icon {{navigationRightArrow}}"></i>\n				</ion-item>\n			</ion-card-content>\n\n		</ion-card>\n\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/notes/notes.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], NotesPage);

//# sourceMappingURL=notes.js.map

/***/ }),

/***/ 83:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyAgendaFull; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__educationdetails_educationdetails__ = __webpack_require__(62);
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






// Pages

let MyAgendaFull = class MyAgendaFull {
    constructor(navCtrl, navParams, storage, databaseprovider, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.day1Items = [];
        this.day2Items = [];
        this.day3Items = [];
        this.day4Items = [];
        this.day5Items = [];
        this.Day1Show = false;
        this.Day2Show = false;
        this.Day3Show = false;
        this.Day4Show = false;
        this.Day5Show = false;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MyAgendaFull');
    }
    ngOnInit() {
        // Load initial data set here
        //let loading = this.loadingCtrl.create({
        //	spinner: 'crescent',
        //	content: 'Please wait...'
        //});
        // Blank and show loading info
        this.day1Items = [];
        this.day2Items = [];
        this.day3Items = [];
        this.day4Items = [];
        this.day5Items = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        var visStartTime;
        var visEndTime;
        var eventIcon;
        var visEventName;
        var visEventLocation;
        var SQLDate;
        var DisplayDayLabel;
        var DisplayDay1Label;
        var DisplayDay2Label;
        var DisplayDay3Label;
        var DisplayDay4Label;
        var DisplayDay5Label;
        var dbEventDateTime;
        var AgendaDays = this.localstorage.getLocalValue("AgendaDays");
        var AgendaDates = this.localstorage.getLocalValue("AgendaDates");
        var DayLabels = AgendaDates.split("|");
        switch (AgendaDays) {
            case "1":
                this.Day1Show = true;
                this.Day2Show = false;
                this.Day3Show = false;
                this.Day4Show = false;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                this.Day2Label = "";
                this.Day3Label = "";
                this.Day4Label = "";
                this.Day5Label = "";
                break;
            case "2":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = false;
                this.Day4Show = false;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                this.Day3Label = "";
                this.Day4Label = "";
                this.Day5Label = "";
                break;
            case "3":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = true;
                this.Day4Show = false;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day3Label = DisplayDay3Label;
                this.Day4Label = "";
                this.Day5Label = "";
                break;
            case "4":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = true;
                this.Day4Show = true;
                this.Day5Show = false;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day3Label = DisplayDay3Label;
                dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
                DisplayDay4Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day4Label = DisplayDay4Label;
                this.Day5Label = "";
                break;
            case "5":
                this.Day1Show = true;
                this.Day2Show = true;
                this.Day3Show = true;
                this.Day4Show = true;
                this.Day5Show = true;
                dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                DisplayDay1Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day1Label = DisplayDay1Label;
                dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                DisplayDay2Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day2Label = DisplayDay2Label;
                dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                DisplayDay3Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day3Label = DisplayDay3Label;
                dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
                DisplayDay4Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day4Label = DisplayDay4Label;
                dbEventDateTime = new Date(DayLabels[4] + "T05:00:00Z");
                DisplayDay5Label = dateFormat(dbEventDateTime, "dddd, mmmm d");
                this.Day5Label = DisplayDay5Label;
                break;
        }
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            //loading.present();
            // -------------------
            // Get data: Day 1
            // -------------------
            flags = "li|" + DayLabels[0];
            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                console.log("getAgendaData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        visStartTime = formatTime(data[i].EventStartTime);
                        visEndTime = formatTime(data[i].EventEndTime);
                        if (data[i].EventName != null) {
                            visEventName = data[i].EventName;
                            visEventLocation = data[i].EventLocation;
                            eventIcon = "time";
                        }
                        else {
                            var tempTitle = "Meeting with ";
                            // If available, use Nickname field for First Name
                            if (data[i].Nickname != "" && data[i].Nickname != null) {
                                tempTitle = tempTitle + data[i].Nickname;
                            }
                            else {
                                tempTitle = tempTitle + data[i].FirstName;
                            }
                            tempTitle = tempTitle + " " + data[i].LastName;
                            tempTitle = tempTitle + " (" + data[i].Party.charAt(0) + " - " + data[i].State + ")";
                            visEventName = tempTitle;
                            visEventLocation = data[i].Address;
                            eventIcon = "list-box";
                        }
                        this.day1Items.push({
                            EventName: visEventName,
                            visEventTimeframe: visStartTime + " to " + visEndTime,
                            visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                            EventLocation: visEventLocation,
                            eventTypeIcon: eventIcon
                        });
                    }
                }
                else {
                    dbEventDateTime = new Date(DayLabels[0] + "T05:00:00Z");
                    DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
                    this.day1Items.push({
                        EventName: "No meetings scheduled for " + DisplayDayLabel,
                        visEventTimeframe: "",
                        EventLocation: "",
                        visEventID: "'0|0'",
                        eventTypeIcon: "remove-circle"
                    });
                }
                this.cd.markForCheck();
                // -------------------
                // Get data: Day 2
                // -------------------
                flags = "li|" + DayLabels[1];
                this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                    console.log("getAgendaData: " + JSON.stringify(data));
                    if (data['length'] > 0) {
                        for (var i = 0; i < data['length']; i++) {
                            visStartTime = formatTime(data[i].EventStartTime);
                            visEndTime = formatTime(data[i].EventEndTime);
                            if (data[i].EventName != null) {
                                visEventName = data[i].EventName;
                                visEventLocation = data[i].EventLocation;
                                eventIcon = "time";
                            }
                            else {
                                var tempTitle = "Meeting with ";
                                // If available, use Nickname field for First Name
                                if (data[i].Nickname != "" && data[i].Nickname != null) {
                                    tempTitle = tempTitle + data[i].Nickname;
                                }
                                else {
                                    tempTitle = tempTitle + data[i].FirstName;
                                }
                                tempTitle = tempTitle + " " + data[i].LastName;
                                tempTitle = tempTitle + " (" + data[i].Party.charAt(0) + " - " + data[i].State + ")";
                                visEventName = tempTitle;
                                visEventLocation = data[i].Address;
                                eventIcon = "list-box";
                            }
                            this.day2Items.push({
                                EventName: visEventName,
                                visEventTimeframe: visStartTime + " to " + visEndTime,
                                visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                                EventLocation: visEventLocation,
                                eventTypeIcon: eventIcon
                            });
                        }
                    }
                    else {
                        dbEventDateTime = new Date(DayLabels[1] + "T05:00:00Z");
                        DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
                        this.day2Items.push({
                            EventName: "No meetings scheduled for " + DisplayDayLabel,
                            visEventTimeframe: "",
                            EventLocation: "",
                            visEventID: "'0|0'",
                            eventTypeIcon: "remove-circle"
                        });
                    }
                    this.cd.markForCheck();
                    // -------------------
                    // Get data: Day 3
                    // -------------------
                    flags = "li|" + DayLabels[2];
                    this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                        console.log("getAgendaData: " + JSON.stringify(data));
                        if (data['length'] > 0) {
                            for (var i = 0; i < data['length']; i++) {
                                visStartTime = formatTime(data[i].EventStartTime);
                                visEndTime = formatTime(data[i].EventEndTime);
                                if (data[i].EventName != null) {
                                    visEventName = data[i].EventName;
                                    visEventLocation = data[i].EventLocation;
                                    eventIcon = "time";
                                }
                                else {
                                    var tempTitle = "Meeting with ";
                                    // If available, use Nickname field for First Name
                                    if (data[i].Nickname != "" && data[i].Nickname != null) {
                                        tempTitle = tempTitle + data[i].Nickname;
                                    }
                                    else {
                                        tempTitle = tempTitle + data[i].FirstName;
                                    }
                                    tempTitle = tempTitle + " " + data[i].LastName;
                                    tempTitle = tempTitle + " (" + data[i].Party.charAt(0) + " - " + data[i].State + ")";
                                    visEventName = tempTitle;
                                    visEventLocation = data[i].Address;
                                    eventIcon = "list-box";
                                }
                                this.day3Items.push({
                                    EventName: visEventName,
                                    visEventTimeframe: visStartTime + " to " + visEndTime,
                                    visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                                    EventLocation: visEventLocation,
                                    eventTypeIcon: eventIcon
                                });
                            }
                        }
                        else {
                            dbEventDateTime = new Date(DayLabels[2] + "T05:00:00Z");
                            DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
                            this.day3Items.push({
                                EventName: "No entries made for " + DisplayDayLabel,
                                visEventTimeframe: "",
                                EventLocation: "",
                                visEventID: "'0|0'",
                                eventTypeIcon: "remove-circle"
                            });
                        }
                        this.cd.markForCheck();
                        // -------------------
                        // Get data: Day 4
                        // -------------------
                        flags = "li|" + DayLabels[3];
                        this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                            console.log("getAgendaData: " + JSON.stringify(data));
                            if (data['length'] > 0) {
                                for (var i = 0; i < data['length']; i++) {
                                    visStartTime = formatTime(data[i].EventStartTime);
                                    visEndTime = formatTime(data[i].EventEndTime);
                                    if (data[i].EventName != null) {
                                        visEventName = data[i].EventName;
                                        visEventLocation = data[i].EventLocation;
                                        eventIcon = "time";
                                    }
                                    else {
                                        var tempTitle = "Meeting with ";
                                        // If available, use Nickname field for First Name
                                        if (data[i].Nickname != "" && data[i].Nickname != null) {
                                            tempTitle = tempTitle + data[i].Nickname;
                                        }
                                        else {
                                            tempTitle = tempTitle + data[i].FirstName;
                                        }
                                        tempTitle = tempTitle + " " + data[i].LastName;
                                        tempTitle = tempTitle + " (" + data[i].Party.charAt(0) + " - " + data[i].State + ")";
                                        visEventName = tempTitle;
                                        visEventLocation = data[i].Address;
                                        eventIcon = "list-box";
                                    }
                                    this.day4Items.push({
                                        EventName: visEventName,
                                        visEventTimeframe: visStartTime + " to " + visEndTime,
                                        visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                                        EventLocation: visEventLocation,
                                        eventTypeIcon: eventIcon
                                    });
                                }
                            }
                            else {
                                dbEventDateTime = new Date(DayLabels[3] + "T05:00:00Z");
                                DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
                                this.day4Items.push({
                                    EventName: "No entries made for " + DisplayDayLabel,
                                    visEventTimeframe: "",
                                    EventLocation: "",
                                    visEventID: "'0|0'",
                                    eventTypeIcon: "remove-circle"
                                });
                            }
                            this.cd.markForCheck();
                            // -------------------
                            // Get data: Day 5
                            // -------------------
                            flags = "li|" + DayLabels[4];
                            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                                console.log("getAgendaData: " + JSON.stringify(data));
                                if (data['length'] > 0) {
                                    for (var i = 0; i < data['length']; i++) {
                                        visStartTime = formatTime(data[i].EventStartTime);
                                        visEndTime = formatTime(data[i].EventEndTime);
                                        if (data[i].EventName != null) {
                                            visEventName = data[i].EventName;
                                            visEventLocation = data[i].EventLocation;
                                            eventIcon = "time";
                                        }
                                        else {
                                            var tempTitle = "Meeting with ";
                                            // If available, use Nickname field for First Name
                                            if (data[i].Nickname != "" && data[i].Nickname != null) {
                                                tempTitle = tempTitle + data[i].Nickname;
                                            }
                                            else {
                                                tempTitle = tempTitle + data[i].FirstName;
                                            }
                                            tempTitle = tempTitle + " " + data[i].LastName;
                                            tempTitle = tempTitle + " (" + data[i].Party.charAt(0) + " - " + data[i].State + ")";
                                            visEventName = tempTitle;
                                            visEventLocation = data[i].Address;
                                            eventIcon = "list-box";
                                        }
                                        this.day5Items.push({
                                            EventName: visEventName,
                                            visEventTimeframe: visStartTime + " to " + visEndTime,
                                            visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                                            EventLocation: visEventLocation,
                                            eventTypeIcon: eventIcon
                                        });
                                    }
                                }
                                else {
                                    dbEventDateTime = new Date(DayLabels[4] + "T05:00:00Z");
                                    DisplayDayLabel = dateFormat(dbEventDateTime, "dddd");
                                    this.day5Items.push({
                                        EventName: "No entries made for " + DisplayDayLabel,
                                        visEventTimeframe: "",
                                        EventLocation: "",
                                        visEventID: "'0|0'",
                                        eventTypeIcon: "remove-circle"
                                    });
                                }
                                this.cd.markForCheck();
                                //loading.dismiss();
                            }).catch(function () {
                                console.log("Day 5 Promise Rejected");
                            });
                        }).catch(function () {
                            console.log("Day 4 Promise Rejected");
                        });
                    }).catch(function () {
                        console.log("Day 3 Promise Rejected");
                    });
                }).catch(function () {
                    console.log("Day 2 Promise Rejected");
                });
            }).catch(function () {
                console.log("Day 1 Promise Rejected");
            });
        }
        else {
            console.log('User not logged in');
            //loading.dismiss();
        }
    }
    EventDetails(EventID) {
        console.log("Btn ID: " + EventID);
        var IDSplit = EventID.split("|");
        var storeEventID = IDSplit[0].replace("'", "");
        var storePersonalEventID = IDSplit[1].replace("'", "");
        console.log("storeEventID: " + storeEventID);
        console.log("storePersonalEventID: " + storePersonalEventID);
        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        }
        else {
            if (storeEventID == "0") {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);
                // Navigate to Education Details page
                this.navCtrl.push('MyAgendaPersonal', { EventID: storePersonalEventID }, { animate: true, direction: 'forward' });
            }
            else {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('EventID', storeEventID);
                // Navigate to Education Details page
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: storeEventID }, { animate: true, direction: 'forward' });
            }
        }
    }
    ;
};
MyAgendaFull = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-myagendafull',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/myagendafull/myagendafull.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Full Agenda</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n	\n	<!-- Slider ad\n	<ion-slides class="ad" autoplay="5000" loop="true" speed="3000">\n		<ion-slide >\n			<img src="assets/img/rotatingLinkAd.jpg">\n		</ion-slide>\n		<ion-slide >\n			<img src="assets/img/rotatingLinkAd.jpg">\n		</ion-slide>\n		<ion-slide >\n			<img src="assets/img/rotatingLinkAd.jpg">\n		</ion-slide>\n	</ion-slides>\n	-->\n	\n\n	<ion-list id="agendafull-list3" class="" style="margin-bottom:0;padding-top:0;padding-bottom:0">\n\n		<!-- Day 1 agenda items -->\n		<div *ngIf=Day1Show>\n			<div class="item-divider item item-stable" style="padding-left:20px; padding-top:20px">\n				<h4>{{Day1Label}}</h4>\n			</div>\n			<ion-item (click)="EventDetails(day1item.visEventID)" *ngFor="let day1item of day1Items" id="fullagenda-list-item19" >\n				<ion-icon item-left name="{{day1item.eventTypeIcon}}"></ion-icon>\n				<ion-icon item-right name="arrow-dropright"></ion-icon>\n				<h2>{{day1item.EventName}}</h2>\n				<p>{{day1item.visEventTimeframe}}</p>\n				<p>{{day1item.EventLocation}}</p>\n			</ion-item>\n		</div>\n		\n		<!-- Day 2 agenda items -->\n		<div *ngIf=Day2Show>\n			<div class="item-divider item item-stable" style="padding-left:20px; padding-top:10px">\n				<h4>{{Day2Label}}</h4>\n			</div>\n			<ion-item (click)="EventDetails(day2item.visEventID)" *ngFor="let day2item of day2Items" id="fullagenda-list-item20">\n				<ion-icon item-left name="{{day2item.eventTypeIcon}}"></ion-icon>\n				<ion-icon item-right name="arrow-dropright"></ion-icon>\n				<h2>{{day2item.EventName}}</h2>\n				<p>{{day2item.visEventTimeframe}}</p>\n				<p>{{day2item.EventLocation}}</p>\n			</ion-item>\n		</div>\n\n		<!-- Day 3 agenda items -->\n		<div *ngIf=Day3Show>\n			<div class="item-divider item item-stable" style="padding-left:20px; padding-top:10px">\n				<h4>{{Day3Label}}</h4>\n			</div>\n			<ion-item (click)="EventDetails(day3item.visEventID)" *ngFor="let day3item of day3Items" id="fullagenda-list-item21">\n				<ion-icon item-left name="{{day3item.eventTypeIcon}}"></ion-icon>\n				<ion-icon item-right name="arrow-dropright"></ion-icon>\n				<h2>{{day3item.EventName}}</h2>\n				<p>{{day3item.visEventTimeframe}}</p>\n				<p>{{day3item.EventLocation}}</p>\n			</ion-item>\n		</div>\n\n		<!-- Day 4 agenda items -->\n		<div *ngIf=Day4Show>\n			<div class="item-divider item item-stable" style="padding-left:20px; padding-top:10px">\n				<h4>{{Day4Label}}</h4>\n			</div>\n			<ion-item (click)="EventDetails(day4item.visEventID)" *ngFor="let day4item of day4Items" id="fullagenda-list-item22">\n				<ion-icon item-left name="{{day4item.eventTypeIcon}}"></ion-icon>\n				<ion-icon item-right name="arrow-dropright"></ion-icon>\n				<h2>{{day4item.EventName}}</h2>\n				<p>{{day4item.visEventTimeframe}}</p>\n				<p>{{day4item.EventLocation}}</p>\n			</ion-item>\n		</div>\n\n		<!-- Day 5 agenda items -->\n		<div *ngIf=Day5Show>\n			<div class="item-divider item item-stable" style="padding-left:20px; padding-top:10px">\n				<h4>{{Day5Label}}</h4>\n			</div>\n			<ion-item (click)="EventDetails(day5item.visEventID)" *ngFor="let day5item of day5Items" id="fullagenda-list-item22">\n				<ion-icon item-left name="{{day5item.eventTypeIcon}}"></ion-icon>\n				<ion-icon item-right name="arrow-dropright"></ion-icon>\n				<h2>{{day5item.EventName}}</h2>\n				<p>{{day5item.visEventTimeframe}}</p>\n				<p>{{day5item.EventLocation}}</p>\n			</ion-item>\n		</div>\n\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/myagendafull/myagendafull.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], MyAgendaFull);

//# sourceMappingURL=myagendafull.js.map

/***/ }),

/***/ 912:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(530);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__ = __webpack_require__(531);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_onesignal__ = __webpack_require__(532);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_keyboard__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_home_home__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_conferencecity_conferencecity__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_help_help__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_speakers_speakers__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_program_program__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_map_map__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_login_login__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_exhibitors_exhibitors__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_notes_notes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_myagenda_myagenda__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_myagendafull_myagendafull__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_evaluationconference_evaluationconference__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_educationdetails_educationdetails__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_networking_networking__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_social_social__ = __webpack_require__(112);
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










// Pages








//import { CetrackingPage } from '../pages/cetracking/cetracking';







let MyApp = class MyApp {
    constructor(pltfrm, loadingCtrl, storage, keyboard, splashScreen, alertCtrl, oneSignal, 
    //private IonicPro: Pro,
    events, menuCtrl, cd, statusBar, databaseprovider, localstorage) {
        this.pltfrm = pltfrm;
        this.loadingCtrl = loadingCtrl;
        this.storage = storage;
        this.keyboard = keyboard;
        this.splashScreen = splashScreen;
        this.alertCtrl = alertCtrl;
        this.oneSignal = oneSignal;
        this.events = events;
        this.menuCtrl = menuCtrl;
        this.cd = cd;
        this.statusBar = statusBar;
        this.databaseprovider = databaseprovider;
        this.localstorage = localstorage;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */];
        this.upcomingAgendaItems = [];
        this.initializeApp();
        //this.enableIonicPro();
        //show and hide Ionic Keyboard
        this.keyboard.show();
        this.keyboard.hide();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', icon: 'home', component: __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */], naventry: 'Home' },
            { title: 'Program', icon: 'list', component: __WEBPACK_IMPORTED_MODULE_13__pages_program_program__["a" /* ProgramPage */], naventry: 'Program' },
            { title: 'Speakers', icon: 'mic', component: __WEBPACK_IMPORTED_MODULE_12__pages_speakers_speakers__["a" /* SpeakersPage */], naventry: 'Speakers' },
            { title: 'My Agenda', icon: 'calendar', component: __WEBPACK_IMPORTED_MODULE_18__pages_myagenda_myagenda__["a" /* MyAgenda */], naventry: 'MyAgenda' },
            { title: 'Networking', icon: 'contacts', component: __WEBPACK_IMPORTED_MODULE_22__pages_networking_networking__["a" /* NetworkingPage */], naventry: 'Networking' },
            //{ title: 'My Agenda Full', icon: 'calendar', component: MyAgendaFull, naventry: 'MyAgendaFull' },
            { title: 'Exhibitors', icon: 'people', component: __WEBPACK_IMPORTED_MODULE_16__pages_exhibitors_exhibitors__["a" /* ExhibitorsPage */], naventry: 'Exhibitors' },
            { title: 'CE Tracker', icon: 'school', component: 'CetrackingPage', naventry: 'CETracking' },
            { title: 'Maps', icon: 'map', component: __WEBPACK_IMPORTED_MODULE_14__pages_map_map__["a" /* MapPage */], naventry: 'Map' },
            //{ title: 'Floor Plan', icon: 'map', component: FloorplanMappingPage, naventry: 'FloorplanMapping' },
            { title: 'San Diego', icon: 'plane', component: __WEBPACK_IMPORTED_MODULE_10__pages_conferencecity_conferencecity__["a" /* ConferenceCityPage */], naventry: 'SanDiego' },
            { title: 'Social Media', icon: 'text', component: __WEBPACK_IMPORTED_MODULE_23__pages_social_social__["a" /* SocialPage */], naventry: 'SocialMedia' },
            { title: 'Help', icon: 'help', component: __WEBPACK_IMPORTED_MODULE_11__pages_help_help__["a" /* HelpPage */], naventry: 'Help' },
            { title: 'Notes', icon: 'create', component: __WEBPACK_IMPORTED_MODULE_17__pages_notes_notes__["a" /* NotesPage */], naventry: 'Notes' },
            { title: 'Event Survey', icon: 'bookmarks', component: __WEBPACK_IMPORTED_MODULE_20__pages_evaluationconference_evaluationconference__["a" /* EvaluationConference */], naventry: 'EventSurvey' },
            { title: 'Sign In / Out', icon: 'log-in', component: __WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], naventry: 'Login' }
        ];
        this.activePage = this.pages[0];
        // Listen for login/logout events and 
        // refresh side menu dashboard
        this.events.subscribe('user:Status', (LoginType) => {
            console.log('AppComponents: User has ', LoginType);
            this.LoadSideMenuDashboard();
        });
    }
    LoadSideMenuDashboard() {
        this.upcomingAgendaItems = [];
        this.cd.markForCheck();
        // Temporary use variables
        var flags;
        var visStartTime;
        var visEndTime;
        var eventIcon;
        var visEventName;
        var maxRecs;
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            flags = "li2|0";
            this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
                this.upcomingAgendaItems = [];
                this.cd.markForCheck();
                console.log('AppComponents: Getting agenda data for side menu');
                console.log("AppComponents: getAgendaData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    console.log('AppComponents: Processing agenda data');
                    if (data['length'] > 4) {
                        maxRecs = 4;
                    }
                    else {
                        maxRecs = data['length'];
                    }
                    for (var i = 0; i < maxRecs; i++) {
                        var dbEventDateTime = data[i].EventDate.substring(5, 10);
                        var DisplayDateTime = dbEventDateTime.replace(/-/g, '/');
                        visStartTime = formatTime(data[i].EventStartTime);
                        visEndTime = formatTime(data[i].EventEndTime);
                        DisplayDateTime = DisplayDateTime + " from " + visStartTime + " to " + visEndTime;
                        if (data[i].EventID == "0") {
                            eventIcon = "time";
                            visEventName = data[i].EventName;
                        }
                        else {
                            eventIcon = "list-box";
                            visEventName = data[i].EventName;
                        }
                        this.upcomingAgendaItems.push({
                            EventName: visEventName,
                            visEventTimeframe: DisplayDateTime,
                            visEventID: "'" + data[i].EventID + "|" + data[i].mtgID + "'",
                            EventLocation: data[i].EventLocation,
                            eventTypeIcon: eventIcon
                        });
                    }
                }
                else {
                    console.log('AppComponents: Nothing to process for agenda');
                    this.upcomingAgendaItems.push({
                        EventName: "No upcoming agenda entries",
                        visEventTimeframe: "",
                        EventLocation: "",
                        visEventID: "'0|0'",
                        eventTypeIcon: "remove-circle"
                    });
                }
                this.cd.markForCheck();
            }).catch(function () {
                console.log("AppComponents: Promise Rejected");
            });
            this.databaseprovider.getCETrackerData(AttendeeID).then(data2 => {
                console.log('AppComponents: Getting CE data for side menu');
                console.log("getCETrackerData: " + JSON.stringify(data2));
                var sumCreditsL = 0;
                var sumCreditsP = 0;
                if (data2['length'] > 0) {
                    console.log('AppComponents: Processing ' + data2['length'] + ' record(s)');
                    for (var i = 0; i < data2['length']; i++) {
                        var EvalType = data2[i].ce_credits_type.substring(0, 1);
                        var iconSet = 0;
                        if (EvalType == "") { // Evals that don't require an eval are completed
                            iconSet = 1;
                            sumCreditsL = sumCreditsL + parseFloat(data2[i].CEcreditsL);
                            sumCreditsP = sumCreditsP + parseFloat(data2[i].CEcreditsP);
                        }
                        if (data2[i].ceStatusScan == "0" && iconSet == 0) { // No scan (shouldn't happen with AACD)
                            iconSet = 1;
                        }
                        if ((data2[i].Evaluated == "0" || data2[i].Evaluated === null) && iconSet == 0) { // Eval not completed
                            iconSet = 1;
                        }
                        if (iconSet == 0) { // Otherwise mark as completed
                            sumCreditsL = sumCreditsL + parseFloat(data2[i].CEcreditsL);
                            sumCreditsP = sumCreditsP + parseFloat(data2[i].CEcreditsP);
                        }
                    }
                    this.creditsTypeL = sumCreditsL.toFixed(2);
                    this.creditsTypeP = sumCreditsP.toFixed(2);
                    this.cd.markForCheck();
                }
                else {
                    console.log('AppComponents: Nothing to process for CE');
                    this.creditsTypeL = '0.00';
                    this.creditsTypeP = '0.00';
                    this.cd.markForCheck();
                }
            }).catch(function () {
                console.log("AppComponents: Promise Rejected");
            });
        }
        else {
            this.upcomingAgendaItems = [];
            this.cd.markForCheck();
            this.upcomingAgendaItems.push({
                EventName: "You need to be logged in to see your agenda",
                visEventTimeframe: "",
                EventLocation: "",
                visEventID: "'0|0'",
                eventTypeIcon: "remove-circle"
            });
            this.creditsTypeL = '0.00';
            this.creditsTypeP = '0.00';
            this.cd.markForCheck();
        }
    }
    initializeApp() {
        this.pltfrm.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // Temporary hard coding when not logged in
            this.localstorage.setLocalValue("AgendaDays", "4");
            this.localstorage.setLocalValue("AgendaDates", "2019-04-24|2019-04-25|2019-04-26|2019-04-27|");
            this.localstorage.setLocalValue("AgendaDayButtonLabels", "4/24|4/25|4/26|4/27|");
            this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString('#283593');
            this.LoadSideMenuDashboard();
            console.log('AppComponents: initializeApp accessed');
            // Set default value
            this.DevicePlatform = "Browser";
            // Determine if we are running on a device
            if (this.pltfrm.is('android')) {
                console.log("AppComponents: Running on Android device");
                this.DevicePlatform = "Android";
            }
            if (this.pltfrm.is('ios')) {
                console.log("AppComponents: Running on iOS device");
                this.DevicePlatform = "iOS";
            }
            // If running on a device, register/initialize Push service
            console.log('AppComponents: Check device for push setup');
            if (this.DevicePlatform == "iOS" || this.DevicePlatform == "Android") {
                console.log('AppComponents: Running on a device');
                this.initOneSignalNotification();
            }
            else {
                console.log('AppComponents: Running in a browser');
            }
            this.splashScreen.hide();
        });
    }
    // OneSignal Push
    initOneSignalNotification() {
        console.log('AppComponents: Setting up OneSignal');
        // Define settings for iOS
        var iosSettings = {};
        iosSettings["kOSSettingsKeyAutoPrompt"] = true;
        iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
        //this.oneSignal.startInit('034a488f-05e6-45aa-a139-7dcb73151561', '290203431586').iOSSettings(iosSettings);
        this.oneSignal.startInit('d2fc745b-febf-483b-8e9b-97776b6a5e09', '514558578228');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
            // do something when notification is received
            console.log('AppComponents: Message received');
        });
        this.oneSignal.handleNotificationOpened().subscribe((data) => {
            // Show the message in full if the app was not in focus when received.
            console.log('AppFocus: ' + data.notification.isAppInFocus);
            console.log('Title: ' + data.notification.payload.title);
            console.log('Body: ' + data.notification.payload.body);
            if (data.notification.isAppInFocus == false) {
                let alert = this.alertCtrl.create({
                    title: data.notification.payload.title,
                    subTitle: data.notification.payload.body,
                    buttons: ['OK']
                });
                alert.present();
            }
        });
        // Only turn this line on when doing development work
        // It sends very verbose messages to the screen for each event received
        //this.oneSignal.setLogLevel({logLevel: 6, visualLevel: 6});
        this.oneSignal.endInit();
        console.log('AppComponents: OneSignal setup complete');
        this.oneSignal.getIds().then((id) => {
            //console.log('OneSignal IDs: ' + JSON.stringify(id));
            console.log('PlayerID: ' + id.userId);
            this.localstorage.setLocalValue('PlayerID', id.userId);
        });
    }
    // The following pages require the user to be logged in.
    // If not, go to login page before continuing on
    // otherwise, go to requested page.
    NavigateToAuthenticatedPage(PageID) {
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            this.localstorage.setLocalValue('LoginWarning', '0');
            this.localstorage.setLocalValue('ForwardingPage', '');
            switch (PageID) {
                case "MyAgenda":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_18__pages_myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' });
                    break;
                case "MyAgendaFull":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_19__pages_myagendafull_myagendafull__["a" /* MyAgendaFull */], {}, { animate: true, direction: 'forward' });
                    break;
                case "CETracking":
                    this.menuCtrl.close();
                    this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' });
                    break;
                case "Notes":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_17__pages_notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' });
                    break;
            }
        }
        else {
            this.localstorage.setLocalValue('LoginWarning', '1');
            this.localstorage.setLocalValue('ForwardingPage', PageID);
            this.menuCtrl.close();
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
        }
    }
    EventDetails(EventID) {
        console.log("AppComponents: Btn ID: " + EventID);
        var IDSplit = EventID.split("|");
        var storeEventID = IDSplit[0].replace("'", "");
        var storePersonalEventID = IDSplit[1].replace("'", "");
        console.log("AppComponents: storeEventID: " + storeEventID);
        console.log("AppComponents: storePersonalEventID: " + storePersonalEventID);
        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        }
        else {
            if (storeEventID == "0") {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);
                // Navigate to Personal Event Details page
                this.menuCtrl.close();
                this.navCtrl.push('MyAgendaPersonal', { EventID: storePersonalEventID }, { animate: true, direction: 'forward' });
            }
            else {
                // Set EventID to LocalStorage
                this.localstorage.setLocalValue('EventID', storeEventID);
                // Navigate to Education Details page
                this.menuCtrl.close();
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_21__pages_educationdetails_educationdetails__["a" /* EducationDetailsPage */], { EventID: storeEventID }, { animate: true, direction: 'forward' });
            }
        }
    }
    ;
    openPage(page) {
        console.log('AppComponents: Selected side menu item: ' + page.title);
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            this.localstorage.setLocalValue('LoginWarning', '0');
            this.localstorage.setLocalValue('ForwardingPage', '');
            switch (page.naventry) {
                case "MyAgenda":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_18__pages_myagenda_myagenda__["a" /* MyAgenda */], {}, { animate: true, direction: 'forward' });
                    break;
                case "CETracking":
                    this.navCtrl.push('CetrackingPage', {}, { animate: true, direction: 'forward' });
                    break;
                case "Notes":
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_17__pages_notes_notes__["a" /* NotesPage */], {}, { animate: true, direction: 'forward' });
                    break;
                default:
                    this.navCtrl.setRoot(page.component);
                    this.activePage = page;
                    break;
            }
        }
        else {
            this.localstorage.setLocalValue('ForwardingPage', page.naventry);
            switch (page.naventry) {
                case "MyAgenda":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "MyAgendaFull":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "CETracking":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Notes":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "EventSurvey":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Profile":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Networking":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                case "Bookmarks":
                    this.localstorage.setLocalValue('LoginWarning', '1');
                    this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */], {}, { animate: true, direction: 'forward' });
                    break;
                default:
                    this.navCtrl.setRoot(page.component);
                    this.activePage = page;
                    break;
            }
        }
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        //this.navCtrl.setRoot(page.component);
        //this.activePage = page;
    }
    checkActive(page) {
        return page == this.activePage;
    }
    navToWebsite() {
        var WebsiteURL = "http://www.clearthunder.com/sandiego";
        // Open website
        window.open(WebsiteURL, '_system');
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["t" /* Nav */])
], MyApp.prototype, "navCtrl", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/petervroom/aacd19/src/app/app.html"*/'<ion-split-pane>\n\n	<ion-menu [content]="content" side="left" id="menu1">\n		<ion-header>\n			<ion-toolbar color=primary>\n				<ion-title>Menu</ion-title>\n				<ion-buttons end>\n					<button end ion-button menuClose icon-only color="light">\n						<ion-icon name="close"></ion-icon>\n					</button>\n				</ion-buttons>\n			</ion-toolbar>\n		</ion-header>\n\n		<ion-content>\n	\n			<img src="assets/img/orlando.png" (click)="navToWebsite()"><img>\n\n				<ion-list>\n				<ion-item tappable style="background:linear-gradient(to bottom right, #283593 0%, #283593 100%); color:#fff" \n			\n				(click)="NavigateToAuthenticatedPage(\'MyAgenda\')">\n					Upcoming Agenda Items\n				<ion-icon name="calendar" item-left></ion-icon>\n				</ion-item>\n\n\n				<ion-item tappable style="color:#444" (click)="EventDetails(upcomingAgenda.visEventID)" \n				*ngFor="let upcomingAgenda of upcomingAgendaItems" id="upcomingAgenda-list-item19">\n				<ion-icon item-start color="secondary" name="{{upcomingAgenda.eventTypeIcon}}"></ion-icon>\n				<p style="color: #444; font-weight:bold">\n				{{upcomingAgenda.EventName}}</p>		\n				<p style="color:#444">\n				{{upcomingAgenda.visEventTimeframe}}\n				</p>\n				<p>{{upcomingAgenda.EventLocation}}</p>\n				</ion-item>\n				</ion-list>\n\n              <ion-list>\n				<ion-item style="background:linear-gradient(to bottom right, #283593 0%, #283593 100%); color:#fff" (click)="NavigateToAuthenticatedPage(\'CETracking\')">\n					CE Credits Completed\n					<ion-icon name="school" item-left></ion-icon>\n				</ion-item>\n				<ion-item tappable style="border-color: rgba(0, 0, 0, 0);background-color: rgba(0, 0, 0, 0);\n				color: rgb(116, 33, 33);" (click)="NavigateToAuthenticatedPage(\'CETracking\')" id="cetrackervalue-list" >\n	\n									<p style="color: #444; font-size:1.2em">\n										{{creditsTypeL}}L / {{creditsTypeP}}P\n									</p>\n				</ion-item>\n\n\n			<ion-item tappable style="background:rgb(245, 245, 245); color:#444" \n			menuClose ion-item *ngFor="let p of pages" [class.activeHighlight]="checkActive(p)" (click)="openPage(p)">\n			<ion-icon color="secondary" name="{{p.icon}}" item-left></ion-icon>\n			{{p.title}}\n	\n			</ion-item>\n			</ion-list>\n\n		</ion-content>\n		\n	</ion-menu>\n\n	<ion-nav [root]="rootPage" main #content swipeBackEnabled="false"></ion-nav>\n\n</ion-split-pane>\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/app/app.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["x" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_8__ionic_native_keyboard__["a" /* Keyboard */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_7__ionic_native_onesignal__["a" /* OneSignal */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Events */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* MenuController */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_5__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_6__providers_localstorage_localstorage__["a" /* Localstorage */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 925:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RelativeTime; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_date_fns_distance_in_words_to_now__ = __webpack_require__(926);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_date_fns_distance_in_words_to_now___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_date_fns_distance_in_words_to_now__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


let RelativeTime = class RelativeTime {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(value, ...args) {
        return __WEBPACK_IMPORTED_MODULE_1_date_fns_distance_in_words_to_now___default()(new Date(value), { addSuffix: true });
    }
};
RelativeTime = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'relativeTime',
    })
], RelativeTime);

//# sourceMappingURL=relative-time.js.map

/***/ }),

/***/ 940:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PostService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mock_posts__ = __webpack_require__(941);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let PostService = class PostService {
    constructor() {
        this.posts = __WEBPACK_IMPORTED_MODULE_1__mock_posts__["a" /* POSTS */];
    }
    getAll() {
        return this.posts;
    }
    getItem(id) {
        for (var i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id === parseInt(id)) {
                return this.posts[i];
            }
        }
        return null;
    }
    remove(item) {
        this.posts.splice(this.posts.indexOf(item), 1);
    }
};
PostService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], PostService);

//# sourceMappingURL=post-service.js.map

/***/ }),

/***/ 941:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return POSTS; });
let POSTS = [
    {
        id: 0,
        user_id: 2,
        name: 'Ben Sparrow',
        content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so...',
        image: 'assets/img/pizza.jpg',
        face: 'assets/img/thumb/ben.png',
        time: 'Thursday 05:57 PM',
        liked: false,
        likeCount: 2,
        commentCount: 5,
        comments: [
            {
                id: 0,
                user_id: 2,
                name: 'Max Lynx',
                face: 'assets/img/thumb/max.png',
                liked: false,
                likeCount: 2,
                time: 'Thursday 05:57 PM',
                content: 'A wonderful serenity has taken possession'
            },
            {
                id: 1,
                user_id: 2,
                name: 'Adam Bradleyson',
                face: 'assets/img/thumb/adam.jpg',
                liked: true,
                likeCount: 1,
                time: 'Thursday 05:57 PM',
                content: 'I should buy a boat'
            },
            {
                id: 2,
                user_id: 2,
                name: 'Perry Governor',
                face: 'assets/img/thumb/perry.png',
                liked: true,
                likeCount: 3,
                time: 'Thursday 05:57 PM',
                content: 'Look at my mukluks!'
            },
            {
                id: 3,
                user_id: 2,
                name: 'Ben Sparrow',
                face: 'assets/img/thumb/ben.png',
                liked: true,
                likeCount: 1,
                time: 'Thursday 05:57 PM',
                content: 'You on your way?'
            }
        ]
    },
    {
        id: 1,
        user_id: 2,
        name: 'Max Lynx',
        content: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
        image: '',
        face: 'assets/img/thumb/max.png',
        time: 'Thursday 05:59 PM',
        liked: true,
        likeCount: 2,
        commentCount: 7,
        comments: []
    },
    {
        id: 2,
        user_id: 2,
        name: 'Adam Bradleyson',
        content: 'Far far away, behind the word mountains.',
        image: 'assets/img/burger.jpg',
        face: 'assets/img/thumb/adam.jpg',
        time: 'Thursday 06:06 PM',
        liked: false,
        likeCount: 2,
        commentCount: 2,
        comments: []
    },
    {
        id: 3,
        user_id: 2,
        name: 'Perry Governor',
        content: 'There live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.',
        image: '',
        face: 'assets/img/thumb/perry.png',
        time: 'Thursday 06:50 PM',
        liked: false,
        likeCount: 2,
        commentCount: 7,
        comments: []
    }
];
//# sourceMappingURL=mock-posts.js.map

/***/ }),

/***/ 942:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mock_users__ = __webpack_require__(943);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let UserService = class UserService {
    constructor() {
        this.users = __WEBPACK_IMPORTED_MODULE_1__mock_users__["a" /* USERS */];
    }
    getAll() {
        return this.users;
    }
    getItem(id) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === parseInt(id)) {
                return this.users[i];
            }
        }
        return null;
    }
    remove(item) {
        this.users.splice(this.users.indexOf(item), 1);
    }
};
UserService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], UserService);

//# sourceMappingURL=user-service.js.map

/***/ }),

/***/ 943:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return USERS; });
let USERS = [
    {
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'assets/img/thumb/ben.png',
        group: 'Friend'
    },
    {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'assets/img/thumb/max.png',
        group: 'Family'
    },
    {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'assets/img/thumb/adam.jpg',
        group: 'Friend'
    },
    {
        d: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'assets/img/thumb/perry.png',
        group: 'Friend'
    },
    {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'assets/img/thumb/mike.png',
        group: 'Family'
    },
    {
        id: 5,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'assets/img/thumb/ben.png',
        group: 'Friend'
    },
    {
        id: 6,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'assets/img/thumb/max.png',
        group: 'Family'
    }
];
//# sourceMappingURL=mock-users.js.map

/***/ }),

/***/ 944:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendeeBookmarksPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_database_database__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__ = __webpack_require__(61);
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







let AttendeeBookmarksPage = class AttendeeBookmarksPage {
    constructor(navCtrl, navParams, storage, databaseprovider, imageLoaderConfig, cd, loadingCtrl, localstorage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.databaseprovider = databaseprovider;
        this.imageLoaderConfig = imageLoaderConfig;
        this.cd = cd;
        this.loadingCtrl = loadingCtrl;
        this.localstorage = localstorage;
        this.bookmarksSessions = [];
        this.bookmarksSpeakers = [];
        this.bookmarksExhibitors = [];
        this.bookmarksAttendees = [];
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad AttendeeBookmarksPage');
    }
    ionViewDidEnter() {
        console.log('ionViewDidEnter SpeakersPage');
        this.LoadBookmarks();
    }
    LoadBookmarks() {
        // Load initial data set here
        let loading = this.loadingCtrl.create({
            spinner: 'crescent',
            content: 'Please wait...'
        });
        // Blank and show loading info
        this.imageLoaderConfig.setFallbackUrl('assets/img/personIcon.png');
        // Temporary use variables
        var flags;
        var visStartTime;
        var visEndTime;
        var eventIcon;
        var visEventName;
        var DisplayName;
        var visDisplayCredentials;
        var DisplayLocation = "";
        var visDisplayTitle;
        var visDisplayCompany;
        var visCityState = true;
        // Get the data
        var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
        if (AttendeeID != '' && AttendeeID != null) {
            this.bookmarksSessions = [];
            this.bookmarksSpeakers = [];
            this.bookmarksExhibitors = [];
            this.bookmarksAttendees = [];
            this.cd.markForCheck();
            loading.present();
            // -------------------
            // Get data: Sessions
            // -------------------
            flags = "li|Sessions";
            this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
                console.log("getBookmarksData: " + JSON.stringify(data));
                if (data['length'] > 0) {
                    for (var i = 0; i < data['length']; i++) {
                        var SubjectCodeCECredits = "";
                        var dbEventDateTime = data[i].session_start_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        var SQLDate = new Date(dbEventDateTime);
                        var DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");
                        var DisplayStartTime = dateFormat(SQLDate, "h:MMtt");
                        // Display end time
                        dbEventDateTime = data[i].session_end_time.substring(0, 19);
                        dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                        dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                        SQLDate = new Date(dbEventDateTime);
                        DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");
                        var visEventName = data[i].session_title;
                        var DisplayDateRoom = "";
                        if (data[i].RoomName.length == 0) {
                            DisplayDateRoom = DisplayDateTime;
                        }
                        else {
                            DisplayDateRoom = DisplayDateTime + " in " + data[i].RoomName;
                        }
                        SubjectCodeCECredits = "ID: " + data[i].session_id;
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
                        this.bookmarksSessions.push({
                            DisplayEventName: visEventName,
                            DisplayEventTimeDateLocation: DisplayDateRoom,
                            SpeakerDisplayName: data[i].other_speakers,
                            EventID: data[i].session_id,
                            DisplaySubjectCodeCECredits: SubjectCodeCECredits,
                            SessionStatusStyle: visStatusStyle,
                            SessionStatus: visSessionStatus,
                            navigationArrow: "arrow-dropright"
                        });
                    }
                }
                else {
                    this.bookmarksSessions.push({
                        DisplayEventName: "No bookmarks saved for Sessions",
                        DisplayEventTimeDateLocation: "",
                        SpeakerDisplayName: "",
                        EventID: 0,
                        DisplaySubjectCodeCECredits: "",
                        SessionStatusStyle: "SessionStatusNormal",
                        SessionStatus: "",
                        navigationArrow: ""
                    });
                }
                //this.cd.markForCheck();
                // -------------------
                // Get data: Speakers
                // -------------------
                flags = "li|Speakers";
                this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
                    console.log("getBookmarksData: " + JSON.stringify(data));
                    if (data['length'] > 0) {
                        for (var i = 0; i < data['length']; i++) {
                            DisplayName = "";
                            // Concatenate fields to build displayable name
                            DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
                            // Use Credentials field for Company/Association
                            visDisplayCredentials = "";
                            if (data[i].Company != "") {
                                visDisplayCredentials = data[i].Company;
                            }
                            var imageAvatar = data[i].imageFilename;
                            imageAvatar = "https://naeyc.convergence-us.com/AdminGateway/images/Speakers/" + imageAvatar;
                            this.bookmarksSpeakers.push({
                                SpeakerID: data[i].speakerID,
                                DisplayNameLastFirst: DisplayName,
                                DisplayCredentials: visDisplayCredentials,
                                DisplayTitle: data[i].Title,
                                Affiliation: "",
                                speakerAvatar: imageAvatar,
                                navigationArrow: "arrow-dropright"
                            });
                        }
                    }
                    else {
                        this.bookmarksSpeakers.push({
                            SpeakerID: 0,
                            DisplayNameLastFirst: "No bookmarks saved for Speakers",
                            DisplayCredentials: "",
                            DisplayTitle: "",
                            Affiliation: "",
                            speakerAvatar: "",
                            navigationArrow: ""
                        });
                    }
                    //this.cd.markForCheck();
                    // -------------------
                    // Get data: Exhibitors
                    // -------------------
                    flags = "li|Exhibitors";
                    this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
                        console.log("getBookmarksData: " + JSON.stringify(data));
                        if (data['length'] > 0) {
                            for (var i = 0; i < data['length']; i++) {
                                if ((data[i].City === null) || (data[i].City == "")) {
                                    visCityState = false;
                                }
                                else {
                                    // Construct location based on US or International
                                    if ((data[i].Country != "United States") && (data[i].Country != "")) {
                                        DisplayLocation = data[i].City + ", " + data[i].Country;
                                    }
                                    else {
                                        DisplayLocation = data[i].City + ", " + data[i].State;
                                    }
                                    visCityState = true;
                                }
                                this.bookmarksExhibitors.push({
                                    ExhibitorID: data[i].ExhibitorID,
                                    CompanyName: data[i].CompanyName,
                                    DisplayCityState: DisplayLocation,
                                    CityStateShow: visCityState,
                                    BoothNumber: "Booth: " + data[i].BoothNumber,
                                    exhibitorIcon: "people",
                                    exhibitorClass: "myLabelBold",
                                    navigationArrow: "arrow-dropright"
                                });
                            }
                        }
                        else {
                            this.bookmarksExhibitors.push({
                                ExhibitorID: 0,
                                CompanyName: "No bookmarks saved for Exhibitors",
                                DisplayCityState: "",
                                CityStateShow: false,
                                BoothNumber: "",
                                exhibitorIcon: "",
                                exhibitorClass: "myLabelBold",
                                navigationArrow: ""
                            });
                        }
                        //this.cd.markForCheck();
                        // -------------------
                        // Get data: Attendees
                        // -------------------
                        flags = "li|Attendees";
                        this.databaseprovider.getBookmarksData(flags, AttendeeID).then(data => {
                            console.log("getBookmarksData: " + JSON.stringify(data));
                            if (data['length'] > 0) {
                                for (var i = 0; i < data['length']; i++) {
                                    DisplayName = "";
                                    // Concatenate fields to build displayable name
                                    DisplayName = DisplayName + data[i].LastName + ", " + data[i].FirstName;
                                    // Use Credentials field for Company/Association
                                    visDisplayTitle = "";
                                    if (data[i].Title != "") {
                                        visDisplayTitle = data[i].Title;
                                    }
                                    visDisplayCompany = "";
                                    if (data[i].Company != "") {
                                        visDisplayCompany = data[i].Company;
                                    }
                                    var imageAvatar = "https://naeyc.convergence-us.com/AdminGateway/images/Attendees/" + data[i].AttendeeID + ".jpg";
                                    console.log('imageAvatar: ' + imageAvatar);
                                    this.bookmarksAttendees.push({
                                        AttendeeID: data[i].AttendeeID,
                                        AttendeeName: DisplayName,
                                        AttendeeTitle: visDisplayTitle,
                                        AttendeeOrganization: visDisplayCompany,
                                        AttendeeAvatar: imageAvatar,
                                        navigationArrow: "arrow-dropright"
                                    });
                                }
                            }
                            else {
                                this.bookmarksAttendees.push({
                                    AttendeeID: 0,
                                    AttendeeName: "No bookmarks saved for Attendees",
                                    AttendeeTitle: "",
                                    AttendeeOrganization: "",
                                    AttendeeAvatar: "",
                                    navigationArrow: ""
                                });
                            }
                            loading.dismiss();
                            this.cd.markForCheck();
                        }).catch(function () {
                            console.log("Promise Rejected");
                        });
                    }).catch(function () {
                        console.log("Promise Rejected");
                    });
                }).catch(function () {
                    console.log("Promise Rejected");
                });
            }).catch(function () {
                console.log("Promise Rejected");
            });
        }
        else {
            console.log('User not logged in');
            loading.dismiss();
        }
    }
    EventDetails(EventID) {
        if (EventID != 0) {
            this.localstorage.setLocalValue('EventID', EventID);
            this.navCtrl.push('EducationDetailsPage', { EventID: EventID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    ExhibitorDetails(ExhibitorID) {
        if (ExhibitorID != 0) {
            this.navCtrl.push('ExhibitorDetailsPage', { ExhibitorID: ExhibitorID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    SpeakerDetails(SpeakerID) {
        if (SpeakerID != 0) {
            this.navCtrl.push('SpeakerDetailsPage', { SpeakerID: SpeakerID }, { animate: true, direction: 'forward' });
        }
    }
    ;
    AttendeeDetails(oAttendeeID) {
        if (oAttendeeID != 0) {
            this.localstorage.setLocalValue("oAttendeeID", oAttendeeID);
            this.navCtrl.push('AttendeesProfilePage', { oAttendeeID: oAttendeeID }, { animate: true, direction: 'forward' });
        }
    }
};
AttendeeBookmarksPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-attendeebookmarks',template:/*ion-inline-start:"/Users/petervroom/aacd19/src/pages/attendeebookmarks/attendeebookmarks.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Bookmarks</ion-title>\n	</ion-navbar>\n</ion-header>\n\n\n<ion-content style="padding:0!important;margin:0!important">\n		\n	<!-- Sessions -->\n	<ion-card>\n		<ion-card-header style="background:#0b172a; color:#fff">\n			<h2 style="color:#fff">Sessions</h2>\n		</ion-card-header>\n		<ion-card-content>\n			<ion-item (click)="EventDetails(session.EventID)" *ngFor="let session of bookmarksSessions" id="bookmarks-list-item19" >\n				<ion-icon item-left style="color:#7f8285" name="list-box"></ion-icon>\n				<ion-icon item-right name="{{session.navigationArrow}}"></ion-icon>\n				<h2 text-wrap>{{session.DisplayEventName}}</h2>\n				<p>{{session.DisplayEventTimeDateLocation}}</p>\n				<p>{{session.SpeakerDisplayName}}</p>\n				<p>{{session.DisplaySubjectCodeCECredits}}</p>\n				<p [ngClass]="session.SessionStatusStyle">{{session.SessionStatus}}</p>\n			</ion-item>\n		</ion-card-content>\n	</ion-card>\n\n	<!-- Speakers -->\n	<ion-card>\n		<ion-card-header style="background:#0b172a; color:#fff">\n			<h2 style="color:#fff">Speakers</h2>\n		</ion-card-header>\n		<ion-card-content>\n			<ion-item (click)="SpeakerDetails(speaker.SpeakerID)" *ngFor="let speaker of bookmarksSpeakers" id="speakers-list-item19" >\n				<div style="float: left; padding-right: 10px;">\n					<ion-avatar item-start>\n						<img-loader [src]="speaker.speakerAvatar" useImg [spinner]=false></img-loader>\n					</ion-avatar>\n				</div>\n				<ion-icon item-right name="{{speaker.navigationArrow}}"></ion-icon>\n				<h2 style="padding-top: 7px">{{speaker.DisplayNameLastFirst}}</h2>\n				<p>{{speaker.DisplayTitle}}</p>\n				<p>{{speaker.DisplayCredentials}}</p>\n			</ion-item>\n		</ion-card-content>\n	</ion-card>\n\n	<!-- Exhibitors -->\n	<ion-card>\n		<ion-card-header style="background:#0b172a; color:#fff">\n			<h2 style="color:#fff">Exhibitors</h2>\n		</ion-card-header>\n		<ion-card-content>\n			<ion-item (click)="ExhibitorDetails(exhibitor.ExhibitorID)" *ngFor="let exhibitor of bookmarksExhibitors" id="exhibitors-list-item19" >\n				<ion-icon item-left name="people"></ion-icon>\n				<ion-icon item-right name="{{exhibitor.navigationArrow}}"></ion-icon>\n				<h2>{{exhibitor.CompanyName}}</h2>\n				<p *ngIf=exhibitor.CityStateShow>{{exhibitor.DisplayCityState}}</p>\n				<p>{{exhibitor.BoothNumber}}</p>\n			</ion-item>\n		</ion-card-content>\n	</ion-card>\n\n	<!-- Attendees -->\n	<ion-card>\n		<ion-card-header style="background:#0b172a; color:#fff">\n			<h2 style="color:#fff">Attendees</h2>\n		</ion-card-header>\n		<ion-card-content>\n			<ion-item (click)="AttendeeDetails(attendee.AttendeeID)" *ngFor="let attendee of bookmarksAttendees" id="attendees-list-item19" >\n				<ion-avatar item-start>\n					<img-loader [src]="attendee.AttendeeAvatar" useImg [spinner]=false></img-loader>\n				</ion-avatar>\n				<ion-icon item-right name="{{attendee.navigationArrow}}"></ion-icon>\n				<h2>{{attendee.AttendeeName}}</h2>\n				<h3>{{attendee.AttendeeTitle}}</h3>\n				<h3>{{attendee.AttendeeOrganization}}</h3>\n			</ion-item>\n		</ion-card-content>\n	</ion-card>\n\n</ion-content>\n\n\n\n\n'/*ion-inline-end:"/Users/petervroom/aacd19/src/pages/attendeebookmarks/attendeebookmarks.html"*/,
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_4__providers_database_database__["a" /* Database */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_image_loader__["a" /* ImageLoaderConfig */],
        __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_localstorage_localstorage__["a" /* Localstorage */]])
], AttendeeBookmarksPage);

//# sourceMappingURL=attendeebookmarks.js.map

/***/ })

},[540]);
//# sourceMappingURL=main.js.map