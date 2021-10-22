import { Component, OnInit } from '@angular/core';
import {AuthModel} from '../../../models/auth.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../services/token-storage.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-admin-login',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css'],
  providers: [MessageService]
})
export class AdminloginComponent implements OnInit {

  authModel: AuthModel;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLogin(){
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.authModel = new AuthModel();
    this.authModel.username = username;
    this.authModel.password = password;
    this.authService.adminLogin(this.authModel).subscribe((result: any) => {
      if (result.loginSuccess !== undefined && result.token !== undefined && result.user !== undefined) {
        this.tokenStorageService.saveToken(result.token);
        this.tokenStorageService.saveUser(result.user);
        this.router.navigate(['/admin']);
      }
      else {
          this.showError();
        }
      });
  }

  showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Login failure !'});
  }

}
