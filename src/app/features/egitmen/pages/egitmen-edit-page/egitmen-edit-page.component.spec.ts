import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgitmenEditPageComponent } from './egitmen-edit-page.component';

describe('EgitmenEditPageComponent', () => {
  let component: EgitmenEditPageComponent;
  let fixture: ComponentFixture<EgitmenEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgitmenEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgitmenEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
