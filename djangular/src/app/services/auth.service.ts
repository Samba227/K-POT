import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly ApiUrl = 'http://127.0.0.1:8000/api/auth/';

  constructor(private http: HttpClient) { }

// ************  Users service  *******************
  adminLogin(val: any){
    return this.http.post(this.ApiUrl + 'admin-login/', val);
  }

  userLogout(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'logout/');
  }

  userLogin(val: any){
    return this.http.post(this.ApiUrl + 'login/', val);
  }


  userRegister(val: any){
    return this.http.post(this.ApiUrl + 'register/', val);
  }

}
