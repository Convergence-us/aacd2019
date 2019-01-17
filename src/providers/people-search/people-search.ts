import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleSearch provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PeopleSearch {
  data1: any;
  constructor(public httpCall: Http) {
    console.log('Hello PeopleSearch Provider');
  }

  load() {
    if (this.data1) {
      return Promise.resolve(this.data1);
    }
    // Dont have the data yet
    return new Promise(resolve => {
      this.httpCall.get('https://randomuser.me/api/?results=200')
        .map(res => res.json())
        .subscribe(data => {
          this.data1 = data.results;
          resolve(this.data1);
        });
    });
  }

}
