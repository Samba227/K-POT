import { Component, OnInit } from '@angular/core';
import {WebsiteService} from "./services/website.service";

import {Profile} from "./models/profile.model";
import {ProfileAction} from "./models/action.model";
import {ProfileStorageService} from "./services/profile.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(document:keypress)': 'keyScan($event)',
    '(document:mousemove)': 'mouseMoveScan($event)'
  }
})
export class AppComponent implements OnInit {
  // --- models ----//
  profile: Profile = new Profile();
  profileAction: ProfileAction | undefined;

  // --- action variables ----//
  // variables pour le keyScan
  debut: any;
  delta: any = 0;
  deltas: any[] = [];
  keys: any = 0;

  // variables pour le mousemove
  debut_mouse: any;
  delta_mouse: any = 0;
  deltas_mouse: any[] = [];
  moves: any = 0;

  constructor(
    private service: WebsiteService,
    private profileStorageService: ProfileStorageService
  ) { }

  ngOnInit(): void {
    console.log('page loaded');
    this.refreshProfile();
  }

  refreshProfile(){

    fetch("https://ipinfo.io/json?token=97c345b7d7b037").then(
      (response) => response.json()
    ).then(
      (data: any) => {
        this.profile.ip = data.ip;
        this.profile.city = data.city;
        this.profile.region = data.region;
        this.profile.country_name = data.country;
        this.profile.location = data.loc;
        this.profile.time_zone_name = data.timezone;
        this.profile.postal = data.postal;
        this.profileStorageService.saveProfile(this.profile);
        this.saveProfile(this.profile);
      });
  }

  saveProfile(profile: any){
    this.service.addProfile(profile).subscribe(
      (result: any) => {}
    );
  }

  saveProfileAction(name: any, val: any){
    this.profile = this.profileStorageService.getProfile();
    this.profileAction = new ProfileAction();
    this.profileAction.profile =  this.profile?.ip;
    this.profileAction.name = name;
    this.profileAction.value = val;

    this.service.addProfileAction(this.profileAction).subscribe((result: any) => {});
  }


  // profile actions scan functions

  sum(list: any) {
    return list.reduce((a: any, b: any) => a + b, 0);
  }

// onkeydown="keyScan(event)"
  keyScan(event: KeyboardEvent) {

    if (this.keys<20){
      if (this.delta === 0) {
        this.debut = Date.now();
        this.delta++;
        this.deltas.push(0);
      }
      else {
        let now = Date.now()
        this.deltas.push((now-this.debut)/1000);
        this.debut = now;
      }
    }
    else if (this.keys === 20){
      const avg = Number((this.sum(this.deltas)/this.deltas.length).toFixed(4));
      this.saveProfileAction('AvgKeyPress', avg);

    }
    this.keys++;
  }

  mouseMoveScan(event: MouseEvent) {
    if (this.moves<100){
      if (this.delta_mouse === 0){
        this.debut_mouse = Date.now()
        this.delta_mouse++;
        this.deltas_mouse.push(0);
      }

      else {
        let now = Date.now()
        this.deltas_mouse.push((now-this.debut_mouse)/1000);
        this.debut_mouse = now;
      }
    }

    else if(this.moves === 100){
      const avg = Number((this.sum(this.deltas_mouse)/this.deltas_mouse.length).toFixed(4));
      this.saveProfileAction('AvgMouseMoveSpeed', avg);
    }

    this.moves++;

  }
}
