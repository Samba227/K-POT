import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly ApiUrl = 'http://192.168.1.161:8081/api';

  constructor(private http: HttpClient) { }

// ************  Users service  *******************
  adminLogin(val: any){
    return this.http.post(this.ApiUrl + '/auth/admin-login/', val);
  }

  userLogout(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + '/auth/logout/');
  }

  userLogin(val: any){
    return this.http.post(this.ApiUrl + '/auth/login/', val);
  }


  userRegister(val: any){
    return this.http.post(this.ApiUrl + '/auth/register/', val);
  }

}
