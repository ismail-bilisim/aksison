import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersFormComponent } from './yuzyuzeders-form.component';

describe('YuzyuzedersFormComponent', () => {
  let component: YuzyuzedersFormComponent;
  let fixture: ComponentFixture<YuzyuzedersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
