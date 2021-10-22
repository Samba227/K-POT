import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {Router} from '@angular/router';
import {AuthModel} from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  authModel: AuthModel;
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  onRegister(){
    const username = this.registerForm.get('username').value;
    const password = this.registerForm.get('password').value;
    this.authModel = new AuthModel();
    this.authModel.username = username;
    this.authModel.password = password;
    this.authService.userRegister(this.authModel).subscribe((result: any) => {
      if (result.registerSuccess !== undefined){
        alert('registered successfully');
        this.router.navigate(['/auth/login/']);
      }
      else if (result.fieldsError !== undefined){
        location.reload();
        alert('Bad request due to fields error');
      }
      else if (result.failure !== undefined){
        alert('Failed to register');
      }
      else if (result.userExist !== undefined){
        alert('User already exist');
      }
      else {
        location.reload();
        alert('unknown error');
      }
    });
  }
}
