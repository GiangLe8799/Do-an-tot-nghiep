import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostBookingRequestListComponent } from './host-booking-request-list.component';

describe('HostBookingRequestListComponent', () => {
  let component: HostBookingRequestListComponent;
  let fixture: ComponentFixture<HostBookingRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostBookingRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostBookingRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
