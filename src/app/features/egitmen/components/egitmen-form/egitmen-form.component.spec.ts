import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgitmenFormComponent } from './egitmen-form.component';

describe('EgitmenFormComponent', () => {
  let component: EgitmenFormComponent;
  let fixture: ComponentFixture<EgitmenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgitmenFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgitmenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
