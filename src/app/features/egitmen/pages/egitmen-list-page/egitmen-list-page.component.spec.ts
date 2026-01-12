import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgitmenListPageComponent } from './egitmen-list-page.component';

describe('EgitmenListPageComponent', () => {
  let component: EgitmenListPageComponent;
  let fixture: ComponentFixture<EgitmenListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgitmenListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgitmenListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
