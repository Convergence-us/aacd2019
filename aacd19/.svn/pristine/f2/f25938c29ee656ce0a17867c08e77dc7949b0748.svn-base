// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';
import { Localstorage } from './../../providers/localstorage/localstorage';

@IonicPage()
@Component({
  selector: 'page-activityfeedleaderboard',
  templateUrl: 'activityfeedleaderboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFeedLeaderboardPage {

	public LeaderboardListing: any[] = [];
	
	constructor(private navParams: NavParams, 
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				public navCtrl: NavController,
				private view: ViewController,
				private localstorage: Localstorage) {
						
	}

	ionViewDidEnter() {

		var flags = "lb|";
		
		this.LeaderboardListing = [];
		this.cd.markForCheck();
		
		this.databaseprovider.getDatabaseStats(flags, "0").then(data => {

			if (data['length']>0) {
				
				var AttendeeName = "";
				var visCompanyName = "";
				var MaxBarDisplay = data[0].PostingsComments;
				var BarDisplay = 0;
				
				for (var i = 0; i < data['length']; i++) {
					
					AttendeeName = data[i].FirstName + " " + data[i].LastName;
					
					// Use blank if no company name available
					if (data[1].Company == null || data[i].Company == undefined) {
						visCompanyName = "";
					} else {
						visCompanyName = data[i].Company;
					}
					
					// Determine if avatar is available or to use the default
					var imageAvatar = "";
					if (data[i].avatarFilename != 'undefined' && data[i].avatarFilename != undefined && data[i].avatarFilename != '' && data[i].avatarFilename.length > 0) {
						imageAvatar = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Attendees/" + data[i].avatarFilename;
					} else {
						imageAvatar = "assets/img/personIcon.png";
					}
					
					// Determine percentage amount for bar length
					if (parseInt(data[i].PostingsComments) == MaxBarDisplay) {
						BarDisplay = 100;
					} else {
						BarDisplay = (parseInt(data[i].PostingsComments) / MaxBarDisplay) * 100;
					}
					
					console.log('Attendee: ' + AttendeeName + ', Counter: ' + Counter + ', BarDisplay: ' + BarDisplay);
					
					var Counter = parseInt(data[i].PostingsComments);
					
					this.LeaderboardListing.push({
						lbDisplayName: AttendeeName,
						lbCompany: visCompanyName,
						lbBarDisplay: BarDisplay,
						lbCounter: Counter,
						lbAvatar: imageAvatar
					});
					
				}
				
				this.cd.markForCheck();

			}
			
		});
		
	}
	
	closeModal() {
		
		this.view.dismiss();
		
	}
}


