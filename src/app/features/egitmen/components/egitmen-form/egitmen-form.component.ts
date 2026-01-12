import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EgitmenRequest } from '../../../../core/models/egitmen-request';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { KullaniciOzet } from 'src/app/core/models/kullanici-ozet';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-egitmen-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './egitmen-form.component.html',
  styleUrl: './egitmen-form.component.css'
})
export class EgitmenFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() egitmenRequest?: EgitmenRequest | null;
  @Input() isLoading = false;
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<EgitmenRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private kullaniciService = inject(KullaniciService);
  private destroy$ = new Subject<void>();

  egitmenForm: FormGroup;
  
  // Kullanıcı seçimi için state
  searchControl = new FormControl('');
  searchResults: KullaniciOzet[] = [];
  selectedKullanici: KullaniciOzet | null = null;
  isSearchMode = false;
  showDropdown = false;
  isLoadingSearch = false;

  constructor() {
    this.egitmenForm = this.fb.group({
      version: [null],
      kullaniciId: [null, Validators.required],
      okulUniversiteAdi: ['', Validators.required],
      bolum: ['', Validators.required],
      akademikDereceler: [''],
      unvan: ['', Validators.required],
      uzmanlikAlani: ['', Validators.required],
      calisilanKurum: [''],
      cevrimIciTecrubesi: [0, [Validators.required, Validators.min(0)]],
      sosyalMedyaHesabi: [''],
      webSitesi: [''],
      egitmenProfili: [''],
      kisaOzgecmis: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.setupSearch();
  }

  ngOnChanges() {
    if (this.egitmenRequest) {
      this.egitmenForm.patchValue(this.egitmenRequest);
      
      // Edit modda ise, kullanıcı bilgisini yükle
      if (this.isEditMode && this.egitmenRequest.kullaniciId) {
        this.loadSelectedKullanici(this.egitmenRequest.kullaniciId);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Arama işlevini yapılandırır (debounce 500ms, distinctUntilChanged, switchMap)
   */
  setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        if (!searchTerm || searchTerm.trim().length === 0) {
          this.searchResults = [];
          this.showDropdown = false;
          return [];
        }
        
        this.isLoadingSearch = true;
        this.showDropdown = true;
        return this.kullaniciService.searchKullanicilar(searchTerm);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoadingSearch = false;
      },
      error: (err) => {
        console.error('Kullanıcı arama hatası:', err);
        this.toastService.error('Kullanıcı araması sırasında hata oluştu.');
        this.isLoadingSearch = false;
        this.searchResults = [];
      }
    });
  }

  /**
   * Edit modda mevcut kullanıcıyı yükler (getOzetById kullanarak)
   */
  loadSelectedKullanici(kullaniciId: number) {
    this.kullaniciService.getOzetById(kullaniciId).subscribe({
      next: (kullanici) => {
        this.selectedKullanici = kullanici;
        this.isSearchMode = false;
      },
      error: (err) => {
        console.error('Kullanıcı yüklenemedi:', err);
        this.toastService.error('Kullanıcı bilgisi yüklenirken hata oluştu.');
      }
    });
  }

  /**
   * Dropdown'dan bir kullanıcı seçildiğinde (mousedown event kullanıyor - blur öncesi)
   */
  selectKullanici(kullanici: KullaniciOzet) {
    this.selectedKullanici = kullanici;
    this.egitmenForm.patchValue({ kullaniciId: kullanici.id });
    this.searchControl.setValue('');
    this.searchResults = [];
    this.showDropdown = false;
    this.isSearchMode = false;
  }

  /**
   * "Değiştir" butonuna basıldığında arama modunu aktif eder
   */
  enableSearchMode() {
    this.isSearchMode = true;
    this.searchControl.setValue('');
    this.searchResults = [];
    this.showDropdown = false;
    
    // Input'a focus için timeout
    setTimeout(() => {
      const input = document.getElementById('kullaniciSearch') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  /**
   * Seçimi temizler (clear button)
   */
  clearSelection() {
    this.selectedKullanici = null;
    this.egitmenForm.patchValue({ kullaniciId: null });
    this.isSearchMode = true;
    this.searchControl.setValue('');
    this.searchResults = [];
    this.showDropdown = false;
  }

  /**
   * Dropdown dışına tıklanınca kapat (blur event için timeout)
   */
  closeDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onSubmit() {
    if (this.egitmenForm.invalid) {
      this.egitmenForm.markAllAsTouched();
      this.toastService.error('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    this.save.emit(this.egitmenForm.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}
