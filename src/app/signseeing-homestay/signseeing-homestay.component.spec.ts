import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignseeingHomestayComponent } from './signseeing-homestay.component';

describe('SignseeingHomestayComponent', () => {
  let component: SignseeingHomestayComponent;
  let fixture: ComponentFixture<SignseeingHomestayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignseeingHomestayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignseeingHomestayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
