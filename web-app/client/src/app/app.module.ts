import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { QueryAllCarsComponent } from './query-all-cars/query-all-cars.component';
import { ApiService } from './api.service';
import { CreateCarFormComponent } from './submit-component/create-car-form/create-car-form.component';
import { SubmitComponent } from './submit-component/submit.component';
import { AppRoutingModule } from './app.router.module';
import { ContractCompanyAComponent } from './contract-company-a/contract-company-a.component';
import { ContractCompanyBComponent } from './contract-company-b/contract-company-b.component';
import { MainComponent } from './main/main.component';
import { ReadContractComponent } from './read-contract/read-contract.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModifyContractComponent } from './modify-contract/modify-contract.component';


@NgModule({
  declarations: [
    AppComponent,
    QueryAllCarsComponent,
    CreateCarFormComponent,
    SubmitComponent,
    ContractCompanyAComponent,
    ContractCompanyBComponent,
    ReadContractComponent,
    MainComponent,
    ModifyContractComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

