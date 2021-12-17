import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnexionsService {
  readonly ApiUrl = 'http://192.168.2.1:8081/api/connexions';
  readonly ApiUrl2 = 'http://192.168.2.1:8081/';

  constructor(private http: HttpClient) { }


 // ========= OFFLINE CONNEXIONS =================

// ************  liste des connexions distinctes *******************
  getConnexions(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + '/offline/');
  }

  // ************  liste des paquets d'une connexion *******************
  getConnexionFrames(val: any){
    return this.http.post<any[]>(this.ApiUrl + '/offline/', val);
  }

  // ************  mettre à jour le label d'une connexion *******************
  updateConnexionLabel(val: any){
    return this.http.put<any[]>(this.ApiUrl + '/offline/', val);
  }

  //========= ONLINE CONNEXIONS =================

  // ************  liste des connexions distinctes *******************
  getOnlineConnexions(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + '/online/');
  }

  // ************  liste des paquets d'une connexion *******************
  getOnlineConnexionFrames(val: any){

    return this.http.post<any[]>(this.ApiUrl + '/online/', val);
  }

  // ************  trouver le label d'une connexion *******************
  checkConnexionLabel(val: any){

    return this.http.post<any[]>(this.ApiUrl + '/online/checkhmm/', val);
  }

  // ************ les parametres de l'application de capture *******************
  getCaptureSettings(): Observable<any[]>{

    return this.http.get<any[]>(this.ApiUrl + '/frames_capture_conf/');
  }

  updateCaptureSettings(val: any){

    return this.http.put<any[]>(this.ApiUrl + '/frames_capture_conf/', val);
  }

  // ========= BLACKLIST ADDRESSES =================

  // ************  liste des adresses suspects *******************
  getBlackistAddresses(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + '/blacklist/');
  }

  // ************  ajout d'une adresse à la liste *******************
  addAddressIntoBlacklist(val: any){

    return this.http.post<any[]>(this.ApiUrl + '/blacklist/', val);
  }


  // ========= HONEYPOT CONNECTIONS =================
  getHoneypotConnections(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl2);
  }

  getConnectionProfile(val: any){
    return this.http.post<any[]>(this.ApiUrl2, val);
  }

  // ========= Local Machines =================

  // ************  list des machines locales *******************
  getMachines(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl + '/localMachines/');
  }

  // ************  mise à jour d'une machine *******************
  updateMachine(val: any){
    return this.http.put<any[]>(this.ApiUrl + '/localMachines/', val);
  }

  // ========= REPORT GENERATION =================
  getAllReportsDates(): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl2 + 'api/report/');
  }
  getReport(date: any): Observable<any[]>{
    return this.http.get<any[]>(this.ApiUrl2 + 'api/report/date=' + date + '/');
  }
}
