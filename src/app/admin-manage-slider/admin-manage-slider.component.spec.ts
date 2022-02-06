import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageSliderComponent } from './admin-manage-slider.component';

describe('AdminManageSliderComponent', () => {
  let component: AdminManageSliderComponent;
  let fixture: ComponentFixture<AdminManageSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
