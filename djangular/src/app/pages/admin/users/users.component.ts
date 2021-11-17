import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import {UserProfile} from '../../../models/userProfile.model';
import {TokenStorageService} from '../../../services/token-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  currentSessionUser: UserProfile = this.tokenStorageService.getUser();

  users: User[];
  activeUsers: number;
  notActiveUsers: number;
  superUsers: number;

  ModalTitle: string;
  ActivateAddEditUser: boolean = false;
  ActivateUserDetail: boolean = false;
  addEditUser: User;

  userToDeleteId: number = 0;

  constructor(
    private userService: UserService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.refreshlist();
  }

  refreshlist(){
    this.userService.getUsersList().subscribe(
      (data: any) => {
        this.users = data.users;
        this.activeUsers = data.activeUsers;
        this.notActiveUsers = data.notActiveUsers;
        this.superUsers = data.superUsers;
      }
    );
  }

  addClick(){
    this.addEditUser = new User();
    this.addEditUser.id = 0;
    this.addEditUser.username = '';
    this.addEditUser.first_name = '';
    this.addEditUser.last_name = '';
    this.addEditUser.email = '';
    this.addEditUser.is_superuser = false;
    this.addEditUser.is_active = false;
    this.addEditUser.password = '';

    this.ModalTitle = 'Add User';
    this.ActivateAddEditUser = true;
  }

  closeClick(){
    this.ActivateAddEditUser = false;
    this.ActivateUserDetail = false;
    this.refreshlist();
  }

  editClick(user){
    this.addEditUser = user;

    this.ActivateAddEditUser = true;
    this.ModalTitle = 'Edit User';

  }
  
  onDeleteUser(){
    this.userService.deleteUser(this.userToDeleteId).subscribe(
      (result: any) => {
        if (result.deleteSuccess !== undefined){
          alert('user deleted successfully');
          window.location.reload();
        }
        else {
          alert('failed to delete');
        }
      }
    );
  }
}
