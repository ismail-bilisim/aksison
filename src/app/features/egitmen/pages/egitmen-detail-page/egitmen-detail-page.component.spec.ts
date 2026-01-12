import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgitmenDetailPageComponent } from './egitmen-detail-page.component';

describe('EgitmenDetailPageComponent', () => {
  let component: EgitmenDetailPageComponent;
  let fixture: ComponentFixture<EgitmenDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgitmenDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgitmenDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
