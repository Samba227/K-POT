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
      
  }
}
