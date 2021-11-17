import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthModel} from '../../../models/auth.model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
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
      this.authService.userLogin(this.authModel).subscribe((result: any) => {
        if (result.loginSuccess !== undefined && result.token !== undefined && result.user !== undefined) {
            this.tokenStorageService.saveToken(result.token);
            this.tokenStorageService.saveUser(result.user);
            this.router.navigate(['/']);
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
