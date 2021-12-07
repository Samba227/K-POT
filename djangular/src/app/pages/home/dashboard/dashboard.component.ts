import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedDevice: any;
  devices: any[];
  totalData: any = 0;
  showDetails: boolean = false;
  activeIps: any[];
  chartValues: any[];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getTotalConsumption('d').subscribe(
      (result: any) => {
        if (result.success !== undefined){
          this.totalData = result.total;
        }
      }
    );

    this.refreshDevicesList();

    setTimeout(
      () => {
        this.loadActives();
      },
      1000
    );
    setInterval(
      () => {
        this.loadActives();
      },
      5000
    );
  }

  refreshDevicesList(){
    this.dashboardService.getAllDevices().subscribe(
      (result: any) => {
        if (result.success !== undefined){
          this.devices = result.devices;
        }
      }
    );
  }

  loadActives(){
      this.dashboardService.getActiveDevices().subscribe(
        (result: any) => {
          if (result.success !== undefined){
            for (const device of this.devices) {
              device.isActive = false;
            }
            this.activeIps = result.ips;
            for (const ip of this.activeIps) {
              for (const device of this.devices) {
                if (device.ip === ip) {
                  device.isActive = true;
              }}
            }
          }
        }
      );
  }

  onSelectDevice(device){
    this.chartValues = [];
    for (let i = 0; i < 2; i++) {
      this.chartValues.push(new Array(30).fill(0));
    }
    this.selectedDevice = device;
    this.showDetails = true;
  }

  closeClick(){
    location.reload();
  }

}
