import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersDetailComponent } from './videoders-detail.component';

describe('VideodersDetailComponent', () => {
  let component: VideodersDetailComponent;
  let fixture: ComponentFixture<VideodersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
