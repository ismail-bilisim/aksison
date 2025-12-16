import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { VideoDersKonuService } from '../../../../core/services/videoders-konu.service';
import { VideoDersKonu, VideoBolumGroup } from '../../../../core/models/videoders-konu';

@Component({
  selector: 'app-videoders-konu-list',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './videoders-konu-list.component.html',
  styleUrl: './videoders-konu-list.component.css'
})
export class VideodersKonuListComponent implements OnInit {
  @Input() dersId!: number;

  private videoDersKonuService = inject(VideoDersKonuService);

  bolumGroups: VideoBolumGroup[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    if (this.dersId) {
      this.loadKonular();
    }
  }

  loadKonular(): void {
    this.isLoading = true;
    this.error = null;

    this.videoDersKonuService.getAllByDersIdOrdered(this.dersId).subscribe({
      next: (konular) => {
        this.bolumGroups = this.groupByBolum(konular);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Konular yüklenirken hata oluştu';
        this.isLoading = false;
        console.error('Error loading konular:', err);
      }
    });
  }

  /**
   * Group topics by bolumNumara and sort
   */
  private groupByBolum(konular: VideoDersKonu[]): VideoBolumGroup[] {
    const groupMap = new Map<number, VideoBolumGroup>();

    konular.forEach(konu => {
      if (!groupMap.has(konu.bolumNumara)) {
        groupMap.set(konu.bolumNumara, {
          bolumNumara: konu.bolumNumara,
          bolumAdi: konu.bolumAdi,
          konular: []
        });
      }
      groupMap.get(konu.bolumNumara)!.konular.push(konu);
    });

    // Convert to array and sort by bolumNumara
    return Array.from(groupMap.values()).sort((a, b) => a.bolumNumara - b.bolumNumara);
  }

  /**
   * Handle drag and drop reordering
   */
  onDrop(event: CdkDragDrop<VideoDersKonu[]>, bolumGroup: VideoBolumGroup): void {
    if (event.previousIndex === event.currentIndex) {
      return; // No change
    }

    const movedKonu = bolumGroup.konular[event.previousIndex];
    const previousKonu = event.currentIndex > 0 ? bolumGroup.konular[event.currentIndex - 1] : null;
    const nextKonu = event.currentIndex < bolumGroup.konular.length - 1 
      ? bolumGroup.konular[event.currentIndex + 1] 
      : null;

    // Calculate new position
    const afterPosition = event.currentIndex === 0 ? undefined : previousKonu?.konuSiraNo;
    const beforePosition = nextKonu?.konuSiraNo;

    this.videoDersKonuService.calculateInsertPosition(
      this.dersId,
      bolumGroup.bolumNumara,
      afterPosition,
      beforePosition
    ).subscribe({
      next: (newPosition) => {
        // Move item in UI optimistically
        moveItemInArray(bolumGroup.konular, event.previousIndex, event.currentIndex);
        
        // Update position on server
        this.videoDersKonuService.moveKonu(movedKonu.id, newPosition).subscribe({
          next: () => {
            // Update local position
            movedKonu.konuSiraNo = newPosition;
          },
          error: (err) => {
            console.error('Error moving konu:', err);
            // Revert UI change on error
            moveItemInArray(bolumGroup.konular, event.currentIndex, event.previousIndex);
            this.error = 'Konu taşınırken hata oluştu';
          }
        });
      },
      error: (err) => {
        console.error('Error calculating position:', err);
        this.error = 'Pozisyon hesaplanırken hata oluştu';
      }
    });
  }

  /**
   * Trigger manual rebalancing for a section
   */
  rebalanceBolum(bolumGroup: VideoBolumGroup): void {
    this.videoDersKonuService.rebalanceKonular(this.dersId, bolumGroup.bolumNumara).subscribe({
      next: () => {
        // Reload to get updated positions
        this.loadKonular();
      },
      error: (err) => {
        console.error('Error rebalancing:', err);
        this.error = 'Yeniden dengeleme sırasında hata oluştu';
      }
    });
  }
}
