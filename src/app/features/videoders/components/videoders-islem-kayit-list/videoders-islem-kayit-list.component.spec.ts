import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersIslemKayitListComponent } from './videoders-islem-kayit-list.component';

describe('VideodersIslemKayitListComponent', () => {
  let component: VideodersIslemKayitListComponent;
  let fixture: ComponentFixture<VideodersIslemKayitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersIslemKayitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersIslemKayitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
