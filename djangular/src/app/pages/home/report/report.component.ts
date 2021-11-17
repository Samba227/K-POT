import { Component, OnInit} from '@angular/core';
import {ConnexionsService} from '../../../services/connexions.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  cols1: any[];
  cols2: any[];

  report: any = {};

  exportColumns1: any[];
  exportColumns2: any[];

  constructor(private service: ConnexionsService) { }

  ngOnInit(): void {
    this.service.getGlobalReport('w').subscribe(
      (result: any) => {
        this.report.topDest = result.top_dest;
        this.report.dataByIp = result.data_by_ip;
        this.report.totalData = result.total_data;
        this.report.conByIP = result.connexions_by_date;
      }
    );
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
    doc.text('Global report', 40, 20);

    doc.setFont('Helvetica'); // set custom font
    doc.setFontSize(12);
    doc.text('' + new Date().toLocaleDateString(), 480, 20);

    doc.line(0, 40, 1200, 40);
    autoTable(doc, {
      columns: this.exportColumns1,
      body: this.report.topDest,
      startY:  80,
      didDrawPage: (dataArg) => {
        doc.text('Top Destinations', dataArg.settings.margin.left, 60);
      }
    });
    let finalY = (doc as any).lastAutoTable.finalY; // The y position on the page
    autoTable(doc, {
      columns: this.exportColumns2,
      body: this.report.dataByIp,
      startY: finalY + 70,
      didDrawPage: (dataArg) => {
        doc.text('Data By IP', dataArg.settings.margin.left, finalY + 50);
      }
    });

    finalY = (doc as any).lastAutoTable.finalY;
    // -- html table
    (doc as any).autoTable({ html: '#dataTable' });
    doc.save('topDest.pdf');
  }

}


