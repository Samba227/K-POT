import { Component, OnInit } from '@angular/core';
import {ConnexionsService} from '../../../services/connexions.service';
interface IP {
  name: string;
  value: string;
}

@Component({
  selector: 'app-honeypot-connections',
  templateUrl: './honeypot-connections.component.html',
  styleUrls: ['./honeypot-connections.component.css']
})

export class HoneypotConnectionsComponent implements OnInit {
  connections: IP[] = [];
  display: boolean = false;
  selectedIp: IP;
  selectedProfile: any[];

  constructor(
    private service: ConnexionsService
  ) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(){
    this.service.getHoneypotConnections().subscribe(
      (data: any) => {
        if (data.success !== undefined){
          for (const ip of data.IPs) {
            this.connections.push({name: ip, value: ip});
          }
          this.display = true;
        }
      }
    );
  }

  loadProfile(){
    this.selectedProfile = undefined;
    this.service.getConnectionProfile({ip: this.selectedIp}).subscribe(
      (data: any) => {

        if (data.success !== undefined){
          this.selectedProfile = [data.profile, data.actions, data.loginAttempts];
        }
      }
    );
  }
}
