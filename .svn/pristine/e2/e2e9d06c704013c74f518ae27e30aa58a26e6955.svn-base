import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleMap} from '@ionic-native/google-maps';

//GoogleMapsLatLng 



declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild('map') map;
  public maps: string;

  constructor(public navCtrl: NavController, public platform: Platform) {}

  initJSMaps(mapEle) {
    new google.maps.Map(mapEle, {
      center: { lat: 41.878114, lng: -87.629798 },
      zoom: 16
    });
  }


  
  initNativeMaps(mapEle) {
    this.map = new GoogleMap(mapEle);
    mapEle.classList.add('show-map');

    //GoogleMap.isAvailable().then(() => {
    //  const position = new GoogleMapsLatLng(41.878114, -87.629798);
    //  this.map.setPosition(position);
   // });
  }

  ionViewDidLoad() {
	  
	this.maps = "hyatt";
	
	/*
	if (!this.map.nativeElement) {
      console.error('Unable to initialize map, no map element with #map view reference.');
      return;
    }
	
    let mapEle = this.map.nativeElement;



    // Disable this switch if you'd like to only use JS maps, as the APIs
    // are slightly different between the two. However, this makes it easy
    // to use native maps while running in Cordova, and JS maps on the web.
    if (this.platform.is('cordova') === true) {
      this.initNativeMaps(mapEle);
    } else {
      this.initJSMaps(mapEle);
    }
  */
  }
	
}









//Google Maps Places API for displaying building details 
//ionic cordova plugin add https://github.com/mapsplugin/cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="AIzaSyBBOZQqb05tjRHef4M8UHC9xJZmkBv_apk
//" --variable API_KEY_FOR_IOS="AIzaSyAqnNA1fIKm4GyLMvTrYb7P3qgKrt8QVu8
//"

/*

var indoorInfoLabel = document.getElementById("indoorInfo");
var div = document.getElementById("map_canvas");
var map = plugin.google.maps.Map.getMap(div, {
  camera: {
    target: {
      lat: 37.422375,
      lng: -122.084207
    },
    zoom: 18
  },
  controls: {
    indoorPicker: true
  }
});
map.one(plugin.google.maps.event.MAP_READY, function() {

  // Get the current focused building programatically.
  map.getFocusedBuilding(onIndoorEvents);

  // or you can listen the INDOOR_BUILDING_FOCUSED and the INDOOR_LEVEL_ACTIVATED events.
  map.on(plugin.google.maps.event.INDOOR_BUILDING_FOCUSED, onIndoorEvents);
  map.on(plugin.google.maps.event.INDOOR_LEVEL_ACTIVATED, onIndoorEvents);

});
function onIndoorEvents(indoorBuilding) {
  var map = this;

  if (!indoorBuilding) {
    indoorInfoLabel.innerText = "Not focused on any building";
    return;
  }

  // then, display the results
  var floors = indoorBuilding.levels;
  indoorInfoLabel.innerText = "current floor: " + indoorBuilding.levels[indoorBuilding.activeLevelIndex].name;

}

*/


