import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YuzyuzedersBasvuruComponent } from './yuzyuzeders-basvuru.component';

describe('YuzyuzedersBasvuruComponent', () => {
  let component: YuzyuzedersBasvuruComponent;
  let fixture: ComponentFixture<YuzyuzedersBasvuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuzyuzedersBasvuruComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(YuzyuzedersBasvuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
