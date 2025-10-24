import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDers } from 'src/app/core/models/videoders';
import { VideodersFormComponent } from "src/app/features/videoders/components/videoders-form/videoders-form.component";

@Component({
  selector: 'app-videoders-edit-page',
  imports: [VideodersFormComponent],
  templateUrl: './videoders-edit-page.component.html',
  styleUrl: './videoders-edit-page.component.css'
})

export class VideodersEditPageComponent implements OnInit {
  videoders?: VideoDers;

  constructor(
    private route: ActivatedRoute,
    private service: VideodersService,
    private router: Router
  ) { }

  ngOnInit() {
    const kodu = this.route.snapshot.paramMap.get('kodu');
    if (kodu) this.service.getByKodu(+kodu).subscribe((res) => (this.videoders = res));
  }

  onSave(v: VideoDers) {
    if (this.videoders?.kodu) {
      this.service.update(this.videoders.kodu, v).subscribe(() => this.router.navigate(['/videoders']));
    } else {
      this.service.create(v).subscribe(() => this.router.navigate(['/videoders']));
    }
  }
}
