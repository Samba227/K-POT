import { Component, OnInit } from '@angular/core';
import {UserProfile} from '../../models/userProfile.model';
import {TokenStorageService} from '../../services/token-storage.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user: UserProfile;

  constructor(
    private tokenStorageService: TokenStorageService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.userService.getUserProfile({token: this.tokenStorageService.getToken()}).subscribe(
      (data: any) => {
        if (data.profileSuccess !== undefined){
          this.user = data.user;
        }
      },(err) => {
        console.log(err);
      }
    );
  }
}
