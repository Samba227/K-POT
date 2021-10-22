import { Component, OnInit, Input } from '@angular/core';
import {ConnectionProfile} from '../../../../models/connection-profile.model';
import {ProfileAction} from '../../../../models/profile-action.model';
import {LoginAttempt} from '../../../../models/login-attempt.model';
import {ConnexionsService} from '../../../../services/connexions.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.css']
})
export class ConnectionProfileComponent implements OnInit {
  @Input() selectedProfile: any[];
  profile: ConnectionProfile;
  actions: ProfileAction[] = [];
  loginAttempts: LoginAttempt[] = [];

  constructor(
    private service: ConnexionsService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
      this.profile = this.selectedProfile[0];
      this.actions = this.selectedProfile[1];
      this.loginAttempts = this.selectedProfile[2];

      /*
      //--- à enlever si honeypot website modifié (MDP CONCAT)
      if(this.loginAttempts.length>0){
        const pass1 = this.loginAttempts[0].password;
      this.loginAttempts.forEach( (element) => {
        if (element.password !== pass1){
            element.password = element.password.substring(0,(element.password.length - pass1.length));
          }
        });
      }*/
      
  }
}
