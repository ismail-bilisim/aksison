import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersTemelComponent } from './yuzyuzeders-temel.component';

describe('YuzyuzedersTemelComponent', () => {
  let component: YuzyuzedersTemelComponent;
  let fixture: ComponentFixture<YuzyuzedersTemelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersTemelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersTemelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
