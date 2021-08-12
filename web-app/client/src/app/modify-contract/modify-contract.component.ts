import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modify-contract',
  templateUrl: './modify-contract.component.html',
  styleUrls: ['./modify-contract.scss']
})
export class ModifyContractComponent implements OnInit {

  cars: any;
  result;
  constructor(private apiService: ApiService, private router: Router) { }



  ngOnInit() {
   
    this.apiService.selectCars$.subscribe((carsArray: any) => {
      console.log(carsArray);        
            this.cars = carsArray;
    });
  }

  async onSubmit(data) {
    console.log(data);
    return await this.apiService.changeCarOwner(this.cars.key, data.contract_name, data.contract_contents, data.contract_companyB, data.contract_receiver, data.contract_date, data.contract_period);
  }

}