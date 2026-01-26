import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalepStatsPageComponent } from './talep-stats-page.component';

describe('TalepStatsPageComponent', () => {
  let component: TalepStatsPageComponent;
  let fixture: ComponentFixture<TalepStatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalepStatsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalepStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
