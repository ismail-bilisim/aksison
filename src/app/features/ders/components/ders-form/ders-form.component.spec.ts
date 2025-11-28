import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersFormComponent } from './ders-form.component';

describe('DersFormComponent', () => {
  let component: DersFormComponent;
  let fixture: ComponentFixture<DersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
