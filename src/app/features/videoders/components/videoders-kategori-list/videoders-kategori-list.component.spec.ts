import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVideodersKategoriListComponent } from './videoders-kategori-list.component';

describe('AppVideodersKategoriListComponent', () => {
  let component: AppVideodersKategoriListComponent;
  let fixture: ComponentFixture<AppVideodersKategoriListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppVideodersKategoriListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppVideodersKategoriListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
