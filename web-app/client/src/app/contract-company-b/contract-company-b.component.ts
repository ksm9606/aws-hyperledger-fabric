import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-contract-company-b',
  templateUrl: './contract-company-b.component.html',
  styleUrls: ['./contract-company-b.scss']
})

export class ContractCompanyBComponent implements OnInit {

  cars: any;
  result;
  constructor(private apiService: ApiService, private router: Router) { }



  ngOnInit() {
   
    this.apiService.selectCars$.subscribe((carsArray: any) => {
      this.cars = carsArray;  
    });
  }

  async onSubmit(data){
    console.log("key >>> ", this.cars.key, "\nsignB >>> ", data.contract_signB, "\nstate >>> ", this.cars.state );
    this.router.navigate(['main']);
    return await this.apiService.makeContract(this.cars.key,data.contract_signB, this.cars.state);

  }

}