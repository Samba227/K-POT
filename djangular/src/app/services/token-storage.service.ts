import { Injectable } from '@angular/core';
import {UserProfile} from '../models/userProfile.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user-token';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }


  public saveUser(user: UserProfile): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): UserProfile {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public getRole() {
    const role = this.getUser().is_superuser ? 'admin' : 'user';
    return role;
  }


}
