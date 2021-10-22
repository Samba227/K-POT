import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Frame} from '../../../models/frame.model';
import {ConnexionsService} from '../../../services/connexions.service';
import {FrameSortService} from '../../../services/frame-sort.service';
import {Connexion} from '../../../models/connexion.model';
import {Packet} from '../../../models/Packet.model';
import {HMMOffline} from '../../../models/HMMOffline.model';


@Component({
  selector: 'app-offline-connexions',
  templateUrl: './offline-connexions.component.html',
  styleUrls: ['./offline-connexions.component.css']
})
export class OfflineConnexionsComponent implements OnInit {

  labelForm: FormGroup;

connexions: Connexion[];

  sort = [];

  filteredFrames: Packet[];
  frames: Packet[];

  selectedConnexion: Connexion;
  selectedFrame: Packet;
  connexion_hmm: HMMOffline;


  constructor(
    private connexionsService: ConnexionsService,
    private frameSortService: FrameSortService
  ) { }

  ngOnInit(): void {
    this.sort = ['', 'asc'];
    this.refreshlist();
  }

  refreshlist(){

    this.connexionsService.getConnexions().subscribe(
      (data: any) => {
        this.connexions = data.connexions;
        this.frames = [];
        this.filteredFrames = this.frames;
      }
    );

  }

  // ------- get connexion frames ----------
  getFrames(con: Connexion){

    this.connexionsService.getConnexionFrames(con).subscribe(
      (data: any) => {
        this.frames = data.frames;
        this.filteredFrames = this.frames;
        this.selectedConnexion = con;
        this.selectedFrame = undefined;
        if (data.hmm !== undefined){
          this.connexion_hmm = data.hmm;
          this.labelForm = new FormGroup({
            label: new FormControl('', [Validators.required])
          });

          this.labelForm.patchValue(
            {
              'label': this.connexion_hmm.label
            }
          );
        }
        else{
        this.connexion_hmm = undefined;
        this.labelForm = undefined;
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


  updateConnexionLabel(){
    const data = {
      'connexion': this.connexion_hmm.connexion,
      'label': this.labelForm.get('label').value
    }

    this.connexionsService.updateConnexionLabel(data).subscribe(
      (res: any) => {
        if (res.success !== undefined){
          alert('Label updated successfully');
        }
        else{
          alert('Error while updating Label !!');
        }
      }
    );
  }

  range(len: number){
    var l = []
    for (let i = 0; i < len; i++) {
    l.push(i);
  }
  return l;
  }

}
