import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { OdemeKaynak } from 'src/app/core/models/odemekaynak';
import { OdemeKaynakService } from 'src/app/core/services/api/odemekaynak.service';

export interface UcretBilgisiDialogData {
  entityName?: string;
  odemeKaynakKodu?: string;
  birimUcret?: number | null;
  toplamUcret?: number | null;
}

export interface UcretBilgisiDialogResult {
  odemeKaynakKodu: string;
  birimUcret: number;
  toplamUcret: number;
  not?: string;
}

@Component({
  selector: 'app-ucret-bilgisi-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule],
  templateUrl: './ucret-bilgisi-dialog.component.html',
  styleUrls: ['./ucret-bilgisi-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UcretBilgisiDialogComponent implements OnInit {
  odemeKaynakKodu = '';
  birimUcret: number | null = null;
  toplamUcret: number | null = null;
  not = '';
  odemeKaynaklar: OdemeKaynak[] = [];
  loading = true;

  constructor(
    @Inject(DIALOG_DATA) public data: UcretBilgisiDialogData,
    private readonly dialogRef: DialogRef<UcretBilgisiDialogResult | null>,
    private readonly odemeKaynakService: OdemeKaynakService
  ) {
    // Pre-populate with existing values
    if (data.odemeKaynakKodu) {
      this.odemeKaynakKodu = data.odemeKaynakKodu;
    }
    if (data.birimUcret != null) {
      this.birimUcret = data.birimUcret;
    }
    if (data.toplamUcret != null) {
      this.toplamUcret = data.toplamUcret;
    }
  }

  ngOnInit(): void {
    this.odemeKaynakService.getAll().subscribe({
      next: (list) => {
        this.odemeKaynaklar = list;
        this.loading = false;
      },
      error: () => {
        this.odemeKaynaklar = [];
        this.loading = false;
      }
    });
  }

  get formValid(): boolean {
    return !!this.odemeKaynakKodu && this.birimUcret != null && this.birimUcret >= 0
      && this.toplamUcret != null && this.toplamUcret >= 0;
  }

  confirm(): void {
    if (!this.formValid) return;
    this.dialogRef.close({
      odemeKaynakKodu: this.odemeKaynakKodu,
      birimUcret: this.birimUcret!,
      toplamUcret: this.toplamUcret!,
      not: this.not?.trim() || undefined
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
