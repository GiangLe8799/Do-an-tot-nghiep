import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageSettingComponent } from './admin-manage-setting.component';

describe('AdminManageSettingComponent', () => {
  let component: AdminManageSettingComponent;
  let fixture: ComponentFixture<AdminManageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
