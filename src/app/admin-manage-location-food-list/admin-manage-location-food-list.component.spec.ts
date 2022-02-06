import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageLocationFoodListComponent } from './admin-manage-location-food-list.component';

describe('AdminManageLocationFoodListComponent', () => {
  let component: AdminManageLocationFoodListComponent;
  let fixture: ComponentFixture<AdminManageLocationFoodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageLocationFoodListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageLocationFoodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
