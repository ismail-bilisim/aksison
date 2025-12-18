import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydasListPageComponent } from './paydas-list-page.component';

describe('PaydasListPageComponent', () => {
  let component: PaydasListPageComponent;
  let fixture: ComponentFixture<PaydasListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaydasListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaydasListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
