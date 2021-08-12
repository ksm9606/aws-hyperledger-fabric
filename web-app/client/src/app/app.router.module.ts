import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractCompanyAComponent } from './contract-company-a/contract-company-a.component';
import { ContractCompanyBComponent } from './contract-company-b/contract-company-b.component';
import { MainComponent } from './main/main.component';
import { ModifyContractComponent } from './modify-contract/modify-contract.component';
import { ReadContractComponent } from './read-contract/read-contract.component';



const routes: Routes = [

  // 첫 화면을 login 페이지로 설정
  { path: '', 
    redirectTo: '/main', 
    pathMatch: 'full' 
  },
  { 
    path: 'main', 
    component: MainComponent,
  },
  {
    path: 'contractA', 
    component: ContractCompanyAComponent,
  },
  {
    path: 'contractB', 
    component: ContractCompanyBComponent,
  },
  {
    path: 'readContract', 
    component: ReadContractComponent,
  },
  {
    path: 'modifyContract', 
    component: ModifyContractComponent,
  },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
