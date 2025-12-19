import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydasFormComponent } from './paydas-form.component';

describe('PaydasFormComponent', () => {
  let component: PaydasFormComponent;
  let fixture: ComponentFixture<PaydasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaydasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaydasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
