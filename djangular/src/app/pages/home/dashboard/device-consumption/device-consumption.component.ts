import { Component, OnInit, Input } from '@angular/core';
import {DashboardService} from '../../../../services/dashboard.service';

@Component({
  selector: 'app-device-consumption',
  templateUrl: './device-consumption.component.html',
  styleUrls: ['./device-consumption.component.css']
})
export class DeviceConsumptionComponent implements OnInit {
  @Input() device: any;
  options: any;
  data: any;
  @Input() chartValues: any[];

  totalConsumption: any = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {

    this.getTotalConsumption();

    this.options = {
      responsive: true,
      scales: {
        xAxes: [{
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          }
        }]
      },
      animation: {
        duration: 0
      }
    };

    this.getRealTimeConsumption();
  }

  getTotalConsumption(){
    this.dashboardService.getDeviceConsumption(this.device.ip, 'd').subscribe(
  (result: any) => {
        if (result.success !== undefined){
          this.totalConsumption = result.sent + result.received;
        }
      }
      );
  }

  getRealTimeConsumption() {
      const labels =  new Array(30).fill('');
      labels[0] = '30';
      labels[29] = '0';
      setInterval(() => {
        this.dashboardService.getDeviceConsumption(this.device.ip, 's').subscribe(
          (result: any) => {
            if (result.success !== undefined){
              this.chartValues[0].shift();
              this.chartValues[1].shift();
              this.chartValues[0].push(result.sent);
              this.chartValues[1].push(result.received);
              const data = [
                {
                  label: 'sent',
                  data: this.chartValues[0],
                  fill: true,
                  borderColor: '#FFA726',
                  backgroundColor: 'rgba(255,167,38,0.2)',
                  tension: .4
                },
                {
                  label: 'received',
                  data: this.chartValues[1],
                  fill: false,
                  borderDash: [5, 5],
                  tension: .4,
                  borderColor: '#66BB6A'
                }
              ];
              this.data = {
                labels: labels,
                datasets: data
              };
            }
          }
        );
      }, 1200);
    }
}
