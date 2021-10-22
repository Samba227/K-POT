import { Injectable } from '@angular/core';
import { Profile } from "../models/profile.model";

const PROFILE_KEY = 'profile-token';
@Injectable({
  providedIn: 'root'
})
export class ProfileStorageService {
  constructor() { }

  public saveProfile(profile: Profile): void {
    window.sessionStorage.removeItem(PROFILE_KEY);
    window.sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  public getProfile(): Profile {
    return JSON.parse(<string>sessionStorage.getItem(PROFILE_KEY));
  }

}
