import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHomestayFeedbackComponent } from './host-homestay-feedback.component';

describe('HostHomestayFeedbackComponent', () => {
  let component: HostHomestayFeedbackComponent;
  let fixture: ComponentFixture<HostHomestayFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostHomestayFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostHomestayFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
