import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WebsiteService} from "../../services/website.service";
import {ProfileStorageService} from "../../services/profile.service";

import {LoginAttempt} from "../../models/login-attempt.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // --- models ----//
  loginAttempt: LoginAttempt | undefined;

  // --- login form ----//
  loginForm:any;

  constructor(
    private service: WebsiteService,
    private profileStorageService: ProfileStorageService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  }

  onLogin(){
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    this.loginAttempt = new LoginAttempt();
    this.loginAttempt.profile =  this.profileStorageService.getProfile().ip;
    this.loginAttempt.username = username;
    this.loginAttempt.password = password;
    this.loginAttempt.attempt_time = '' + new Date();

    this.service.addLoginAttempt(this.loginAttempt).subscribe((result: any) => {
      location.reload();
    });
  }

}
