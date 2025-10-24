import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersEditPageComponent } from './videoders-edit-page.component';

describe('VideodersEditPageComponent', () => {
  let component: VideodersEditPageComponent;
  let fixture: ComponentFixture<VideodersEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
