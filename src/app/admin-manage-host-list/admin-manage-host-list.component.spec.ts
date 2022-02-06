import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageHostListComponent } from './admin-manage-host-list.component';

describe('AdminManageHostListComponent', () => {
  let component: AdminManageHostListComponent;
  let fixture: ComponentFixture<AdminManageHostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageHostListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageHostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
