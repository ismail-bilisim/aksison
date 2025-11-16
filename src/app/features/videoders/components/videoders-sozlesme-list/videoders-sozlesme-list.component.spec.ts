import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodersSozlesmeListComponent } from './videoders-sozlesme-list.component';

describe('VideodersSozlesmeListComponent', () => {
  let component: VideodersSozlesmeListComponent;
  let fixture: ComponentFixture<VideodersSozlesmeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideodersSozlesmeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideodersSozlesmeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
