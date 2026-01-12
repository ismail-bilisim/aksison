import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgitmenTemelComponent } from './egitmen-temel.component';

describe('EgitmenTemelComponent', () => {
  let component: EgitmenTemelComponent;
  let fixture: ComponentFixture<EgitmenTemelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgitmenTemelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgitmenTemelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
