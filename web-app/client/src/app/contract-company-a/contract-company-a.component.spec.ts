import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCompanyAComponent } from './contract-company-a.component';

describe('ContractCompanyAComponent', () => {
  let component: ContractCompanyAComponent;
  let fixture: ComponentFixture<ContractCompanyAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCompanyAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCompanyAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
