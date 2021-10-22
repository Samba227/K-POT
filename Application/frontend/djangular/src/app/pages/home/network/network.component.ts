import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../../services/dashboard.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  default: any;
  bandwidths: any;
  bandwidthByIP: any;
  consumptionByIP: any;
  actualBandwidths: any[];
  datasets: any;
  averageBandwidth: any;
  bandwidthDetails: any;
  basicData: any;
  dataConsumptionDate: any = 'y';
  colors: any = [
    "rgba(2,91,250,0.78)",
    "rgba(25,135,243,0.88)",
    "#44aff5",
    "rgba(65,178,231,0.64)",
    "rgba(27,213,213,0.89)",
    "rgba(52,167,170,0.88)",
    "#ADD8E6",
    "#B0E0E6",
    "#B0C4DE"
  ];
  options1: any;
  options2: any;
  options3: any;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.options3 = {
      responsive: true,
      legend: {
      //  position: 'left',
        labels: {
          usePointStyle: true,
        },
      },
      animation: {
        duration: 0
      }
    };
    this.options2 = {
      responsive: true,
      legend: {
        //  position: 'left',
        labels: {
          usePointStyle: true,
        },
      }
    };
    this.options1 = {
      responsive: true,
      legend: {
        labels: {
          usePointStyle: true,
        }
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true
          }
        }]
      },
      animation: {
        duration: 0
      }
    };
    this.loadDataConsumption();
    this.loadBandwith();
  }


  loadBandwith(){
    this.actualBandwidths = new Array(30).fill(0);
    const labels =  new Array(30).fill('');
    const sum = this.actualBandwidths.reduce((a, b) => a + b, 0);
    this.averageBandwidth = (sum / this.actualBandwidths.length) || 0;
    labels[0] = '30';
    labels[29] = '0';
    const actualDetails: any[] = []; // new Array(100).fill(new Array(20).fill(0));
    for (let i = 0; i < 20; i++) {
      actualDetails.push(new Array(30).fill(0));
    }
    setInterval(
      () => {
        this.dashboardService.getData().subscribe(
          (result: any) => {
            if (result.success !== undefined){
              this.actualBandwidths.shift();
              this.actualBandwidths.push(Math.max.apply(null, result.details));

              this.bandwidths = {
                labels: labels,
                datasets: [
                  {
                    label: 'Total Bandwidth',
                    data: this.actualBandwidths,
                    borderWidth: 0.5,
                    fill: true,
                    backgroundColor: "rgba(239,173,73,0.75)",
                    borderColor: "rgba(54,162,235,0.7)",
                    hoverBorderColor: "#f87502",
                    hoverBorderWidth: 4
                  }
                ]
              };

              this.bandwidthByIP = {
                labels: result.ips,
                datasets: [
                  {
                    data: result.details,
                    backgroundColor: this.colors,
                    hoverBackgroundColor: "#ea0e3a",
                    hoverBorderColor: "#ea0e3a",
                    hoverBorderWidth: 4,
                  }
                ]
              };

              this.bandwidthDetails = {
                labels: result.ips,
                datasets: [
                  {
                    label: 'Bandwidth',
                    data: result.details,
                    borderWidth: 1,
                    fill: false,
                    backgroundColor: "rgba(239,173,73,0.75)",
                    borderColor: "rgba(243,142,77,0.7)",
                    hoverBackgroundColor: "#f87502",
                    hoverBorderColor: "#f87502",
                    hoverBorderWidth: 4
                  }
                ]
              };

              const data = [];
              for (let i = 0; i < result.details.length; i++) {
                actualDetails[i].shift();
                actualDetails[i].push(result.details[i]);
                data.push(
                  {
                    label: result.ips[i],
                    data: actualDetails[i],
                    fill: true,
                    borderColor: this.colors[i],
                    tension: .4
                  }
                );
              }
              this.basicData = {
                labels: labels,
                datasets: data
              };
              // -------
            }
          }
        );
      }, 1000
    );
  }

  private loadDataConsumption() {
    this.dashboardService.getConsumptionByDate(this.dataConsumptionDate).subscribe(
      (result: any) => {
        if (result.ips !== undefined){
          const values = result.values;
          const max = Math.max.apply(null, values);
          if (max >= 1000000) {
            for (let i = 0; i < values.length; i++) {
              values[i] = (values[i] / 1000000).toFixed(2);
            }
            this.default = 'Go';
          }
          else if (max >= 1000) {
            for (let i = 0; i < values.length; i++) {
              values[i] = (values[i] / 1000).toFixed(2);
            }
            this.default = 'Mo';
          }
          else {
            this.default = 'Ko';
          }
          this.consumptionByIP = {
            labels: result.ips,
            datasets: [
              {
                data: values,
                backgroundColor: [
                  "rgba(248,74,111,0.82)",
                  "rgba(226,62,100,0.8)",
                  "rgba(238,133,155,0.81)",
                  "rgba(234,171,184,0.84)",
                  "#f6e2e6",
                ],
                hoverBackgroundColor: "#ea0e3a",
                hoverBorderColor: "#ea0e3a",
                hoverBorderWidth: 4,
              }
            ]
          };
        }
      }
    );
  }
}
