import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostHomestayNewComponent } from './host-homestay-new.component';

describe('HostHomestayNewComponent', () => {
  let component: HostHomestayNewComponent;
  let fixture: ComponentFixture<HostHomestayNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostHomestayNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostHomestayNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
