import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriListPageComponent } from './kategori-list-page.component';

describe('KategoriListPageComponent', () => {
  let component: KategoriListPageComponent;
  let fixture: ComponentFixture<KategoriListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KategoriListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KategoriListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
