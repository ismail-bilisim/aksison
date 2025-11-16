import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersOnkosulListComponent } from './videoders-onkosul-list.component';

describe('VideodersOnkosulListComponent', () => {
  let component: VideodersOnkosulListComponent;
  let fixture: ComponentFixture<VideodersOnkosulListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersOnkosulListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersOnkosulListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
