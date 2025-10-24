import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersListPageComponent } from './videoders-list-page.component';

describe('VideodersListPageComponent', () => {
  let component: VideodersListPageComponent;
  let fixture: ComponentFixture<VideodersListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
