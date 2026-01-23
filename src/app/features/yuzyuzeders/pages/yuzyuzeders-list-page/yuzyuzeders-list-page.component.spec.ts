import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersListPageComponent } from './yuzyuzeders-list-page.component';

describe('YuzyuzedersListPageComponent', () => {
  let component: YuzyuzedersListPageComponent;
  let fixture: ComponentFixture<YuzyuzedersListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
