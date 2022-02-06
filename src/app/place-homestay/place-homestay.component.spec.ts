import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceHomestayComponent } from './place-homestay.component';

describe('PlaceHomestayComponent', () => {
  let component: PlaceHomestayComponent;
  let fixture: ComponentFixture<PlaceHomestayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceHomestayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceHomestayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
