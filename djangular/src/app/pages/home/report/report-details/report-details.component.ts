import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit {
  @Input() report: any;
  @Input() date: any;
  @ViewChild('bar_chart', {static: false}) el!: ElementRef;
  @ViewChild('pie_chart', {static: false}) el1!: ElementRef;
  cols1: any;
  cols2: any;
  exportColumns1: any[];
  exportColumns2: any[];

  options1: any;
  options2: any;
  dataByDeviceChart: any;
  connectionsByDeviceChart: any;
  colors: any = ['#8963b5',
    '#93f99e',
    '#42cffe',
    '#2cc867',
    '#aca8d1',
    '#e69f97',
    '#373348',
    '#857386',
    '#f0fc0b',
    '#72c54a',
    '#a346a8',
    '#af3503',
    '#a2406a',
    '#2d645c',
    '#2f8ca3',
    '#009907',
    '#b27b3a',
    '#732b3a',
    '#657904',
    '#d49558',
    '#a25fec',
    '#e9d34e'
  ];


  constructor() { }

  ngOnInit(): void {
    this.cols1 = [
      { field: 'ip', header: 'IP Address' },
      { field: 'name', header: 'Name' },
      { field: 'total', header: 'Total (Mo)' },
    ];
    this.cols2 = [
      { field: 'name', header: 'Name' },
      { field: 'first_con', header: 'First Con.' },
      { field: 'last_con', header: 'Last Con.' },
      { field: 'destinations', header: 'Destinations' },
    ];
    this.exportColumns1 = this.cols1.map(col => ({title: col.header, dataKey: col.field}));
    this.exportColumns2 = this.cols2.map(col => ({title: col.header, dataKey: col.field}));

    this.options1 = {
        title: {
          display: true,
          text: 'Data by device (Mo)'
      },
      responsive: true,
      legend: {
          display: false,
        labels: {
          usePointStyle: true,
        }
      },
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
    this.options2 = {
      title: {
        display: true,
        text: 'Connections by device (Count)'
      },
      responsive: true,
      legend: {
        labels: {
          usePointStyle: true,
        }
      },
      animation: {
        duration: 0
      }
    };
    this.loadDataConsumptionChart();
    this.loadConnectionsChart();

  }

  loadDataConsumptionChart() {
    const devices = [];
    const totals = [];

    for (const item of this.report.data_by_device) {
      devices.push(item.name);
      totals.push(item.total);
    }
    this.dataByDeviceChart = {
      labels: devices,
      datasets: [
        {
          label: 'Data by Device (Mo)',
          data: totals,
          backgroundColor: this.colors,
          hoverBackgroundColor: '#36b9cc',
          hoverBorderColor: '#36b9cc',
          hoverBorderWidth: 4,
        }
      ]
    };
  }

  loadConnectionsChart() {
    const devices = [];
    const totals = [];

    for (const item of this.report.connections_by_device) {
      devices.push(item.name);
      totals.push(item.destinations.length);
    }
    this.connectionsByDeviceChart = {
      labels: devices,
      datasets: [
        {
          label: 'Destinations count',
          data: totals,
          backgroundColor: this.colors,
          hoverBackgroundColor: '#36b9cc',
          hoverBorderColor: '#36b9cc',
          hoverBorderWidth: 4,
        }
      ]
    };
  }

  fillPDFBody(doc) {
    doc.setFontSize(12);
    doc.text('Data consumption by device', 40, 190);
    autoTable(doc, {
      columns: this.exportColumns1,
      body: this.report.data_by_device,
      startY:  200,
      tableWidth: 'wrap'
    });

    let finalY = (doc as any).lastAutoTable.finalY; // The y position on the page
    html2canvas(this.el.nativeElement).then(canvas => {

      const fileWidth = 350;
      const fileHeight = 200;

      const FILEURI = canvas.toDataURL('image/png');
      doc.addImage(FILEURI, 'PNG', 270, 180, fileWidth, fileHeight);

      if (finalY < 380){
        finalY = 380;
      }
      else if (finalY > 700){
        doc.addPage();
        finalY = 0;
      }
      finalY += 40;
      this.insertNextContent(doc, finalY);
    });

  }
  insertNextContent(doc, finalY){
    doc.text('Connections by device', 40, finalY);
    autoTable(doc, {
      columns: this.exportColumns2,
      body: this.report.connections_by_device,
      startY: finalY + 20,
      tableWidth: 'wrap',
      columnStyles: {
        name: {cellWidth: 80},
        first_con: {cellWidth: 60},
        last_con: {cellWidth: 60},
        destinations: {cellWidth: 320},
        // etc
      },
      styles: {
        overflow: 'linebreak',
        valign: 'middle'
      }
    });
    doc.save('K-POT_report_' + new Date().toLocaleDateString() + '.pdf');
  }

  saveHeaders(){
    const doc = new jsPDF('p', 'pt', 'a4');
    // image
    const img = new Image();
    img.src = 'assets/logos/kpot5.PNG';
    doc.addImage(img, 'png', 460, 20, 100, 40);
    // end image
    doc.setFontSize(20);
    doc.setTextColor('#000');
    doc.text('Global report', 40, 40);


    doc.setFont('Helvetica'); // set custom font
    doc.setFontSize(13);
    doc.text('' + new Date().toLocaleDateString(), 45, 60);
    //doc.setTextColor('#0b7aef');
    doc.line(0, 90, 1200, 90);
    doc.text('Report Period', 60, 120);
    doc.text('Total Data Consumed', 230, 120);
    doc.text('Total User Connected', 430, 120);
    doc.setTextColor('#000');
    doc.setFontSize(11);
    doc.text(this.date, 60, 140);
    doc.text(this.report.total_data >= 1000 ? (this.report.total_data / 1000).toFixed(2) + ' Go' : this.report.total_data + ' Mo', 260, 140);
    doc.text('' + this.report.data_by_device.length, 480, 140);

    doc.line(0, 160, 1200, 160);

    html2canvas(document.getElementById('period')).then(canvas => {

      const fileWidth = 15;
      const fileHeight = 15;

      const FILEURI = canvas.toDataURL('image/png');
      doc.addImage(FILEURI, 'PNG', 40, 108, fileWidth, fileHeight);
      html2canvas(document.getElementById('total_data')).then(canvas2 => {

        const FILEURI2 = canvas2.toDataURL('image/png');
        doc.addImage(FILEURI2, 'PNG', 210, 108, fileWidth, fileHeight);
        html2canvas(document.getElementById('connections')).then(canvas3 => {

          const FILEURI3 = canvas3.toDataURL('image/png');
          doc.addImage(FILEURI3, 'PNG', 410, 108, fileWidth, fileHeight);
          this.fillPDFBody(doc);
        });
      });
    });
  }



}
