import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydasEditPageComponent } from './paydas-edit-page.component';

describe('PaydasEditPageComponent', () => {
  let component: PaydasEditPageComponent;
  let fixture: ComponentFixture<PaydasEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaydasEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaydasEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
