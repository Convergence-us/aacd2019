// Components, functions, plugins
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Database } from './../../providers/database/database';

declare var dateFormat: any;

@IonicPage()
@Component({
  selector: 'page-speakerdetails',
  templateUrl: 'speakerdetails.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpeakerDetailsPage {

	public SessionListing: any[] = [];
	public visualImageURL: string;
	public visualDisplayName: string;
	public visualAffiliation: string;
	public visualBiography: string;
	public spkrDetails: string;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				private storage: Storage,
				private databaseprovider: Database,
				private cd: ChangeDetectorRef,
				public loadingCtrl: LoadingController) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SpeakersPage');
	}

    EventDetails(EventID) {
		
        if (EventID != 0) {
            // Navigate to Education Details page
			this.navCtrl.push('EducationDetailsPage', {EventID: EventID}, {animate: true, direction: 'forward'});
        }

    };

	ngOnInit() {

		// Load initial data set here
		//let loading = this.loadingCtrl.create({
		//	spinner: 'crescent',
		//	content: 'Please wait...'
		//});

		//loading.present();

		// Blank and show loading info
		this.SessionListing = [];
		this.cd.markForCheck();
		
		// Temporary use variables
		var flags = "dt|Alpha|" + this.navParams.get('SpeakerID');
        var DisplayName = "";
        var BioDisplay = "";
		
		// Get the data
		this.databaseprovider.getSpeakerData(flags, "0").then(data => {
			
			console.log("getSpeakerDetails: " + JSON.stringify(data));

			if (data['length']>0) {
				
				DisplayName = "";

				// Concatenate fields to build displayable name
				//if (data[0].Prefix != "") {
				//    DisplayName = DisplayName + data[0].Prefix + " ";
				//}
				DisplayName = DisplayName + data[0].FirstName;
				//if (data[0].MiddleInitial != "") {
				//    DisplayName = DisplayName + " " + data[0].MiddleInitial;
				//}
				DisplayName = DisplayName + " " + data[0].LastName;
				//if (data[0].Suffix != "") {
				//    DisplayName = DisplayName + " " + data[0].Suffix;
				//}
				//if (data[0].imis_designation != "" && data[0].imis_designation != null) {
				//    DisplayName = DisplayName + ", " + data[0].imis_designation;
				//}
				
				if (data[0].Credentials != "" && data[0].Credentials != null) {
					this.visualAffiliation = data[0].Credentials;
				}

				// Thumbnail
				var imageURL = "https://aacdmobile.convergence-us.com/AdminGateway/2019/images/Speakers/" + data[0].imageFilename;
				//imageURL = imageURL.substr(0, imageURL.length - 3) + 'png';
				this.visualImageURL = imageURL;
				console.log("ImageURL: " + imageURL);

				this.visualDisplayName = DisplayName;
				//$scope.visualAffiliation = res.rows.item(0).Affiliation;

				// Biography
				if ((data[0].Bio == "") || (data[0].Bio == "&nbsp;") || (data[0].Bio == "TBD")) {
					this.spkrDetails = "No biography provided";
				} else {
					BioDisplay = data[0].Bio;
					BioDisplay = BioDisplay.replace(/&nbsp;/g,' ');
					BioDisplay = BioDisplay.replace(/\r/g, '');
					BioDisplay = BioDisplay.replace(/\n/g, '');
					BioDisplay = BioDisplay.replace(/\t/g, '');
					BioDisplay = BioDisplay.replace(/<div>/g, '');
					BioDisplay = BioDisplay.replace(/<\/div>/g, '');
					this.spkrDetails = BioDisplay;
				}

				// Get session records
				var coursescat = data[0].Courses;
				var courses = coursescat.split("|");
				var text = "('";
				for (var i = 0; i < courses.length; i++) {
					text += courses[i] + "','";
				}
				var QueryParam = text.substring(0, text.length - 2);
				QueryParam = QueryParam + ")";

				console.log("Course listing parameters: " + QueryParam);

				flags = "cl|Alpha|" + this.navParams.get('SpeakerID') + "|" + QueryParam;
				
                var SQLDate;
                var DisplayDateTime;
                var dbEventDateTime;

				// Get the list of courses relevant to this speaker
				this.databaseprovider.getSpeakerData(flags, "0").then(data2 => {
					
					console.log("getSpeakerData: " + JSON.stringify(data));

					if (data2['length']>0) {
						
						for (var i = 0; i < data2['length']; i++) {

                            console.log(data2[i].session_id);

                            dbEventDateTime = data2[i].session_start_time.substring(0,19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');

                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = dateFormat(SQLDate, "mm/dd h:MMtt");

                            // Display end time
                            dbEventDateTime = data2[i].session_end_time.substring(0, 19);
                            dbEventDateTime = dbEventDateTime.replace(/-/g, '/');
                            dbEventDateTime = dbEventDateTime.replace(/T/g, ' ');
                            SQLDate = new Date(dbEventDateTime);
                            DisplayDateTime = DisplayDateTime + " to " + dateFormat(SQLDate, "h:MMtt");

							this.SessionListing.push({
                                DisplayEventName: data2[i].session_title,
                                DisplayEventTimeDateLocation: DisplayDateTime + " in " + data2[i].RoomName,// + " for " + ConvertM2HM(res2.rows.item(i).EventDuration),
                                EventID: data2[i].session_id
                            });

						}


					} else {
						
						// No records to show
						this.SessionListing.push({
                            DisplayEventName: "No records available",
                            DisplayEventTimeDateLocation: "",
                            EventID: "0"
						});

					}

					this.cd.markForCheck();
					
				}).catch(function () {
					console.log("Promise Rejected");
				});
					

			} else {
				
                // No data to show
                this.visualDisplayName = "Unable to retrieve record";
                this.visualAffiliation = "";

			}

			this.cd.markForCheck();

			//loading.dismiss();
			
		}).catch(function () {
			console.log("Promise Rejected");
		});
		
	}

}
