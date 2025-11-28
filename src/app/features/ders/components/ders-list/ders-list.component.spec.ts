import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DersListComponent } from './ders-list.component';

describe('DersListComponent', () => {
  let component: DersListComponent;
  let fixture: ComponentFixture<DersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
