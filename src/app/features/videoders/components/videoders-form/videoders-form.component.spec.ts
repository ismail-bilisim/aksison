import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersFormComponent } from './videoders-form.component';

describe('VideodersFormComponent', () => {
  let component: VideodersFormComponent;
  let fixture: ComponentFixture<VideodersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
