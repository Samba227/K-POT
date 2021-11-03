import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConnexionsService} from '../../../services/connexions.service';


@Component({
  selector: 'app-computers',
  templateUrl: './computers.component.html',
  styleUrls: ['./computers.component.css']
})
export class ComputersComponent implements OnInit {
  newEntry: any;
  computers: any[];
  computerForm: FormGroup = new FormGroup({
    ip: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required])
  });
  constructor(private connexionsService: ConnexionsService) { }

  ngOnInit(): void {
    console.log(window.location);
    this.newEntry = true;
    this.computers = [];
  }

  addComputer(){
    console.log('add');
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
    this.newEntry = false;
    this.computerForm.patchValue(
      {
        ip: computer.ip,
        name: computer.name
      }
    );
  }

  editComputer() {
    console.log('edit');
  }
}
