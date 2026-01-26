import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalepStatsComponent } from './talep-stats.component';

describe('TalepStatsComponent', () => {
  let component: TalepStatsComponent;
  let fixture: ComponentFixture<TalepStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalepStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalepStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
