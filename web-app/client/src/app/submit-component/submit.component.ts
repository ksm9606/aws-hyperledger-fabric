import { Component, OnInit } from '@angular/core';

import { CreateCarFormComponent } from './create-car-form/create-car-form.component';


@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  constructor() { }

  showCreateCar = true;

  ngOnInit() {
  }

  toggle(tabName) {
    if (tabName === 'change') {
      this.showCreateCar = false;
    }
    if (tabName === 'create') {
      this.showCreateCar = true;
    }
  }
}
