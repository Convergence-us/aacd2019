// Components, functions, plugins
import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Localstorage } from './../../providers/localstorage/localstorage';
import { Synchronization } from "../../providers/synchronization/synchronization";

// Pages
import { HomePage } from '../home/home';
import { NotesPage } from '../notes/notes';
import { MyAgenda } from '../myagenda/myagenda';
import { MyAgendaFull } from '../myagendafull/myagendafull';
import { EvaluationConference } from '../evaluationconference/evaluationconference';

declare var formatTime: any;
declare var dateFormat: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {

	// Setup page variables
	LoginName: string;
	LoginPassword: string;
	LoggedInUser: string = "";
	public LoginSection = false;
	public LogoutSection = false;
	public msgRequireLogin = false;
	public msgRequireLogin2 = false;
	public displayMultipleLogins = false;
	public displayMultipleLoginsDropdown = false;
	public selectedLogin: Array<any>;
	public LoginButton = false;
	public LoginSelectButton = false;

	public login: any[] = [];
	public teammembers: any[] = [];

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public http: Http, 
				private alertCtrl: AlertController, 
				private storage: Storage,
				private cd: ChangeDetectorRef,
				private syncprovider: Synchronization,
				private localstorage: Localstorage,
				public events: Events,
				public loadingCtrl: LoadingController) {

				/* Determine currently logged in user */
				var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
				var LoginName = this.localstorage.getLocalValue('LoginFullName');
				
				if (AttendeeID == '' || AttendeeID == null) {
					console.log('LS AttendeeID blank');
					this.LoginSection = true;
					this.LogoutSection = false;
				} else {
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.LoginSection = false;
					this.LogoutSection = true;
				}
				
				if (LoginName != '' && LoginName != null) {
					console.log('Stored LoginName: ' + LoginName);
					this.LoggedInUser = LoginName;
				} else {
					console.log('User not logged in');
					this.LoggedInUser = '';
				}

				var WarningStatus = this.localstorage.getLocalValue("LoginWarning");
				if (WarningStatus == "1") {			// Screen requires account access
					this.msgRequireLogin = true;
					this.msgRequireLogin2 = false;
				}
				if (WarningStatus == "2") {			// Agenda requires account access
					this.msgRequireLogin = false;
					this.msgRequireLogin2 = true;
				}

	}

	SetTeamMember(event) {
		console.log("SetTeamMember function: " + JSON.stringify(event));
	}

	// If page is in Sign In mode and user hits enter (from web version 
	// or mobile keyboard), initiate LoginUser function
	@HostListener('document:keypress', ['$event'])
		handleKeyboardEvent(event: KeyboardEvent) { 
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
		this.localstorage.setLocalValue("AgendaDays", '');
		this.localstorage.setLocalValue("AgendaDates", '');
		this.localstorage.setLocalValue("AgendaDayButtonLabels", '');
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
			
		} else {
		
			// Reset stored values
			this.localstorage.setLocalValue('LoginName', '');
			this.localstorage.setLocalValue('LoginFullName', '');
			this.localstorage.setLocalValue("LoginNameInitials", '');
			this.localstorage.setLocalValue('AttendeeID', '');
			this.localstorage.setLocalValue("loginUsername", '');
			this.localstorage.setLocalValue("loginPassword", '');
			this.localstorage.setLocalValue('LastSync', '');
			this.localstorage.setLocalValue("AgendaDays", '');
			this.localstorage.setLocalValue("AgendaDates", '');
			this.localstorage.setLocalValue("AgendaDayButtonLabels", '');
			
			var pushID = this.localstorage.getLocalValue('PlayerID');
			var deviceType = this.localstorage.getLocalValue('DevicePlatform');

			// AACD Login API			
			this.http.get('https://aacd.com/wsAPI.php', {
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
					'u': this.LoginName,
					'p': this.LoginPassword,
					'module': 'aacd.websiteforms',
					'method': 'validateMember',
					'username': 'wsapiconvergence',
					'password': 'apple181',
					'output': 'json'
				}}).map(res => res.json()).subscribe(loginService => {
					
					console.log("API Response: " + JSON.stringify(loginService)); 

		            if (loginService.status == "1") {	// Response from Clarity authentication API received/processed
						
						if (loginService.data.login.authenticated == "1") {	// Successful authentication
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
							if (loginService.data.login.teammembers.length == 1) {	// Single team member

								var today = new Date();
								var dd = today.getDate();
								var mm = today.getMonth() + 1; //January is 0!
								var yyyy = today.getFullYear();
								var hr = today.getHours();
								var mn = today.getMinutes();

								if (dd < 10) {
									var ds = '0' + dd
								}

								if (mm < 10) {
									var ms = '0' + mm
								}

								if (hr < 10) {
									var hs = '0' + hr
								}

								if (mn < 10) {
									var ns = '0' + mn
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
								
								this.http.get(URL2).map(res2 => res2.json()).subscribe(
									data2 => {
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

									}
								); 

								// Initiate manual sync to get latest information
								this.ManualSync();
								this.events.publish('user:Status', 'Logged In');

								// Depending of saved value, return to Home or move forward to MyAgenda or CE Tracking
								var ForwardingPage = this.localstorage.getLocalValue('ForwardingPage');
														
								switch(ForwardingPage) {
									case "MyAgenda":
										this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'}).then(() => {
											const startIndex = this.navCtrl.getActive().index - 1;
											this.navCtrl.remove(startIndex, 1);
										});
										break;
									case "MyAgendaFull":
										this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'}).then(() => {
											const startIndex = this.navCtrl.getActive().index - 1;
											this.navCtrl.remove(startIndex, 1);
										});
										break;
									case "EventSurvey":
										this.navCtrl.push(EvaluationConference, {}, {animate: true, direction: 'forward'}).then(() => {
											const startIndex = this.navCtrl.getActive().index - 1;
											this.navCtrl.remove(startIndex, 1);
										});
										break;
									case "CETracking":
										this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'}).then(() => {
											const startIndex = this.navCtrl.getActive().index - 1;
											this.navCtrl.remove(startIndex, 1);
										});
										break;
									case "Notes":
										this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'}).then(() => {
											const startIndex = this.navCtrl.getActive().index - 1;
											this.navCtrl.remove(startIndex, 1);
										});
										break;
									default:
										// Navigate back to Home page but eliminate Back button by setting it to Root
										this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
										break;
								}

							}
							if (loginService.data.login.teammembers.length > 1) {	// Multiple team members
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

						} else {
							
							console.log('Login error 1');
							console.log('Check development login API');
							
							this.http.get('https://aacdmobile.convergence-us.com/cvplanner.php?action=authenticate&em=' + this.LoginName + '&ps=' + this.LoginPassword).map(res => res.json()).subscribe(
								data => {
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
									if (data.status=="200") {
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
															
									switch(ForwardingPage) {
										case "MyAgenda":
											this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'}).then(() => {
												const startIndex = this.navCtrl.getActive().index - 1;
												this.navCtrl.remove(startIndex, 1);
											});
											break;
										case "MyAgendaFull":
											this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'}).then(() => {
												const startIndex = this.navCtrl.getActive().index - 1;
												this.navCtrl.remove(startIndex, 1);
											});
											break;
										case "EventSurvey":
											this.navCtrl.push(EvaluationConference, {}, {animate: true, direction: 'forward'}).then(() => {
												const startIndex = this.navCtrl.getActive().index - 1;
												this.navCtrl.remove(startIndex, 1);
											});
											break;
										case "CETracking":
											this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'}).then(() => {
												const startIndex = this.navCtrl.getActive().index - 1;
												this.navCtrl.remove(startIndex, 1);
											});
											break;
										case "Notes":
											this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'}).then(() => {
												const startIndex = this.navCtrl.getActive().index - 1;
												this.navCtrl.remove(startIndex, 1);
											});
											break;
										default:
											// Navigate back to Home page but eliminate Back button by setting it to Root
											this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
											break;
									}
									
									loading.dismiss();
									
								},
								err => {
									
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
									
								}
							); 

							//let alert = this.alertCtrl.create({
							//	title: 'Login Error',
							//	subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
							//	buttons: ['OK']
							//});
							//alert.present();

						}
						
					} else {

						console.log('Login error 2');
						
						let alert = this.alertCtrl.create({
							title: 'Login Error',
							subTitle: "We're sorry. The credentials entered could not be validated for AACD. Possible reasons include:<br/> 1) You're not using the credentials from your Academy Membership account;<br/> 2) You've mistyped your user name or password.",
							buttons: ['OK']
						});
						alert.present();

					}
					
					loading.dismiss();
										
				},
				err => {
					
					// Unable to authenticate against AACD API
					// Try development environment login API as a fallback
					
					console.log('Check development login API');
					
					this.http.get('https://aacdmobile.convergence-us.com/cvplanner.php?action=authenticate&em=' + this.LoginName + '&ps=' + this.LoginPassword).map(res => res.json()).subscribe(
						data => {
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
							if (data.status=="200") {
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
													
							switch(ForwardingPage) {
								case "MyAgenda":
									this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'}).then(() => {
										const startIndex = this.navCtrl.getActive().index - 1;
										this.navCtrl.remove(startIndex, 1);
									});
									break;
								case "MyAgendaFull":
									this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'}).then(() => {
										const startIndex = this.navCtrl.getActive().index - 1;
										this.navCtrl.remove(startIndex, 1);
									});
									break;
								case "EventSurvey":
									this.navCtrl.push(EvaluationConference, {}, {animate: true, direction: 'forward'}).then(() => {
										const startIndex = this.navCtrl.getActive().index - 1;
										this.navCtrl.remove(startIndex, 1);
									});
									break;
								case "CETracking":
									this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'}).then(() => {
										const startIndex = this.navCtrl.getActive().index - 1;
										this.navCtrl.remove(startIndex, 1);
									});
									break;
								case "Notes":
									this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'}).then(() => {
										const startIndex = this.navCtrl.getActive().index - 1;
										this.navCtrl.remove(startIndex, 1);
									});
									break;
								default:
									// Navigate back to Home page but eliminate Back button by setting it to Root
									this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
									break;
							}
							
							loading.dismiss();
							
						},
						err => {
							
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
							
						}
					); 

				}

			); 
			
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

        } else {

			console.log("ID: " + this.selectedLogin["ct_id"]);
			console.log("Name: " + this.selectedLogin["DisplayName"]);

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            var hr = today.getHours();
            var mn = today.getMinutes();

            if (dd < 10) {
                var ds = '0' + dd
            }

            if (mm < 10) {
                var ms = '0' + mm
            }

            if (hr < 10) {
                var hs = '0' + hr
            }

            if (mn < 10) {
                var ns = '0' + mn
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
			
			this.http.get(URL2).map(res2 => res2.json()).subscribe(
				data2 => {
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

				}
			); 

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
									
			switch(ForwardingPage) {
				case "MyAgenda":
					this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'}).then(() => {
						const startIndex = this.navCtrl.getActive().index - 1;
						this.navCtrl.remove(startIndex, 1);
					});
					break;
				case "MyAgendaFull":
					this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'}).then(() => {
						const startIndex = this.navCtrl.getActive().index - 1;
						this.navCtrl.remove(startIndex, 1);
					});
					break;
				case "EventSurvey":
					this.navCtrl.push(EvaluationConference, {}, {animate: true, direction: 'forward'}).then(() => {
						const startIndex = this.navCtrl.getActive().index - 1;
						this.navCtrl.remove(startIndex, 1);
					});
					break;
				case "CETracking":
					this.navCtrl.push('CetrackingPage', {}, {animate: true, direction: 'forward'}).then(() => {
						const startIndex = this.navCtrl.getActive().index - 1;
						this.navCtrl.remove(startIndex, 1);
					});
					break;
				case "Notes":
					this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'}).then(() => {
						const startIndex = this.navCtrl.getActive().index - 1;
						this.navCtrl.remove(startIndex, 1);
					});
					break;
				default:
					// Navigate back to Home page but eliminate Back button by setting it to Root
					this.navCtrl.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
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
	
}

