import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageAccountListComponent } from './admin-manage-account-list.component';

describe('AdminManageAccountListComponent', () => {
  let component: AdminManageAccountListComponent;
  let fixture: ComponentFixture<AdminManageAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageAccountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
