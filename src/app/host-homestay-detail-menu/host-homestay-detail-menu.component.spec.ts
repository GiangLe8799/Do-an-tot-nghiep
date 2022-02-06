import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHomestayDetailMenuComponent } from './host-homestay-detail-menu.component';

describe('HostHomestayDetailMenuComponent', () => {
  let component: HostHomestayDetailMenuComponent;
  let fixture: ComponentFixture<HostHomestayDetailMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostHomestayDetailMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostHomestayDetailMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
