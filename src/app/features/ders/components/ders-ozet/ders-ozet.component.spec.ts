import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersOzetComponent } from './ders-ozet.component';

describe('DersOzetComponent', () => {
  let component: DersOzetComponent;
  let fixture: ComponentFixture<DersOzetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersOzetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersOzetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
