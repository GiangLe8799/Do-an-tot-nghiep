import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageLocationListComponent } from './admin-manage-location-list.component';

describe('AdminManageLocationListComponent', () => {
  let component: AdminManageLocationListComponent;
  let fixture: ComponentFixture<AdminManageLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageLocationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
