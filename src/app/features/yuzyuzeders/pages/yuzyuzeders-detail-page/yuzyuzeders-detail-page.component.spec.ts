import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersDetailPageComponent } from './yuzyuzeders-detail-page.component';

describe('YuzyuzedersDetailPageComponent', () => {
  let component: YuzyuzedersDetailPageComponent;
  let fixture: ComponentFixture<YuzyuzedersDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
