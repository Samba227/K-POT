import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import {DashboardService} from '../../../services/dashboard.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {

  topUsernames: any;
  topPasswords: any;
  topIPs: any;
  userPass: any;
  mapData: any[] = [];
  debits: any[];
  averageBandwidth: any;
  data2: any;

  options: any;
  options2: any;
  //*********
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  //**********

  constructor(private dashboardService: DashboardService) {
   }

  ngOnInit(): void {
    this.loadData();
    this.loadBandwith();

  }


  loadData() {
    this.dashboardService.getData().subscribe(
      (result: any) => {
        if(result.topUsername !== undefined)
          this.topUsernames = {
            labels: result.topUsername.usernames,
            datasets: [
              {
                data: result.topUsername.count,
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

        if(result.topPassword !== undefined)
          this.topPasswords = {
            labels: result.topPassword.password,
            datasets: [
              {
                data: result.topPassword.count,
                backgroundColor: [
                  "rgba(6,101,8,0.71)",
                  "rgba(21,134,24,0.76)",
                  "rgba(33,180,37,0.77)",
                  "#7ee581",
                  "#b4eab5",
                ],
                hoverBackgroundColor: "#0a3d02",
                hoverBorderColor: "#0a3d02",
                hoverBorderWidth: 4
              }
            ]
          };

        if (result.topIPs !== undefined)
          this.topIPs = result.topIPs;

        if (result.userPass !== undefined)
          this.userPass = result.userPass;

        if (result.locations !== undefined){this.loadMap(result.locations);}

      }
    );


    this.options = {
      legend: {
        position: 'left',
        labels: {
          usePointStyle: true,
        }
      }};
    this.options2 = {
      legend: {
        labels: {
          usePointStyle: true,
        }
      },
      animation: {
        duration: 0
      }
    };
  }

  loadMap(locations: any) {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set('pk.eyJ1Ijoic2FtYmEyMjciLCJhIjoiY2t1bnVtNDR5MTZxeDJvbW9vdWtyZGNrMyJ9.IJ9-u5SvXqr_gttvk-a6ng');
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 5,
      center:  locations > 0 ? this.mapData[0]?.location : [-7.5898434, 33.5731104]
    });
    for (const data of locations) {
      // Create a  Marker and add it to the map.
      new mapboxgl.Marker()
        .setLngLat(data.location)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(
          data.city
        ))
        .addTo(this.map);
    }
   // Add map controls
      this.map.addControl(new mapboxgl.NavigationControl());

  }

  loadBandwith(){
    this.debits = new Array(20).fill(0);
    const labels =  new Array(20).fill('');
    const sum = this.debits.reduce((a, b) => a + b, 0);
    this.averageBandwidth = (sum / this.debits.length) || 0;
    labels[0] = '20';
    labels[19] = '0';
    setInterval(
      () => {
        this.dashboardService.getBandwidth().subscribe(
          (result: any) => {
            if (result.success !== undefined){
              this.debits.shift();
              this.debits.push(result.size);

              this.data2 = {
                labels: labels,
                datasets: [
                  {
                    label: 'Bandwidth',
                    data: this.debits,
                    borderWidth: 2,
                    fill: false,
                    backgroundColor: "rgba(239,173,73,0.75)",
                    borderColor: "rgba(54,162,235,0.7)",
                    hoverBackgroundColor: "#f87502",
                    hoverBorderColor: "#f87502",
                    hoverBorderWidth: 4


                  }
                ]
              };
            }
          }
        );
      }, 1000
    );
  }
}
