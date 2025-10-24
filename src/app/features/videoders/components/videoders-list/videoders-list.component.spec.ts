import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersListComponent } from './videoders-list.component';

describe('VideodersListComponent', () => {
  let component: VideodersListComponent;
  let fixture: ComponentFixture<VideodersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
