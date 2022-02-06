import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHomestayBookingDetailComponent } from './host-homestay-booking-detail.component';

describe('HostHomestayBookingDetailComponent', () => {
  let component: HostHomestayBookingDetailComponent;
  let fixture: ComponentFixture<HostHomestayBookingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostHomestayBookingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostHomestayBookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
