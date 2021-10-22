import { Component, OnInit } from '@angular/core';
import {ConnexionsService} from '../../../services/connexions.service';
import {CaptureConfig} from '../../../models/capture-config.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-capture-settings',
  templateUrl: './capture-settings.component.html',
  styleUrls: ['./capture-settings.component.css']
})
export class CaptureSettingsComponent implements OnInit {

  config: CaptureConfig;
  settingsForm: FormGroup = new FormGroup({
            interfaceIp: new FormControl('', [Validators.required]),
            framesNumber: new FormControl('', [Validators.required])
          });

  constructor(
    private connexionsService:ConnexionsService
    ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.connexionsService.getCaptureSettings().subscribe(
      (data:any) => {
        if (data.success !== undefined){
          this.config = data.config;

          this.settingsForm.patchValue(
            {
              'interfaceIp': this.config?.interface_ip,
              'framesNumber': this.config?.frames_number
            }
          );
        }
      }

      );
  }

  updateSettings(){
      
      this.config.interface_ip = this.settingsForm.get('interfaceIp').value;
      this.config.frames_number = this.settingsForm.get('framesNumber').value;

    this.connexionsService.updateCaptureSettings(this.config).subscribe(
      (res: any) => {
        if (res.success !== undefined){
          alert('settings are updated successfully');
        }
        else{
          alert('Error while updating settings !!');
        }
      }
    );
  }

}
