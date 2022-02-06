import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageLocationBlogNewComponent } from './admin-manage-location-blog-new.component';

describe('AdminManageLocationBlogNewComponent', () => {
  let component: AdminManageLocationBlogNewComponent;
  let fixture: ComponentFixture<AdminManageLocationBlogNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageLocationBlogNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageLocationBlogNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
