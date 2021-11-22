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

  filters: any[];
  reportDate: any;

  constructor(private service: ConnexionsService) { }

  ngOnInit(): void {
    this.filters  = [
      {name: 'Today', code: 'd'},
      {name: 'Last 7 days', code: 'w'},
      {name: 'Last 30 days', code: 'm'},
    ];
  }

  loadReport(){
    this.report = undefined;
    if (this.reportDate !== null){
      this.service.getGlobalReport(this.reportDate.code).subscribe(
        (result: any) => {
          this.report = result;
        }
      );
    }
  }

}


