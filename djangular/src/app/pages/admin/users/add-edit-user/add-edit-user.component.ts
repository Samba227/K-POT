import { Component, OnInit, Input } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TokenStorageService} from '../../../../services/token-storage.service';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';
import {User} from '../../../../models/user.model';
import {UserProfile} from '../../../../models/userProfile.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {

  @Input() user: User;
  currentSessionUser: UserProfile = this.tokenStorageService.getUser();
  userForm: FormGroup;
  passwordForm: FormControl;
  constructor(
    private userService: UserService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fillForm();
  }

  initForm(){
    this.userForm = new FormGroup(
      {
        'first_name': new FormControl(''),
        'last_name': new FormControl(''),
        'email': new FormControl(''),
        'username': new FormControl('', [Validators.required]),
        'is_superuser': new FormControl(''),
        'is_active': new FormControl(''),
        'password': new FormControl('', [Validators.required]),
      }
    );
  }

  fillForm(){
    this.userForm.patchValue(
      {
        'first_name': this.user.first_name,
        'last_name': this.user.last_name,
        'email': this.user.email,
        'username': this.user.username,
        'password': this.user.password,
        'is_superuser': this.user.is_superuser,
        'is_active': this.user.is_active
      }
    );
  }

  onUpdate(){
    this.user.first_name = this.userForm.get('first_name').value;
    this.user.last_name = this.userForm.get('last_name').value;
    this.user.email = this.userForm.get('email').value;
    this.user.username = this.userForm.get('username').value;
    this.user.password = this.userForm.get('password').value;
    this.user.is_superuser = this.userForm.get('is_superuser').value;
    this.user.is_active = this.userForm.get('is_active').value;

    this.userService.updateUser(this.user).subscribe(
      (res: any) => {
        if (res.success !== undefined){
          alert('User updated successfully');
          if (this.user.id === this.currentSessionUser.id){
            this.tokenStorageService.signOut();
          }
          location.reload();
        }
      }
    );
  }

  onAdd(){
    this.user.first_name = this.userForm.get('first_name').value;
    this.user.last_name = this.userForm.get('last_name').value;
    this.user.email = this.userForm.get('email').value;
    this.user.username = this.userForm.get('username').value;
    this.user.password = this.userForm.get('password').value;
    this.user.is_superuser = this.userForm.get('is_superuser').value;
    this.user.is_active = this.userForm.get('is_active').value;

    this.userService.addUser(this.user).subscribe(
      (res: any) => {
        if (res.userAddSuccess !== undefined){
          alert('User Added successfully');
          location.reload();
        }
        else{
          alert('Failed to add');
        }
      }
    );
  }
}
