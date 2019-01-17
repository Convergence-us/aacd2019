import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Help page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
constructor(public navCtrl: NavController) {
}

ionViewDidLoad() {
  console.log('ionViewDidLoad HelpPage');
}
}
