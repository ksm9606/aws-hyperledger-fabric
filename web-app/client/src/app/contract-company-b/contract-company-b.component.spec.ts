import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCompanyBComponent } from './contract-company-b.component';

describe('ContractCompanyBComponent', () => {
  let component: ContractCompanyBComponent;
  let fixture: ComponentFixture<ContractCompanyBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCompanyBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCompanyBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
