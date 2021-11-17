import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {TokenStorageService} from '../../services/token-storage.service';
import {UserProfile} from '../../models/userProfile.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: UserProfile = this.tokenStorageService.getUser();
  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
  }

  onSignOut(){
    this.authService.userLogout().subscribe((res: any) => {
      if (res.logoutSuccess !== undefined){
        this.tokenStorageService.signOut();
        location.reload();
      }
    });
  }
}
