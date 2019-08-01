import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInventoryComponent } from './sales-inventory.component';

describe('SalesInventoryComponent', () => {
  let component: SalesInventoryComponent;
  let fixture: ComponentFixture<SalesInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
