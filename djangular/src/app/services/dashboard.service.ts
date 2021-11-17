import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly ApiUrl = 'http://192.168.2.1:8081/api/dashboard/';
  constructor(private http: HttpClient) { }

  getData(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl);
  }
  getBandwidth(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'bandwidth/');
  }

  getConsumptionByDate(date: any): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'data/d=' + date + '/');
  }

  getActiveIPs(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'activeIPs/');
  }

  getActiveIPConsumption(ip: any): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + 'activeIPs/' + ip + '/d=s/');
  }
}

