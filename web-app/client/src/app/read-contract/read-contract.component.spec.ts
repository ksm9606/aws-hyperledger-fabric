import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadContractComponent } from './read-contract.component';

describe('ReadContractComponent', () => {
  let component: ReadContractComponent;
  let fixture: ComponentFixture<ReadContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
