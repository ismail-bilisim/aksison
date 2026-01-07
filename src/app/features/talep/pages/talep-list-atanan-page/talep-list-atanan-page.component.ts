import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, of } from 'rxjs';
import { TalepOzet } from 'src/app/core/models/talep-ozet';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-talep-list-atanan-page',
  imports: [CommonModule, TalepListComponent],
  templateUrl: './talep-list-atanan-page.component.html',
  styleUrl: './talep-list-atanan-page.component.css'
})
export class TalepListAtananPageComponent implements OnInit {

  // Dependency Injection via inject(). Angular 19 ile uyumlu

  private talepService = inject(TalepService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  //Satet managment
  talepler$: Observable<TalepOzet[]> = of ( [] ); //talepleri başlatmak gerekir. of([]) = Boş bir listeyi Observable olarak yayınla.
  isLoading = signal(false);

  constructor() {

    // Constructor: Sadece dependency setup içindir 
    // API çağrısı yapılmamalı


  }

  ngOnInit() {
    
    this.isLoading.set(true);

    this.talepler$ = this.talepService.getAllTalepBanaAtanan()
      .pipe(
        catchError( err=> {
          this.toastService.error("Bana atanan talepler yüklenemedi. "+err);
          console.error("Bana atanan talepler yüklenemedi. ", err)
          return of([] as TalepOzet[] )
        }

        ),
        finalize(() => this.isLoading.set(false))

      );

    this.isLoading.set(false);

  }

  //Listeden seçilen talebin detayını göster.
  viewDetail (id:number):void {
    this.router.navigate(['/talep/detail/',id]);
  }

}
