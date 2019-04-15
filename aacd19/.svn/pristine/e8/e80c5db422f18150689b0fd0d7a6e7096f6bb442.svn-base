// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Localstorage } from './../../providers/localstorage/localstorage';

// Pages
import { DatabasePage } from '../database/database';
import { HelpPage } from '../help/help';
import { NotesPage } from '../notes/notes';
import { LoginPage } from '../login/login';
import { MyAgendaFull } from '../myagendafull/myagendafull';
import { MyAgenda } from '../myagenda/myagenda';
import { EvaluationConference } from '../evaluationconference/evaluationconference';


@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MorePage {

	// Diagnostics
	public DeviceType: string;
	public RegistrationID: string;
	public LSync: string;
	public PushID: string;

	constructor(public navCtrl: NavController, 
				private storage: Storage,
				public navParams: NavParams,
				private cd: ChangeDetectorRef,
				private localstorage: Localstorage) {
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

		switch(PageID) {
			case "HelpPage":
				this.navCtrl.push(HelpPage, {}, {animate: true, direction: 'forward'});
				break;
			case "DatabasePage":
				this.navCtrl.push(DatabasePage, {}, {animate: true, direction: 'forward'});
				break;
			case "NotesPage":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "Notes");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.push(NotesPage, {}, {animate: true, direction: 'forward'});
				}
				break;
			case "EventSurvey":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "EventSurvey");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.push(EvaluationConference, {}, {animate: true, direction: 'forward'});
				}
				break;
			case "MyAgenda":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "MyAgenda");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.push(MyAgenda, {}, {animate: true, direction: 'forward'});
				}
				break;
			case "MyAgendaFull":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "MyAgendaFull");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.navCtrl.push(MyAgendaFull, {}, {animate: true, direction: 'forward'});
				}
				break;
			case "EvalTest1Page":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "EvaluationTest1");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.localstorage.setLocalValue('EventID', 'S-54118');
					this.navCtrl.push('EvaluationTest1', {}, {animate: true, direction: 'forward'});
				}
				break;
			case "EvalTest2Page":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "EvaluationTest2");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.localstorage.setLocalValue('EventID', 'S-54118');
					this.navCtrl.push('EvaluationTest2', {}, {animate: true, direction: 'forward'});
				}
				break;
			case "EvalTest3Page":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "EvaluationTest3");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.localstorage.setLocalValue('EventID', 'S-54118');
					this.navCtrl.push('EvaluationTest3', {}, {animate: true, direction: 'forward'});
				}
				break;
			case "EvalTest4Page":
				if (AttendeeID == '' || AttendeeID == null) {
					// If not, store the page they want to go to and go to the Login page
					console.log('Stored AttendeeID: ' + AttendeeID);
					this.storage.set('NavigateToPage', "EvaluationTest4");
					this.navCtrl.push(LoginPage, {}, {animate: true, direction: 'forward'});
				} else {
					// Otherwise just go to the page they want
					this.localstorage.setLocalValue('EventID', 'S-54118');
					this.navCtrl.push('EvaluationTest4', {}, {animate: true, direction: 'forward'});
				}
				break;
        }

    };

}
