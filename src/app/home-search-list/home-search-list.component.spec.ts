import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSearchListComponent } from './home-search-list.component';

describe('HomeSearchListComponent', () => {
  let component: HomeSearchListComponent;
  let fixture: ComponentFixture<HomeSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
