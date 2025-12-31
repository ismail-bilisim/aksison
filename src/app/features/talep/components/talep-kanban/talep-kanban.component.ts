import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { TalepOzet } from '../../../../core/models/talep-ozet';
import { TalepDurumuOzet } from '../../../../core/models/talep-durumu';
import { TalepService } from '../../../../core/services/api/talep.service';
import { TalepDurumuService } from '../../../../core/services/api/talep-durumu.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TalepRequest } from '../../../../core/models/talep-request';
import { forkJoin, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { getDateRange } from '../../../../core/utils/date-filter.util';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface KanbanColumn {
  durum: TalepDurumuOzet;
  talepler: TalepOzet[];
}

@Component({
  selector: 'app-talep-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule],
  templateUrl: './talep-kanban.component.html',
  styleUrl: './talep-kanban.component.css'
})
export class TalepKanbanComponent implements OnInit {

  columns: KanbanColumn[] = [];
  talepDurumlari: TalepDurumuOzet[] = []; // All possible statuses from backend

  // Filters
  dateRangeFilter = new FormControl('bu ay'); // 'bu ay', '3 ay', '6 ay', 'bu yıl', '1 yıl'

  constructor(
    private talepService: TalepService,
    private talepDurumuService: TalepDurumuService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadKanbanData();
    this.dateRangeFilter.valueChanges.pipe(
      tap(() => this.loadKanbanData()) // Reload data when date range changes
    ).subscribe();
  }

  loadKanbanData(): void {
    const { startDate, endDate } = getDateRange(this.dateRangeFilter.value || 'bu ay');

    forkJoin([
      this.talepDurumuService.getAllOzet(),
      this.talepService.getAllOzet() // Fetch all summary tales to filter by date range later
    ]).pipe(
      tap(([durumlar, talepler]) => {
        this.talepDurumlari = durumlar.sort((a, b) => a.sira - b.sira); // Ensure correct order

        // Filter tales by date range
        const filteredTalepler = talepler.filter(talep => {
          const talepDate = new Date(talep.talepTarihi);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return talepDate >= start && talepDate <= end;
        });

        this.columns = this.talepDurumlari.map(durum => ({
          durum: durum,
          talepler: filteredTalepler.filter(talep => talep.talepDurumu.kodu === durum.kodu)
        }));
      }),
      switchMap(() => of(true)) // Ensure a stream is returned
    ).subscribe({
      error: (err) => {
        this.toastService.error('Kanban verileri yüklenirken hata oluştu.');
        console.error(err);
      }
    });
  }

  cdkDropListDropped(event: CdkDragDrop<TalepOzet[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTalep: TalepOzet = event.item.data;
      const targetDurum: TalepDurumuOzet = (event.container.data as any).durum; // Access durum from KanbanColumn

      if (!this.isValidTransition(movedTalep.talepDurumu.kodu, targetDurum.kodu)) {
        this.toastService.warning('Bu geçişe izin verilmiyor.');
        return;
      }

      // Optimistically update UI
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Call API to update status
      this.talepService.getById(movedTalep.id).pipe(
        switchMap(fullTalep => {
          if (!fullTalep) {
            throw new Error('Talep detayları bulunamadı.');
          }
          const talepRequest: TalepRequest = {
            version: fullTalep.version,
            talepTarihi: fullTalep.talepTarihi,
            talepSahibi: fullTalep.talepSahibi,
            talepKonusuKodu: fullTalep.talepKonusu?.kodu,
            talepIcerik: fullTalep.talepIcerik,
          };
          return this.talepService.update(movedTalep.id, talepRequest);
        })
      ).subscribe({
        next: () => {
          this.toastService.success('Talep durumu güncellendi.');
          // Update the movedTalep's status in the UI to reflect the change
          movedTalep.talepDurumu = targetDurum;
        },
        error: (err) => {
          this.toastService.error('Talep durumu güncellenirken hata oluştu. Lütfen sayfayı yenileyin.');
          console.error(err);
          // Revert UI changes on error
          this.loadKanbanData();
        }
      });
    }
  }

  // Define allowed transitions for workflow
  // acik -> devam -> tamamlandi -> iptal
  // Allows backward transition as well as forward.
  isValidTransition(sourceDurumKodu: string, targetDurumKodu: string): boolean {
    const durumOrder = this.talepDurumlari.map(d => d.kodu);
    const sourceIndex = durumOrder.indexOf(sourceDurumKodu);
    const targetIndex = durumOrder.indexOf(targetDurumKodu);

    // Any transition is allowed for now, but this is where complex rules would go.
    // Example: Only allow 'acik' to 'devam', 'devam' to 'tamamlandi' or 'iptal'
    // if (sourceDurumKodu === 'acik' && targetDurumKodu !== 'devam') return false;
    // if (sourceDurumKodu === 'devam' && !(targetDurumKodu === 'tamamlandi' || targetDurumKodu === 'iptal')) return false;

    // For now, allow any transition
    return true;
  }

  viewTalepDetail(id: number): void {
    this.router.navigate(['/talep', 'detail', id]);
  }
}