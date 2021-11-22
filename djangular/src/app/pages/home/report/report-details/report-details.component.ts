import { Component, OnInit, Input } from '@angular/core';
import {ConnexionsService} from '../../../../services/connexions.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit {
  cols1: any[];
  cols2: any[];

  @Input() report: any;
  @Input() date: any;

  exportColumns1: any[];
  exportColumns2: any[];

  constructor(private service: ConnexionsService) { }

  ngOnInit(): void {
    this.cols1 = [
      { field: 'ip', header: 'IP' },
      { field: 'name', header: 'Name' },
      { field: 'count', header: 'Count (Ko)' },
    ];
    this.cols2 = [
      { field: 'ip', header: 'IP' },
      { field: 'name', header: 'Name' },
      { field: 'total', header: 'Total (Ko)' },
    ];
    this.exportColumns1 = this.cols1.map(col => ({title: col.header, dataKey: col.field}));
    this.exportColumns2 = this.cols2.map(col => ({title: col.header, dataKey: col.field}));
  }

  exportPdf() {

    const doc = new jsPDF('p', 'pt', 'a4');
    // image
    const img = new Image();
    img.src = 'assets/logos/kpot5.PNG';
    doc.addImage(img, 'png', 40, 5, 100, 40);
    // end image
    doc.setFontSize(20);
    doc.text('Global report', 240, 60);


    doc.setFont('Helvetica'); // set custom font
    doc.setFontSize(12);
    doc.text('' + new Date().toLocaleDateString(), 480, 30);

    doc.line(0, 80, 1200, 80);
    doc.text('Report Period', 40, 120);
    doc.text('Total Data Consumed', 240, 120);
    doc.text('Total User Connected', 450, 120);

    doc.setFontSize(10);
    doc.text(this.date.name, 40, 140);
    doc.text(this.report.total_data >= 1000000 ? (this.report.total_data / 1000000).toFixed(2) + ' Go' : this.report.total_data >= 1000 ? (this.report.total_data / 1000).toFixed(2) + ' Mo' : this.report.total_data + ' Ko', 280, 140);
    doc.text('' + this.report.data_by_ip.length, 500, 140);

    doc.setFontSize(12);
    autoTable(doc, {
      columns: this.exportColumns1,
      body: this.report.top_dest,
      startY:  200,
      didDrawPage: (dataArg) => {
        doc.text('Top destinations', dataArg.settings.margin.left, 190);
      }
    });
    let finalY = (doc as any).lastAutoTable.finalY; // The y position on the page
    autoTable(doc, {
      columns: this.exportColumns2,
      body: this.report.data_by_ip,
      startY: finalY + 70,
      didDrawPage: (dataArg) => {
        doc.text('Data consumption by device', dataArg.settings.margin.left, finalY + 50);
      }
    });

    finalY = (doc as any).lastAutoTable.finalY;
    // -- html table
    doc.text('Connections by date', 40, finalY + 70);
    (doc as any).autoTable(
      { html: '#dataTable',
        startY: finalY + 80,
        styles: {
        overflow: 'linebreak',
        valign: 'middle'
      }
      });
    doc.save('globalReport.pdf');
  }

}


