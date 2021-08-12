import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-read-contract',
  templateUrl: './read-contract.component.html',
  styleUrls: ['./read-contract.scss']
})
export class ReadContractComponent implements OnInit {

  cars: any;
  result;
  constructor(private apiService: ApiService, private router: Router) { }



  ngOnInit() {
   
    this.apiService.selectCars$.subscribe((carsArray: any) => {
      console.log(carsArray);        
            this.cars = carsArray;  
    });
  }

  async onSubmit(){
    // console.log(this.cars.key,data.contract_signB, this.cars.state );
    this.router.navigate(['main']);
    // return await this.apiService.makeContract(this.cars.key,data.contract_signB, this.cars.state);

  }

}
