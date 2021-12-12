import { Component, OnInit} from '@angular/core';
import {ConnexionsService} from '../../../services/connexions.service';
interface Report {
  top_dest: any[];
  data_by_ip: any[];
  total_data: any;
  connexions_by_date: any[];
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  report: Report;

  dates: any[];
  reportDate: any;

  constructor(private service: ConnexionsService) { }

  ngOnInit(): void {
    this.service.getAllReportsDates().subscribe(
      (result: any) => {
        if (result.dates !== undefined){
          this.dates = result.dates;
        }
      }
    );
  }

  loadReport(){
    this.report = undefined;
    if (this.reportDate !== null){
      this.service.getReport(this.reportDate).subscribe(
        (result: any) => {
          if (result.report !== undefined){
            this.report = result.report;
          }
        }
      );
    }
  }

}


