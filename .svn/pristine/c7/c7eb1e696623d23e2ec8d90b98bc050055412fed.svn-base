// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';


@IonicPage()
@Component({
  selector: 'page-cetracking',
  templateUrl: 'cetracking.html',
})

export class CetrackingPage {
	
	public creditsTypeL: string;
	public creditsTypeP: string;
	public CEListing: any[] = [];
	public LegendDetails = false;
	public LegendDropdownIcon = 'arrow-dropdown-circle';
	
	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private nav: NavController,
				private cd: ChangeDetectorRef,
				private storage: Storage,
				public events: Events,
				private databaseprovider: Database,
				private localstorage: Localstorage) {

		// Listen for sync events and 
		// refresh side menu dashboard
		this.events.subscribe('sync:Status', (SyncType) => {
			console.log('CetrackingPage: Sync has ', SyncType);
			this.LoadCETrackerData();
		});

	}

	ionViewDidEnter() {
		
		console.log('ionViewDidEnter: CetrackingPage');
		this.LoadCETrackerData();

	}
	
		
	
	LoadCETrackerData() {
		
		this.CEListing = [];
		this.cd.markForCheck();
		
		// Load / refresh data when coming to this page
		var iconScan = "";

		// Icons
		var iconCEScanPendingScan = 'qr-scanner';
		var iconCEScanNotCompleted = 'close-circle';
		var iconCEScanTimeInSession = 'timer';
		var iconCEScanComplete = 'checkmark';
							
		var sumCreditsL = 0;
		var sumCreditsP = 0;
	
		/* Determine currently logged in user */
		var AttendeeID = this.localstorage.getLocalValue('AttendeeID');
		
		if (AttendeeID != '' && AttendeeID != null) {
			
			console.log('Stored AttendeeID: ' + AttendeeID);
			
			this.databaseprovider.getCETrackerData(AttendeeID).then(data => {
				
				console.log("getCETrackerData: " + JSON.stringify(data));

				if (data['length']>0) {
					
					for (var i = 0; i < data['length']; i++) {

						var EvalType = data[i].ce_credits_type.substring(0, 1);

						var iconSet = 0;

						if (EvalType == "") {                                           // Evals that don't require an eval are completed
							iconScan = iconCEScanComplete;
							iconSet = 1;
							sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
							sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
						}
						if (data[i].ceStatusScan == "0" && iconSet == 0) {     			// No scan (shouldn't happen with AACD)
							iconScan = iconCEScanPendingScan;
							iconSet = 1;

						}
						if ((data[i].Evaluated == "0" || data[i].Evaluated === null) && iconSet == 0) {     // Eval not completed
							iconScan = iconCEScanNotCompleted;
							iconSet = 1;
						}
						if (iconSet == 0) {                                             // Otherwise mark as completed
							iconScan = iconCEScanComplete;
							sumCreditsL = sumCreditsL + parseFloat(data[i].CEcreditsL);
							sumCreditsP = sumCreditsP + parseFloat(data[i].CEcreditsP);
						}

						console.log("CE Record: " + data[i].session_title + ", Icon: " + iconScan);
						
						this.CEListing.push({
							EventID: data[i].session_id,
							EvaluationType: EvalType,
							DisplayEventName: data[i].session_title,
							sessionScanStatusIcon: iconScan,
							navigationRightArrow: "arrow-dropright"
						});

					}

					this.creditsTypeL = sumCreditsL.toFixed(2);
					this.creditsTypeP = sumCreditsP.toFixed(2);
					this.cd.markForCheck();


				} else {
					
					this.CEListing.push({
						EventID: "0",
						EvaluationType: "0",
						DisplayEventName: "No CE records available",
						sessionScanStatusIcon: iconCEScanPendingScan,
						navigationRightArrow: ""
					});

					this.creditsTypeL = '0.00';
					this.creditsTypeP = '0.00';
					this.cd.markForCheck();

				}

			}).catch(function () {
				console.log("Promise Rejected");
			});
				
		} else {
			console.log('User not logged in');
			this.creditsTypeL = '0.00';
			this.creditsTypeP = '0.00';
		}

		this.events.publish('user:Status', 'CE Tracker Update');

	}

    toggleLegend() {
		console.log('Toggle Legend: ' + this.LegendDetails);
        this.LegendDetails = !this.LegendDetails;
		switch(this.LegendDetails) {
			case true:
				this.LegendDropdownIcon = 'arrow-dropup-circle';
				break;
			case false:
				this.LegendDropdownIcon = 'arrow-dropdown-circle';
				break;
		}
		
    };
	
    isLegendShown() {
        return this.LegendDetails;
    };

	ionViewDidLoad() {
		console.log('ionViewDidLoad: CetrackingPage');
	}

	Survey(EventID, EvalType) {
		console.log("Survey clicked; SurveyID: " + EventID + "; Evaluation Type: " + EvalType);

		if (EventID != "0") {
			this.localstorage.setLocalValue('MassEval', "1");
			this.localstorage.setLocalValue('EventID', EventID);

			if (EvalType == "L") {
				// Navigate to Lecture Evaluation page
				this.navCtrl.push('EvaluationLecture', {EventID: EventID}, {animate: true, direction: 'forward'});
			}
			if (EvalType == "P") {
				// Navigate to Workshop Evaluation page
				this.navCtrl.push('EvaluationWorkshop', {EventID: EventID}, {animate: true, direction: 'forward'});
			}
		}
	}
  
}