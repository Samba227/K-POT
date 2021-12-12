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
  @Input() report: any;
  @Input() date: any;

  constructor() { }

  ngOnInit(): void {
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

    doc.setFontSize(10);
    doc.text(this.date.name, 40, 140);
    doc.text(this.report.total_data >= 1000000 ? (this.report.total_data / 1000000).toFixed(2) + ' Go' : this.report.total_data >= 1000 ? (this.report.total_data / 1000).toFixed(2) + ' Mo' : this.report.total_data + ' Ko', 280, 140);

    doc.setFontSize(12);

    doc.text('Data consumption by device', 40, 190);
    (doc as any).autoTable(
      { html: '#dataByDevices',
        startY: 200,
        styles: {
          overflow: 'linebreak',
          valign: 'middle'
        }
      });

    let finalY = (doc as any).lastAutoTable.finalY; // The y position on the page
    /*
    // -- html table
    doc.text('Connections by date', 40, finalY + 70);
    (doc as any).autoTable(
      { html: '#dataTable',
        startY: finalY + 80,
        styles: {
        overflow: 'linebreak',
        valign: 'middle'
      }
      });*/
    doc.save('globalReport.pdf');
  }

}


