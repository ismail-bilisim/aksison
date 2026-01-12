import { KullaniciOzet } from './kullanici-ozet';

export interface EgitmenResponse {
  id: number;
  version: number;
  kod?: number | null;
  kullanici?: KullaniciOzet | null;
  okulUniversiteAdi?: string | null;
  bolum?: string | null;
  akademikDereceler?: string | null;
  unvan?: string | null;
  uzmanlikAlani?: string | null;
  calisilanKurum?: string | null;
  cevrimIciTecrubesi?: number | null;
  sosyalMedyaHesabi?: string | null;
  webSitesi?: string | null;
  egitmenProfili?: string | null;
  kisaOzgecmis?: string | null;
  performansPuani?: number | null;
  sosyalMedyaTarama?: boolean | null;
  onayDurumu?: string | null;
  aktifMi?: boolean | null;
  ekleyenKullanici?: KullaniciOzet | null;
  eklemeTarihi?: string | null;
}
