import { Component, OnInit, Input } from '@angular/core';
import {Packet} from '../../../../models/Packet.model';

@Component({
  selector: 'app-frame-detail',
  templateUrl: './frame-detail.component.html',
  styleUrls: ['./frame-detail.component.css']
})
export class FrameDetailComponent implements OnInit {
  @Input() frame: Packet;
  constructor() { }

  ngOnInit(): void {
  }

}
