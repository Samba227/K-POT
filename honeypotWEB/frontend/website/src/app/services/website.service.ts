import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  readonly ApiUrl = 'http://192.168.1.161:8082/home/';

  constructor(private http: HttpClient) { }

// ************  add connection profile *******************
  addProfile(val: any){
    return this.http.post<any[]>(this.ApiUrl, val);
  }

  // ************  add profile action *******************
  addProfileAction(val: any){
    return this.http.post<any[]>(this.ApiUrl + 'action/speed/', val);
  }

  // ************  add profile login attempt *******************
  addLoginAttempt(val: any){
    return this.http.post<any[]>(this.ApiUrl + 'action/login/', val);
  }


}
