import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutsDetailComponent } from './checkouts-detail.component';

describe('CheckoutsDetailComponent', () => {
  let component: CheckoutsDetailComponent;
  let fixture: ComponentFixture<CheckoutsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
