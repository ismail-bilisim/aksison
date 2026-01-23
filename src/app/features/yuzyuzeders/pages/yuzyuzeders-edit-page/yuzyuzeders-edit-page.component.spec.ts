import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersEditPageComponent } from './yuzyuzeders-edit-page.component';

describe('YuzyuzedersEditPageComponent', () => {
  let component: YuzyuzedersEditPageComponent;
  let fixture: ComponentFixture<YuzyuzedersEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
