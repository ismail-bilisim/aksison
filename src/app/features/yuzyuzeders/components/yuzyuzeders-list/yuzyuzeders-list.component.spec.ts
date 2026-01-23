import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuzyuzedersListComponent } from './yuzyuzeders-list.component';

describe('YuzyuzedersListComponent', () => {
  let component: YuzyuzedersListComponent;
  let fixture: ComponentFixture<YuzyuzedersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
