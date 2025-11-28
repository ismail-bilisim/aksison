import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersTemelComponent } from './ders-temel.component';

describe('DersTemelComponent', () => {
  let component: DersTemelComponent;
  let fixture: ComponentFixture<DersTemelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersTemelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersTemelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
