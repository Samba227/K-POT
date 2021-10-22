import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly ApiUrl = 'http://192.168.1.161:8081/api/users/';

  constructor(private http: HttpClient) { }

// ************  User profile  *******************
  getUserProfile(val: any){
    return this.http.post<any[]>(this.ApiUrl + 'profile/', val);
  }

  updateUserProfile(val: any){
    return this.http.put<any[]>(this.ApiUrl + 'profile/', val);
  }

  // **********  Users list ***********
  getUsersList(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'list/');
  }

  addUser(val: any){
    return this.http.post<any[]>(this.ApiUrl + 'list/', val);
  }

  updateUser(val: any){
    return this.http.put<any[]>(this.ApiUrl + 'list/', val);
  }

  deleteUser(val: any){
    return this.http.delete<any[]>(this.ApiUrl + 'delete/' + val + '/');
  }

}
