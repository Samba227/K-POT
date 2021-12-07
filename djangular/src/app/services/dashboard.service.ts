import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly ApiUrl = 'http://192.168.2.1:8081/api/dashboard/';
  constructor(private http: HttpClient) { }

  getTotalConsumption(date: any): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'total-consumption/d=' + date + '/');
  }

  getAllDevices(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'local-devices/filter=all/');
  }

  getActiveDevices(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'local-devices/filter=active/');
  }

  getDeviceConsumption(ip: any, date: any): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'device-consumption/' + ip + '/d=' + date + '/');
  }
}
