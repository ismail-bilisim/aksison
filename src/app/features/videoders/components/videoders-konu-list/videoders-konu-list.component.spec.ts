import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersKonuListComponent } from './videoders-konu-list.component';

describe('VideodersKonuListComponent', () => {
  let component: VideodersKonuListComponent;
  let fixture: ComponentFixture<VideodersKonuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersKonuListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersKonuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
