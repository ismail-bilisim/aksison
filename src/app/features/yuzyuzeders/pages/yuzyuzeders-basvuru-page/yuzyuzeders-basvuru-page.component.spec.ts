import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YuzyuzedersBasvuruPageComponent } from './yuzyuzeders-basvuru-page.component';

describe('YuzyuzedersBasvuruPageComponent', () => {
  let component: YuzyuzedersBasvuruPageComponent;
  let fixture: ComponentFixture<YuzyuzedersBasvuruPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersBasvuruPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersBasvuruPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
