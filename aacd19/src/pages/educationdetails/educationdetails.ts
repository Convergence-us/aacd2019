// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';
import * as L from "leaflet";

// Pages
import { LoginPage } from '../login/login';
import { MyAgenda } from '../myagenda/myagenda';

declare var dateFormat: any;

@Component({
  selector: 'page-educationdetails',
  templateUrl: 'educationdetails.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EducationDetailsPage {

	// Exhibitor Details
	public EventID: string;
	public EventName: string;
	public EventSubName: string;
	public DisplayEventTimeDateLocation: string;
	public SpeakerDisplayName: string;
	public EventTypeName: string;
	public visAgendaAddRemoveButton: string;
	public SpeakerHostEmcee: string;
	public EventCorporateSupporter: string;
	public EventDetails: string;
	public sessionAbstract: string;
	public HandoutFn: string;	
	public HandoutURL: string;
	
	// Control Buttons
	// Disabled per Lisa Bollenbach 2018-04-19
	public btnAgendaManagement = false;
	public btnNotes = true;
	public btnPrint = true;

	// SubSection Control
	public SpeakerHostShow = true;
	public CorporateSupporterShow = true;
	public AuthorsDisplay = false;
	public AbstractDisplay = true;
	public DescriptionDisplay = true;
	public SubEventsDisplay = false;
	public RecordingShow = true;
	public HandoutShow = true;
	public MeetingLocationDisplay = true;

	// Other Information block control
	public OtherInformationDisplay = true;
	public DisplayRow1 = true;
	public DisplayRow2 = true;
	public DisplayRow3 = true;
	public DisplaySubject = true;
	public DisplayCECredits = true;
	public DisplayType = true;
	public DisplayCECreditsType = true;
	
	public SpeakerList: any[] = [];

	// Other Information
	public vSubjectCode: string;
	public vCECredits: string;
	public vCECreditsType: string;
	public vSessionType: string;
	public vSessionLevel: string;
	public SessionStatusStyle: string;
	public SessionStatus: string;
	
	// Leaflet mapping variables
	myMap: any;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				private alertCtrl: AlertController, 
				public events: Events,
				public loadingCtrl: LoadingController,
				private localstorage: Localstorage) {
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

			if (data['length']>0) {

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
                } else {
                    PrimarySpeakerName = data[0].primary_speaker;
                }

				console.log("Educationa Details, Set session title");
                this.EventName = data[0].session_title;
                //this.EventSubName = data[0].EventSubName;

				console.log("Educationa Details, Add room name");
                if (data[0].RoomName.length == 0) {
                    this.DisplayEventTimeDateLocation = DisplayDateTime;
                } else {
                    this.DisplayEventTimeDateLocation = DisplayDateTime + " in " + data[0].RoomName;
                }
				
				console.log("Educationa Details, Set speaker name");
                this.SpeakerDisplayName = PrimarySpeakerName;
                //this.EventTypeName = data[0].EventTypeName;
				
				console.log('Host: ' + data[0].speaker_host_emcee);
				
                if ((data[0].speaker_host_emcee === undefined) || (data[0].speaker_host_emcee === "") || (data[0].speaker_host_emcee === null)) {
                    this.SpeakerHostShow = false;
                } else {
                    this.SpeakerHostEmcee = data[0].speaker_host_emcee;
                }

                if ((data[0].corporate_supporter === undefined) || (data[0].corporate_supporter === "") || (data[0].corporate_supporter === null)) {
                    this.CorporateSupporterShow = false;
                } else {
                    this.EventCorporateSupporter = data[0].corporate_supporter;
                }

                UpdatedEventDescription2 = data[0].description;
                UpdatedEventDescription2 = UpdatedEventDescription2.replace(/\\/g, '');
                UpdatedEventDescription = UpdatedEventDescription2.replace("Educational Objectives:","<br/><br/><b>Educational Objectives:</b>");
                UpdatedEventDescription = UpdatedEventDescription.replace("1.", "<br/>1.");
                UpdatedEventDescription = UpdatedEventDescription.replace("2.", "<br/>2.");
                UpdatedEventDescription = UpdatedEventDescription.replace("3.", "<br/>3.");
                UpdatedEventDescription = UpdatedEventDescription.replace("4.", "<br/>4.");
                UpdatedEventDescription = UpdatedEventDescription.replace("5.", "<br/>5.");
                UpdatedEventDescription = UpdatedEventDescription.replace("6.", "<br/>6.");
                UpdatedEventDescription = UpdatedEventDescription.replace("DISCLAIMER:","<br/><br/><b>DISCLAIMER:</b>");
                UpdatedEventDescription = UpdatedEventDescription.replace("Learning Objectives:","<br/><br/><b>Learning Objectives:</b>");
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
                this.localstorage.setLocalValue("EventStartTime", data[0].session_start_time.substring(11,19));
                this.localstorage.setLocalValue("EventEndTime", data[0].session_end_time.substring(11,19));
                this.localstorage.setLocalValue("EventLocation", data[0].RoomName);
                this.localstorage.setLocalValue("EventName", data[0].session_title);
                this.localstorage.setLocalValue("EventDate", data[0].session_start_time.substring(0,10));

                if (data[0].ce_credits_type == "") {
                    this.AbstractDisplay = false;
                } else {
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
                } else {
                    this.visAgendaAddRemoveButton = "Add";
                }

				// Other Information grid
				this.vSubjectCode = data[0].subject;
				this.vCECredits = data[0].cs_credits;
				this.vCECreditsType = data[0].ce_credits_type;
				this.vSessionType = data[0].type;
				this.vSessionLevel = data[0].level;

				// Individual fields
				//if (data[0].subject.length == 0 || data[0].subject == '' || data[0].subject == null) {
				//	this.DisplaySubject = false;
				//}
				if (data[0].cs_credits.length == 0 || data[0].cs_credits == '' || data[0].cs_credits == null) {
					this.DisplayCECredits = false;
				}
				if (data[0].type.length == 0 || data[0].type == '' || data[0].type == null) {
					this.DisplayType = false;
				}
				if (data[0].ce_credits_type.length == 0 || data[0].ce_credits_type == '' || data[0].ce_credits_type == null) {
					this.DisplayCECreditsType = false;
				}

				// Entire rows
				if ((data[0].subject.length == 0 || data[0].subject == '' || data[0].subject == null) && (data[0].cs_credits.length == 0 || data[0].cs_credits == '' || data[0].cs_credits == null)) {
					this.DisplayRow1 = false;
				}
				if ((data[0].type.length == 0 || data[0].type == '' || data[0].type == null) && (data[0].ce_credits_type.length == 0 || data[0].ce_credits_type == '' || data[0].ce_credits_type == null)) {
					this.DisplayRow2 = false;
				}
				if (data[0].level.length == 0 || data[0].level == '' || data[0].level == null) {
					this.DisplayRow3 = false;
				}
				
				
				// Entire block
				if (this.DisplayRow1 == false && this.DisplayRow2 == false && this.DisplayRow3 == false) {
					this.OtherInformationDisplay = false;
				}
				
				
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
					} else {
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
				} else {
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
                } else {

					this.MeetingLocationDisplay = true;
					
                    // Simple coordinate system mapping
					console.log('Meeting room mapping: Simple coordinate system mapping');
                    this.myMap = L.map('map1', {
                        crs: L.CRS.Simple,
                        minZoom: -2,
						maxZoom: 0,
				        zoomControl: true
                    });

					console.log('Meeting room mapping: Set bounds');
					var bounds = L.latLngBounds([0, 0], [1500, 2000]);

					console.log('Meeting room mapping: Add image');
					var image = L.imageOverlay('assets/img/SessionRooms.png', bounds, {
						attribution: 'Convergence'
					}).addTo(this.myMap);
					
					console.log('Meeting room mapping: Set Fit and max bounds');
                    this.myMap.fitBounds(bounds);
					this.myMap.setMaxBounds(bounds);

					console.log('Meeting room mapping: Set pindrop position');
					var CongressionalOffice = L.latLng([RoomY, RoomX]);

					console.log('Meeting room mapping: Display pindrop');
					L.marker(CongressionalOffice).addTo(this.myMap)
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
					
                } else {
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
			this.navCtrl.push('SpeakerDetailsPage', {SpeakerID: SpeakerID}, {animate: true, direction: 'forward'});
        }

    };

    printWindow() {
        window.open('https://www.google.com/cloudprint/#printers', '_system');
    };

    openPDF(PDFURL) {
        var ref = window.open(PDFURL, '_system');
    };

    navToMyAgenda() {

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		if (AttendeeID != '' && AttendeeID != null) {
			// If not, store the page they want to go to and go to the Login page
			console.log('Stored AttendeeID: ' + AttendeeID);
			this.localstorage.setLocalValue('NavigateToPage', "MyAgenda");
			this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
		} else {
			// Otherwise just go to the page they want
			this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'});
		}

	};

    navToNotes(EventID) {

		console.log("NoteDetails: " + EventID);

		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		if (AttendeeID == '' || AttendeeID == null) {
			// If not, store the page they want to go to and go to the Login page
			console.log('Stored AttendeeID: ' + AttendeeID);
			this.localstorage.setLocalValue('NavigateToPage', "NotesDetailsPage");
			this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
		} else {
			// Otherwise just go to the page they want
			this.navCtrl.push('NotesDetailsPage', {EventID: EventID}, {animate: true, direction: 'forward'});
		}

	};
	
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
			LastUpdateDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
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

				if (data['length']>0) {

                    console.log("Return status: " + data[0].AddStatus);

					if (data[0].AddStatus == "Success") {
						
						this.events.publish('user:Status', 'AgendaItem Add');
						this.visAgendaAddRemoveButton = "Remove";
						this.cd.markForCheck();
						
					} else {
						
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
			
        } else {

            // -----------------------
            // Remove Item from Agenda
            // -----------------------
			flags = 'dl|0|' + EventID + '|' + EventStartTime + '|' + EventEndTime + '|' + EventLocation + '|' + EventName + '|' + EventDate + '|' + AAOID + '|' + LastUpdateDate;
			console.log("flags: " + flags);
			
			this.databaseprovider.getAgendaData(flags, AttendeeID).then(data => {
				
				console.log("getAgendaData: " + JSON.stringify(data));

				if (data['length']>0) {

                    console.log("Return status: " + data[0].DeleteStatus);

					if (data[0].DeleteStatus == "Success") {
						
						this.events.publish('user:Status', 'AgendaItem Remove');
						this.visAgendaAddRemoveButton = "Add";
						this.cd.markForCheck();
						
					} else {
						
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

    };

}