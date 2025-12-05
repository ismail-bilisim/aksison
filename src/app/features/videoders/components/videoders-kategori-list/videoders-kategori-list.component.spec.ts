import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersKategoriListComponent } from './videoders-kategori-list.component';

describe('VideodersKategoriListComponent', () => {
  let component: VideodersKategoriListComponent;
  let fixture: ComponentFixture<VideodersKategoriListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersKategoriListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersKategoriListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
