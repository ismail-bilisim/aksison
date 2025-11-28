import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersEditPageComponent } from './ders-edit-page.component';

describe('DersEditPageComponent', () => {
  let component: DersEditPageComponent;
  let fixture: ComponentFixture<DersEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
