// Components, functions, plugins
import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavController, Nav, Platform, AlertController, App, IonicApp, IonicErrorHandler, IonicModule, MenuController } from 'ionic-angular';
import { LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Database } from "../providers/database/database";
import { Localstorage } from '../providers/localstorage/localstorage';
import { OneSignal } from '@ionic-native/onesignal';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { Keyboard } from '@ionic-native/keyboard';

// Pages
import { HomePage } from '../pages/home/home';
import { ConferenceCityPage } from '../pages/conferencecity/conferencecity';
import { MorePage } from '../pages/more/more';
import { HelpPage } from '../pages/help/help';
import { SpeakersPage } from '../pages/speakers/speakers';
import { ProgramPage } from '../pages/program/program';
import { MapPage } from '../pages/map/map';
import { LoginPage } from '../pages/login/login';
import { ExhibitorsPage } from '../pages/exhibitors/exhibitors';
import { CetrackingPage } from '../pages/cetracking/cetracking';
import { NotesPage } from '../pages/notes/notes';
import { MyAgenda } from '../pages/myagenda/myagenda';
import { MyAgendaFull } from '../pages/myagendafull/myagendafull';
import { EvaluationConference } from '../pages/evaluationconference/evaluationconference';
import { EducationDetailsPage } from '../pages/educationdetails/educationdetails';

// New pages added for social networking
import { ActivityPage } from '../pages/activity/activity';
import { ProfilePage } from '../pages/profile/profile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { NetworkingPage } from '../pages/networking/networking';
import { AttendeeBookmarksPage } from '../pages/attendeebookmarks/attendeebookmarks';
import { AttendeesPage } from '../pages/attendees/attendees';
import { ConversationsPage } from '../pages/conversations/conversations';
import { SocialPage } from '../pages/social/social';

