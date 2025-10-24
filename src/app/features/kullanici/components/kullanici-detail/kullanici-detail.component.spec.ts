import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciDetailComponent } from './kullanici-detail.component';

describe('KullaniciDetailComponent', () => {
  let component: KullaniciDetailComponent;
  let fixture: ComponentFixture<KullaniciDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KullaniciDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KullaniciDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
