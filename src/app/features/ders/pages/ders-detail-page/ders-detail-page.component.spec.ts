import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersDetailPageComponent } from './ders-detail-page.component';

describe('DersDetailPageComponent', () => {
  let component: DersDetailPageComponent;
  let fixture: ComponentFixture<DersDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
