import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciListPageComponent } from './kullanici-list-page.component';

describe('KullaniciListPageComponent', () => {
  let component: KullaniciListPageComponent;
  let fixture: ComponentFixture<KullaniciListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KullaniciListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KullaniciListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
