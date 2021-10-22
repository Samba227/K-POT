import {Component, OnInit} from '@angular/core';
import {BlacklistIP} from '../../../models/blacklistIP.model';
import {ConnexionsService} from '../../../services/connexions.service';


@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit {

  list : BlacklistIP[] = [];

  constructor(
    private connexionsService: ConnexionsService,
    ) { }

  ngOnInit(): void {
    this.refreshlist();
  }

  refreshlist(){
    this.connexionsService.getBlackistAddresses().subscribe(
      (data: any) => {
        if (data.BlacklistIPs !== undefined)
          this.list = data.BlacklistIPs;
      }
      );
  }
}
