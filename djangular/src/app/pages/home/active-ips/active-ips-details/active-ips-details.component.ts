import { Component, OnInit, Input } from '@angular/core';
import {DashboardService} from '../../../../services/dashboard.service';

@Component({
  selector: 'app-active-ips-details',
  templateUrl: './active-ips-details.component.html',
  styleUrls: ['./active-ips-details.component.css']
})
export class ActiveIpsDetailsComponent implements OnInit {
 @Input() ip: any;
 options: any;
 data: any;
 @Input() actualDetails: any[];

 constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.options = {
      responsive: true,
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
    this.loadData();
  }

  loadData() {

    const labels =  new Array(30).fill('');
    labels[0] = '30';
    labels[29] = '0';

    setInterval(() => {
      this.dashboardService.getActiveIPConsumption(this.ip).subscribe(
        (result: any) => {
          if (result.success !== undefined){
            this.actualDetails[0].shift();
            this.actualDetails[1].shift();
            this.actualDetails[0].push(result.sent);
            this.actualDetails[1].push(result.recieved);
            const data = [
              {
                label: 'sent',
                data: this.actualDetails[0],
                fill: true,
                borderColor: '#FFA726',
                backgroundColor: 'rgba(255,167,38,0.2)',
                tension: .4
              },
              {
                label: 'received',
                data: this.actualDetails[1],
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
    }, 1000);
  }
}
