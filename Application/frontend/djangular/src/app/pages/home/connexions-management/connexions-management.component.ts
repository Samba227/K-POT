import {Component, OnInit} from '@angular/core';
import {Frame} from '../../../models/frame.model';
import {ConnexionsService} from '../../../services/connexions.service';
import {FrameSortService} from '../../../services/frame-sort.service';
import {Connexion} from '../../../models/connexion.model';
import {Packet} from '../../../models/Packet.model';
import {HMMOnline} from '../../../models/HMMOnline.model';



@Component({
  selector: 'app-connexions-management',
  templateUrl: './connexions-management.component.html',
  styleUrls: ['./connexions-management.component.css']
})
export class ConnexionsManagementComponent implements OnInit {
  connexions: Connexion[];

  sort = [];

  filteredFrames: Packet[];
  frames: Packet[];

  selectedConnexion: Connexion;
  selectedFrame: Packet;

  connexion_hmm: HMMOnline;
  showLabel: boolean = false;
  foundLabel: any;
  distance: any;


  activateAddBlacklist: boolean = false;
  showAddToBlacklistMessage: boolean = false;
  alert: any;


  constructor(
    private connexionsService: ConnexionsService,
    private frameSortService: FrameSortService
  ) { }

  ngOnInit(): void {
    this.sort = ['', 'asc'];
    this.refreshlist();
  }

  refreshlist(){

    this.connexionsService.getOnlineConnexions().subscribe(
      (data: any) => {
        this.connexions = data.connexions;
        this.frames = [];
        this.filteredFrames = this.frames;
      }
    );

  }

  // ------- get connexion frames ----------
  getFrames(con: Connexion){
    this.connexionsService.getOnlineConnexionFrames(con).subscribe(
      (data: any) => {
        this.frames = data.frames;
        this.filteredFrames = this.frames;
        this.selectedConnexion = con;
        this.selectedFrame = undefined;
        if (data.hmm !== undefined){
          this.connexion_hmm = data.hmm;
        }
        else{
        this.connexion_hmm = undefined;
        }
      }
    );
  }

  sortBy(val: string){
    if (this.sort[0] !== val){
      this.sort[0] = val;
      this.sort[1] = 'asc';
      this.filteredFrames = this.frameSortService.sortBy(val, this.frames, this.sort[1]);
    }

    else {
      if (this.sort[1] === 'asc'){
        this.sort[1] = 'desc';
        this.filteredFrames = this.frameSortService.sortBy(val, this.frames, this.sort[1]);
      }
      else {
        this.sort[1] = 'asc';
        this.filteredFrames = this.frameSortService.sortBy(val, this.frames, this.sort[1]);
      }
    }
  }

  resetFilter(){
    this.sort[0] = 'time';
    this.sort[1] = 'asc';
    this.filteredFrames = this.frameSortService.sortBy('time', this.frames, this.sort[1]);
  }


  onSelectFrame(frame: any){
    this.selectedFrame = frame;
  }


  searchFilter(event){
    this.filteredFrames = [];
    for (const frame of this.frames) {
      const name = String(frame.ip_src + frame.ip_dst + frame.protocol).toLowerCase();
      if (name.includes(String(event.target.value).toLowerCase())){
        this.filteredFrames.push(frame);
      }
    }
  }

  range(len: number){
    const l = [];
    for (let i = 0; i < len; i++) {
      l.push(i);
    }
    return l;
  }

  searchLabel(connexion: any){

    const data = {
      connexion: connexion
    };
    this.connexionsService.checkConnexionLabel(data).subscribe(
      (result: any) => {
        if (result.success !== undefined){
          this.showLabel = true;
          this.foundLabel = result.label;
          this.distance = result.distance;
        }
        else{
          alert('erreur de resultat');
        }
      }
      );
  }

  closeClick(){
    this.showLabel = false;
    this.foundLabel = undefined;
    this.distance =  undefined;
  }

  addBlacklist(addr: any){
    const data = {
      address: addr
    }
    this.connexionsService.addAddressIntoBlacklist(data).subscribe(
      (result: any) => {
        if (result.success === undefined){
          this.alert = result.error;
        }
        this.showAddToBlacklistMessage = true;
      }
      );
  }

  addToBlacklistClick(){
    this.activateAddBlacklist = true;
  }

  closeBlacklistModal(){
    this.activateAddBlacklist = false;
  }

  closeAddToBlacklistMessage(){
    this.showAddToBlacklistMessage = false;
    this.closeBlacklistModal();
    this.closeClick()
  }

}


