import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from '../../../services/token-storage.service';
import {UserService} from '../../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {UserProfile} from '../../../models/userProfile.model';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  user: UserProfile = new UserProfile();
  accountForm: FormGroup;
  constructor(
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reloadUser();
    this.initForm();
    this.fillForm();
  }

  reloadUser(){
    const token = {
      token: this.tokenStorageService.getToken()
    };
    this.userService.getUserProfile(token).subscribe((res: any) => {
      if (res.profileSuccess !== undefined){
        this.tokenStorageService.saveUser(res.user);
        this.user = this.tokenStorageService.getUser();
      }
    });
  }

  initForm(){
    this.accountForm = new FormGroup(
      {
        'first_name': new FormControl(''),
        'last_name': new FormControl(''),
        'email': new FormControl(''),
        'username': new FormControl('', [Validators.required]),
        'last_login': new FormControl(''),
        'is_superuser': new FormControl('')
      }
    );
  }

  fillForm(){
    const token = { token: this.tokenStorageService.getToken()};
    this.userService.getUserProfile(token).subscribe(
      (res: any) => {
        if (res.profileSuccess !== undefined){
          this.user = res.user;
          this.accountForm.patchValue(
            {
              'first_name': this.user.first_name,
              'last_name': this.user.last_name,
              'email': this.user.email,
              'username': this.user.username,
              'last_login': this.user.last_login,
              'is_superuser': this.user.is_superuser
            }
          );
        }
        else {
          alert(res.toString());
          this.authService.userLogout().subscribe();
        }
      }
    );
  }

  onUpdate(){
    this.user.first_name = this.accountForm.get('first_name').value;
    this.user.last_name = this.accountForm.get('last_name').value;
    this.user.email = this.accountForm.get('email').value;
    this.user.username = this.accountForm.get('username').value;
    this.user.last_login = this.accountForm.get('last_login').value;
    this.user.is_superuser = this.accountForm.get('is_superuser').value;

    this.userService.updateUserProfile(this.user).subscribe(
      (res: any) => {
        if (res.updateSuccess !== undefined){
          this.reloadUser();
          location.reload();
        }
      }
    );
  }
}
