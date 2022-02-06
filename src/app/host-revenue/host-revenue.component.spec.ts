import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRevenueComponent } from './host-revenue.component';

describe('HostRevenueComponent', () => {
  let component: HostRevenueComponent;
  let fixture: ComponentFixture<HostRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostRevenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