// Temporary Support Pages
//import { FloorplanMappingPage } from '../pages/floorplanmapping/floorplanmapping';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
	templateUrl: 'app.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class MyApp {

	@ViewChild(Nav) navCtrl: Nav;

	rootPage: any = HomePage;
	loader: any;
	pages: Array<{title: string, icon: string, component: any, naventry: string}>;
	activePage: any;
	public upcomingAgendaItems: any[] = [];
	public creditsTypeL: string;
	public creditsTypeP: string;
	public DevicePlatform: string;

	public appInfo: any;
	public deployInfo: any;

	
	constructor(
		public pltfrm: Platform,
		public loadingCtrl: LoadingController,
		public storage: Storage,
		private keyboard: Keyboard,
		public alertCtrl: AlertController, 
		private splashScreen: SplashScreen,
		private oneSignal: OneSignal,
		//private IonicPro: Pro,
		public events: Events,
		public menuCtrl: MenuController,
		private cd: ChangeDetectorRef,
		private statusBar: StatusBar,
		private databaseprovider: Database,
		private localstorage: Localstorage) {

		
		this.initializeApp();
		
		//this.enableIonicPro();

		//show and hide Ionic Keyboard
		//this.keyboard.show();
		//this.keyboard.hide();

		
		// used for an example of ngFor and navigation
		this.pages = [
		
		  { title: 'Home', icon: 'home', component: HomePage, naventry: 'Home' },
		  { title: 'My Agenda', icon: 'calendar', component: MyAgenda, naventry: 'MyAgenda' },
		  { title: 'Program', icon: 'document', component: ProgramPage, naventry: 'Program' },
		  { title: 'Speakers', icon: 'mic', component: SpeakersPage, naventry: 'Speakers' },
		  { title: 'My Agenda', icon: 'calendar', component: MyAgenda, naventry: 'MyAgenda' },
		  { title: 'Exhibitors', icon: 'people', component: ExhibitorsPage, naventry: 'Exhibitors' },
		  { title: 'CE Tracking', icon: 'school', component: 'CetrackingPage', naventry: 'CETracking' },
		  { title: 'Networking', icon: 'contacts', component: NetworkingPage, naventry: 'Networking' },
		  //{ title: 'My Agenda Full', icon: 'calendar', component: MyAgendaFull, naventry: 'MyAgendaFull' },
		  { title: 'Maps', icon: 'map', component: MapPage, naventry: 'Map' },
		  { title: 'San Diego', icon: 'navigate', component: ConferenceCityPage, naventry: 'SanDiego' },
		  { title: 'AACD Social Media', icon: 'text', component: SocialPage, naventry: 'SocialMedia' },
		  { title: 'Help', icon: 'help-circle', component: HelpPage, naventry: 'Help' },
		  { title: 'Notes', icon: 'create', component: NotesPage, naventry: 'Notes' },
		  { title: 'Event Survey', icon: 'bookmarks', component: EvaluationConference, naventry: 'EventSurvey' },
		  { title: 'Sign In / Out', icon: 'log-in', component: LoginPage, naventry: 'Login' }
		//{ title: 'Floor Plan', icon: 'map', component: FloorplanMappingPage, naventry: 'FloorplanMapping' },

		];


		this.activePage = this.pages[0];

		// Listen for login/logout events and 
		// refresh side menu dashboard
		this.events.subscribe('user:Status', (LoginType) => {
			console.log('AppComponents: User has ', LoginType)
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

				if (data['length']>0) {
					
					console.log('AppComponents: Processing agenda data');
					if (data['length'] > 4) {
						maxRecs = 4;
					} else {
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
						} else {
							eventIcon = "list";
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


				} else {
					
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

				if (data2['length']>0) {
					
					console.log('AppComponents: Processing ' + data2['length'] + ' record(s)');
					
					for (var i = 0; i < data2['length']; i++) {

						var EvalType = data2[i].ce_credits_type.substring(0, 1);

						var iconSet = 0;

						if (EvalType == "") {                                           					// Evals that don't require an eval are completed
							iconSet = 1;
							//sumCreditsL = sumCreditsL + parseFloat(data2[i].CEcreditsL);
							//sumCreditsP = sumCreditsP + parseFloat(data2[i].CEcreditsP);
						}
						if (data2[i].ceStatusScan == "0" && iconSet == 0) {     								// No scan (shouldn't happen with AACD)
							iconSet = 1;
						}
						if ((data2[i].Evaluated == "0" || data2[i].Evaluated === null) && iconSet == 0) {     // Eval not completed
							iconSet = 1;
						}
						if (iconSet == 0) {                                             					// Otherwise mark as completed
							//sumCreditsL = sumCreditsL + parseFloat(data2[i].CEcreditsL);
							//sumCreditsP = sumCreditsP + parseFloat(data2[i].CEcreditsP);
						}
						
						sumCreditsL = sumCreditsL + parseFloat(data2[i].CEcreditsL);
						sumCreditsP = sumCreditsP + parseFloat(data2[i].CEcreditsP);

					}

					this.creditsTypeL = sumCreditsL.toFixed(2);
					this.creditsTypeP = sumCreditsP.toFixed(2);
					this.cd.markForCheck();

				} else {

					console.log('AppComponents: Nothing to process for CE');
					this.creditsTypeL = '0.00';
					this.creditsTypeP = '0.00';
					this.cd.markForCheck();

				}

			}).catch(function () {
				console.log("AppComponents: Promise Rejected");
			});
			
		} else {
			
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

     //Set status bar appearance
	 this.statusBar.overlaysWebView(false);
	 this.statusBar.backgroundColorByHexString('#283593');
	 this.statusBar.styleLightContent();
      
			
			// Temporary hard coding when not logged in
			this.localstorage.setLocalValue("AgendaDays", "4");
			this.localstorage.setLocalValue("AgendaDates", "2019-04-24|2019-04-25|2019-04-26|2019-04-27|");
			this.localstorage.setLocalValue("AgendaDayButtonLabels", "4/24|4/25|4/26|4/27|");
			
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

			} else {
				console.log('AppComponents: Running in a browser');
			}
			
		//	this.splashScreen.hide();

		this.splashScreen.show();

        this.splashScreen.hide();
						
		});
	}

	// OneSignal Push
	initOneSignalNotification()
	{
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

		if (AttendeeID !='' && AttendeeID != null) {

			this.localstorage.setLocalValue('LoginWarning', '0');
			this.localstorage.setLocalValue('ForwardingPage', '');
			switch(PageID) {
				case "MyAgenda":
					this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'});
					break;
				case "MyAgendaFull":
					this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'});
					break;
				case "CETracking":
					this.menuCtrl.close();
					this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'});
					break;
				case "Notes":
					this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'});
					break;
			}
			
		} else {
			
			this.localstorage.setLocalValue('LoginWarning', '1');
			this.localstorage.setLocalValue('ForwardingPage', PageID);
			this.menuCtrl.close();
			this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});

		}
			
	
	}
	
    EventDetails(EventID) {
		
		console.log("AppComponents: Btn ID: " + EventID);
		
        var IDSplit = EventID.split("|");

        var storeEventID = IDSplit[0].replace("'","");
        var storePersonalEventID = IDSplit[1].replace("'", "");
		console.log("AppComponents: storeEventID: " + storeEventID);
		console.log("AppComponents: storePersonalEventID: " + storePersonalEventID);

        if (storeEventID == "0" && storePersonalEventID == "0") {
            // Do nothing
        } else {
            if (storeEventID == "0") {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('PersonalEventID', storePersonalEventID);

                // Navigate to Personal Event Details page
				this.menuCtrl.close();
				this.navCtrl.push('MyAgendaPersonal', {EventID: storePersonalEventID}, {animate: true, direction: 'forward'});

            } else {

                // Set EventID to LocalStorage
				this.localstorage.setLocalValue('EventID', storeEventID);

                // Navigate to Education Details page
				this.menuCtrl.close();
				this.navCtrl.push(EducationDetailsPage, {EventID: storeEventID}, {animate: true, direction: 'forward'});

            }
        }
    };

	openPage(page) {

		console.log('AppComponents: Selected side menu item: ' + page.title);
		
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');

		if (AttendeeID !='' && AttendeeID != null) {

			this.localstorage.setLocalValue('LoginWarning', '0');
			this.localstorage.setLocalValue('ForwardingPage', '');
			switch(page.naventry) {
				case "MyAgenda":
					this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'});
					break;
				case "CETracking":
					this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'});
					break;
				case "Notes":
					this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'});
					break;
				default:
					this.navCtrl.setRoot(page.component);
					this.activePage = page;
					break;
			}
			
		} else {
			
			this.localstorage.setLocalValue('ForwardingPage', page.naventry);
			switch(page.naventry) {
				case "MyAgenda":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "MyAgendaFull":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "CETracking":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "Notes":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "EventSurvey":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "Profile":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "Networking":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
					break;
				case "Bookmarks":
					this.localstorage.setLocalValue('LoginWarning', '1');
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
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

	checkActive(page){
		return page == this.activePage;
	}

	navToWebsite() {

        var WebsiteURL = "http://events.clearthunder.com/ORLANDO2020";

		// Open website
		window.open(WebsiteURL, '_system');

    }
	
}

