import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-contract-company-a',
  templateUrl: './contract-company-a.component.html',
  styleUrls: ['./contract-company-a.scss']
})
export class ContractCompanyAComponent implements OnInit {

  cars: any;
  result;
  constructor(private apiService: ApiService, private router: Router) { }



  ngOnInit() {
   
    this.apiService.selectCars$.subscribe((carsArray: any) => {
      console.log(carsArray);        
            this.cars = carsArray;
    });
  }

  async onSubmit(data){
    console.log(this.cars.key,data.contract_signA, data.contract_receiver, this.cars.state );
    this.router.navigate(['main']);
    return await this.apiService.sendContract(this.cars.key,data.contract_signA, data.contract_receiver, this.cars.state);

  }

}