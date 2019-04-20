import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet/dist';

import * as L from "leaflet";



declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

	// Leaflet mapping variables
	myMap2: any;
	myMap3: any;
	myMap4: any;
	myMap5: any;
	myMap6: any;
	myMap7: any;
	myMap8: any;
	myMap9: any;
	myMap10: any;

	constructor(public navCtrl: NavController, 
				public platform: Platform) {
			
	}


	ngOnInit() {
		
		// -----------------
		// Show Level 1
		// -----------------

	/*
		this.myMap2 = L.map('mapLevel2', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds = L.latLngBounds([0, 0], [1900, 1700]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image = L.imageOverlay('assets/img/overview.png', bounds, {
			attribution: 'Convergence'
		}).addTo(this.myMap2);

		this.myMap2.fitBounds(bounds);
		this.myMap2.setMaxBounds(bounds);
		
*/

		// -----------------
		// Show Level 2
		// -----------------
		this.myMap3 = L.map('mapLevel3', {
			crs: L.CRS.Simple,
			minZoom: -2,
			maxZoom: 2,
			zoomControl: true
		});

		var bounds = L.latLngBounds([0, 0], [2000, 1300]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image = L.imageOverlay('assets/img/glevel.png', bounds, {
			attribution: 'Convergence'
		}).addTo(this.myMap3);

		this.myMap3.fitBounds(bounds);
		this.myMap3.setMaxBounds(bounds);


		// -----------------
		// Show Level 3
		// -----------------
		this.myMap4 = L.map('mapLevel4', {
			crs: L.CRS.Simple,
			minZoom: -2,
			maxZoom: 2,
			zoomControl: true
		});


	


		var bounds = L.latLngBounds([0, 0], [2000, 1300]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image = L.imageOverlay('assets/img/ulmap.png', bounds, {
			attribution: 'Convergence'
		}).addTo(this.myMap4);

		this.myMap4.fitBounds(bounds);
		this.myMap4.setMaxBounds(bounds);

/*
		// -----------------
		// Show Concourse
		// -----------------
		this.myMap5 = L.map('mapLevel5', {
			crs: L.CRS.Simple,
			minZoom: -1,
			maxZoom: 1,
			zoomControl: true
		});

		var bounds = L.latLngBounds([0, 0], [1200, 1700]);    // Normally 1000, 1000; stretched to 2000,1000 for AACD 2017
		var image = L.imageOverlay('assets/img/upperlevel.png', bounds, {
			attribution: 'Convergence'
		}).addTo(this.myMap5);

		this.myMap5.fitBounds(bounds);
		this.myMap5.setMaxBounds(bounds);
*/

		
	}
	
}
