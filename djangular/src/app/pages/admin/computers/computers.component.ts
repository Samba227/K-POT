import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConnexionsService} from '../../../services/connexions.service';
import {Machine} from '../../../models/machine.model';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-computers',
  templateUrl: './computers.component.html',
  styleUrls: ['./computers.component.css'],
  providers: [MessageService]
})
export class ComputersComponent implements OnInit {
  refreshing: any = false;
  edit: any = false;
  machine: Machine;
  computers: any[];
  computerForm: FormGroup = new FormGroup({
    ip: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required])
  });
  constructor(
    private messageService: MessageService,
    private connexionsService: ConnexionsService
  ) { }

  ngOnInit(): void {
    this.computers = [];
    this.refreshList();
  }

  refreshList() {
    this.refreshing = true;
    this.connexionsService.getMachines().subscribe(
      (data: any) => {
        if (data.machines !== undefined) {
          this.computers = data.machines;
        }
      }
    );
    setTimeout(() => {this.refreshing = false; }, 1000);

  }

  addComputer(){
    this.computers.push({
      ip: this.computerForm.get('ip').value,
      name: this.computerForm.get('name').value
    });
    this.computerForm.patchValue(
      {
        ip: '',
        name: ''
      }
    );
  }

  editClick(computer){
    this.edit = true;
    this.machine = computer;
    this.computerForm.patchValue(
      {
        ip: computer.ip,
        name: computer.name
      }
    );
  }

  editComputer() {
    this.machine.ip = this.computerForm.get('ip').value;
    this.machine.name = this.computerForm.get('name').value;

    this.connexionsService.updateMachine(this.machine).subscribe(
      (res: any) => {
        if (res.success !== undefined){
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Updated Successfully !'});
          this.refreshList();
          this.computerForm.reset();
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Update failure !'});
        }
      }
    );
  }


}
