import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHomestayListComponent } from './host-homestay-list.component';

describe('HostHomestayListComponent', () => {
  let component: HostHomestayListComponent;
  let fixture: ComponentFixture<HostHomestayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostHomestayListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostHomestayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
