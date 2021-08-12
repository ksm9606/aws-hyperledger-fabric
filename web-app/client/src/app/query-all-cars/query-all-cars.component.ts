import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-query-all-cars',
  templateUrl: './query-all-cars.component.html',
  styleUrls: ['./query-all-cars.component.scss']
})
export class QueryAllCarsComponent implements OnInit {


  private cars: any;
  // private cars: Array<object>;
  private loginUser: any;
  response;
  constructor(private apiService: ApiService, private http: HttpClient, private router:Router) { }

  

  ngOnInit() {
    this.apiService.cars$.subscribe((carsArray) => {
      this.cars = carsArray;
    });
    this.apiService.queryAllCars();
    this.apiService.getLoginUser();
  }

  
  sendKey(data) {
    for(var i=0; i<this.cars.length; i++){
      if(data == this.cars[i].Key){
        if(this.cars[i].Record.state == '계약 대기' && (this.cars[i].Record.contract_writer == this.apiService.loginUser$)){
          this.router.navigate(['contractA']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer == this.apiService.loginUser$){
          this.router.navigate(['modifyContract']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer != this.apiService.loginUser$){
          this.router.navigate(['contractB']);
        } else if(this.cars[i].Record.state == '계약 완료'){
          this.router.navigate(['readContract']);
      }
    }
  }
    return this.apiService.querySelectCar(data)
  }
  
  onSubmit(data) {
    for(var i=0; i<this.cars.length; i++){
      if(data.key == this.cars[i].Key){
        if(this.cars[i].Record.state == '계약 대기' && (this.cars[i].Record.contract_writer == this.apiService.loginUser$)){
          this.router.navigate(['contractA']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer == this.apiService.loginUser$){
          this.router.navigate(['modifyContract']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer != this.apiService.loginUser$){
          this.router.navigate(['contractB']);
        } else if(this.cars[i].Record.state == '계약 완료'){
          this.router.navigate(['readContract']);
      }
    }
  }
    return this.apiService.querySelectCar(data.key)
  }
}
