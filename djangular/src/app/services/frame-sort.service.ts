import { Injectable } from '@angular/core';
import {Frame} from '../models/frame.model';
import {Packet} from '../models/Packet.model';

@Injectable({
  providedIn: 'root'
})
export class FrameSortService {
  filteredFrames: Packet[] = [];
  constructor() { }

  sortBy(type: string, frames: Packet[], mode = 'asc'){
    if (type === 'time'){
      this.sortByFrameTime(frames, mode);
    }
    if (type === 'ip_source'){
      this.sortByIpSource(frames, mode);
    }
    if (type === 'ip_dest'){
      this.sortByIpDest(frames, mode);
    }
    if (type === 'protocol'){
      this.sortByProtocol(frames, mode);
    }
    return this.filteredFrames;
  }

  sortByFrameTime(frames: Packet[], mode = 'asc'){
    if (mode === 'desc'){
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.frame_time < f2.frame_time) {
          return 1;
        }

        if (f1.frame_time > f2.frame_time) {
          return -1;
        }

        return 0;
      });
    }
    else {
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.frame_time > f2.frame_time) {
          return 1;
        }

        if (f1.frame_time < f2.frame_time) {
          return -1;
        }

        return 0;
      });
    }
  }

  sortByIpSource(frames: Packet[], mode = 'asc'){
    if (mode === 'desc'){
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.ip_src > f2.ip_src) {
          return 1;
        }

        if (f1.ip_src < f2.ip_src) {
          return -1;
        }

        return 0;
      });
    }
    else {
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.ip_src < f2.ip_src) {
          return 1;
        }

        if (f1.ip_src > f2.ip_src) {
          return -1;
        }

        return 0;
      });
    }
  }

  sortByIpDest(frames: Packet[], mode = 'asc'){
    if (mode === 'desc'){
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.ip_dst > f2.ip_dst) {
          return 1;
        }

        if (f1.ip_dst < f2.ip_dst) {
          return -1;
        }

        return 0;
      });
    }
    else {
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.ip_dst < f2.ip_dst) {
          return 1;
        }

        if (f1.ip_dst > f2.ip_dst) {
          return -1;
        }

        return 0;
      });
    }
  }

  sortByProtocol(frames: Packet[], mode = 'asc'){
    if (mode === 'desc'){
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.protocol > f2.protocol) {
          return 1;
        }

        if (f1.protocol < f2.protocol) {
          return -1;
        }

        return 0;
      });
    }
    else {
      this.filteredFrames = frames.sort((f1, f2) => {
        if (f1.protocol < f2.protocol) {
          return 1;
        }

        if (f1.protocol > f2.protocol) {
          return -1;
        }

        return 0;
      });
    }
  }


}
