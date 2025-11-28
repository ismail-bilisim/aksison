import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DersService } from 'src/app/core/services/api/ders.service';
import { Ders } from 'src/app/core/models/ders';
import { DersFormComponent } from "src/app/features/ders/components/ders-form/ders-form.component";

@Component({
  selector: 'app-ders-edit-page',
  standalone: true,
  imports: [DersFormComponent],
  templateUrl: './ders-edit-page.component.html',
  styleUrl: './ders-edit-page.component.css'
})
export class DersEditPageComponent implements OnInit {
  ders?: Ders;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private service: DersService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.service.getById(+id).subscribe((res) => (this.ders = res));
    }
  }

  onSave(ders: Ders) {
    if (this.ders?.id) {
      this.service.update(this.ders.id, ders).subscribe(() => 
        this.router.navigate(['/ders'])
      );
    } else {
      this.service.create(ders).subscribe(() => 
        this.router.navigate(['/ders'])
      );
    }
  }

  onCancel() {
    this.router.navigate(['/ders']);
  }
}
