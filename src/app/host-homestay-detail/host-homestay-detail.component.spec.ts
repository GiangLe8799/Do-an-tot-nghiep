import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHomestayDetailComponent } from './host-homestay-detail.component';

describe('HostHomestayDetailComponent', () => {
  let component: HostHomestayDetailComponent;
  let fixture: ComponentFixture<HostHomestayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostHomestayDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostHomestayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
