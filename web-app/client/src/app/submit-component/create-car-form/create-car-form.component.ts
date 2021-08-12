import { Component, OnInit } from '@angular/core';
import { FormsModule, Form } from '@angular/forms';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrls: ['./create-car-form.component.scss']
})
export class CreateCarFormComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  async onSubmit(data) {
    console.log(data);
    return this.apiService.createCar(data.contract_name, data.contract_contents, data.contract_companyA, data.contract_companyB, data.contract_date, data.contract_period);
  }
}
