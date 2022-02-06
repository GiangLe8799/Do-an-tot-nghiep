import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageLocationBlogListComponent } from './admin-manage-location-blog-list.component';

describe('AdminManageLocationBlogListComponent', () => {
  let component: AdminManageLocationBlogListComponent;
  let fixture: ComponentFixture<AdminManageLocationBlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageLocationBlogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageLocationBlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
