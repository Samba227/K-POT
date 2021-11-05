import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../../services/dashboard.service';

@Component({
  selector: 'app-active-ips',
  templateUrl: './active-ips.component.html',
  styleUrls: ['./active-ips.component.css']
})
export class ActiveIpsComponent implements OnInit {

  activeIPs: any[];
  selectedIP: any;
  showDetails: boolean = false;
  actualDetails: any[];
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  private refreshList() {
    this.dashboardService.getActiveIPs().subscribe(
      (result: any) => {
        if (result.active !== undefined){
          this.activeIPs = result.active;
        }
      }
    );
  }

  onSelectFrame(ip: any){
    this.actualDetails = [];
    for (let i = 0; i < 2; i++) {
      this.actualDetails.push(new Array(30).fill(0));
    }
    this.selectedIP = ip;
    this.showDetails = true;

  }

  closeClick(){
    location.reload();
  }

}
