import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersListOnayPageComponent } from './yuzyuzeders-list-onay-page.component';

describe('YuzyuzedersListOnayPageComponent', () => {
  let component: YuzyuzedersListOnayPageComponent;
  let fixture: ComponentFixture<YuzyuzedersListOnayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersListOnayPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersListOnayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
