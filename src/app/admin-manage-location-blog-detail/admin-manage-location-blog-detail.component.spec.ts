import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageLocationBlogDetailComponent } from './admin-manage-location-blog-detail.component';

describe('AdminManageLocationBlogDetailComponent', () => {
  let component: AdminManageLocationBlogDetailComponent;
  let fixture: ComponentFixture<AdminManageLocationBlogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageLocationBlogDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageLocationBlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
