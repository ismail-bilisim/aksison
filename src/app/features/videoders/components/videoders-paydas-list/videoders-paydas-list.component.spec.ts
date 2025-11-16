import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersPaydasListComponent } from './videoders-paydas-list.component';

describe('VideodersPaydasListComponent', () => {
  let component: VideodersPaydasListComponent;
  let fixture: ComponentFixture<VideodersPaydasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersPaydasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersPaydasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
