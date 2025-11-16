import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersProjeListComponent } from './videoders-proje-list.component';

describe('VideodersProjeListComponent', () => {
  let component: VideodersProjeListComponent;
  let fixture: ComponentFixture<VideodersProjeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersProjeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersProjeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
