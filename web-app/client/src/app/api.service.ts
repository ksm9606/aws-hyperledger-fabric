import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';

const httpOptionsJson = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',
    'Accept': 'text/plain'
  }),
};

const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });

const baseURL = `http://localhost:8081`;
const getLoginUserURL = `/getLoginUser` 
const queryAllCarsURL = `/queryAllCars`;
const querySelectCarURL = `/querySelectCar`;
const createCarURL = `/createCar`;
const changeCarOwnerURL = `/changeCarOwner`;
const sendContractURL = `/sendContract`;
const makeContractURL = `/makeContract`;


@Injectable()
export class ApiService {

  public cars$: Subject<Array<object>> = new BehaviorSubject<Array<object>>([]);
  public selectCars :any = new BehaviorSubject<Array<object>>([]);
  selectCars$ = this.selectCars.asObservable();
  public loginUser$ : any;



  constructor(private http: HttpClient) {
  }

  // 접속 유저 정보
  getLoginUser(){
    return this.http.get(baseURL + getLoginUserURL, httpOptionsJson).subscribe((response:any) => {
      this.loginUser$ = response;
      console.log('로그인 아이디 : ' + response);
    });
  }

  // 계약서 작성
  createCar(contract_name: string, contract_contents: string, contract_companyA: string, contract_companyB: string, contract_date: string, contract_period: string) {
    return this.http.post(baseURL + createCarURL, ({
      'contract_name': contract_name,
      'contract_contents': contract_contents,
      'contract_companyA': contract_companyA,
      'contract_companyB': contract_companyB,
      'contract_date': contract_date,
      'contract_period': contract_period
    }), {headers}).toPromise().then((result) => { this.queryAllCars(); });

  }

  changeCarOwner(key: string, contract_name: string, contract_contents: string, contract_companyB: string, contract_receiver: string, contract_date: string, contract_period: string) {
    return this.http.post(baseURL + changeCarOwnerURL, {'key': key, 'new_contract_name': contract_name, 'new_contract_contents': contract_contents, 'new_contract_companyB': contract_companyB, 'new_contract_receiver': contract_receiver, 'new_contract_date': contract_date, 'new_contract_period': contract_period },
    {headers}).toPromise().then((result) => { this.queryAllCars(); });
  }

  // 유저에 따른 목록 표시
  queryAllCars() {
    return this.http.get<Array<any>>(baseURL + queryAllCarsURL, httpOptionsJson).subscribe((response) => {
      this.cars$.next(response);
      console.log(response);
    });
  }

  // 계약서 상세 조회
  querySelectCar(key: string) {
    console.log("key >>> ", key);

    return this.http.post(baseURL + querySelectCarURL, {'key': key},
    {headers}).toPromise().then((result:any) => {
      result.key = key
      this.selectCars.next(result);console.log(this.selectCars);
    });
  }

  // 계약서 전송 (갑 > 을)
  sendContract(key: string, contract_signA: string, contract_receiver: string, changeState: string) {
    return this.http.post(baseURL + sendContractURL, {'key': key, 'contract_signA': contract_signA, 'contract_receiver': contract_receiver, 'changeState': changeState},
    {headers}).toPromise().then((result) => { this.queryAllCars(); });
  }

  // 계약서 최종 서명 (을)
  makeContract(key: string, contract_signB: string, changeState: string) {
    return this.http.post(baseURL + makeContractURL, {'key': key, 'contract_signB': contract_signB, 'changeState': changeState},
    {headers}).toPromise().then((result) => { this.queryAllCars(); });
  }
}
