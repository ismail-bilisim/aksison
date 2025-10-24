import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciEditPageComponent } from './kullanici-edit-page.component';

describe('KullaniciEditPageComponent', () => {
  let component: KullaniciEditPageComponent;
  let fixture: ComponentFixture<KullaniciEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KullaniciEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KullaniciEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
