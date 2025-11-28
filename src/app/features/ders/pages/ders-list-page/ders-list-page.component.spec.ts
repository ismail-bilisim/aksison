import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersListPageComponent } from './ders-list-page.component';

describe('DersListPageComponent', () => {
  let component: DersListPageComponent;
  let fixture: ComponentFixture<DersListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
