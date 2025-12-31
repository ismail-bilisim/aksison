import { KullaniciOzet } from './kullanici-ozet';

export interface TalepDurumuResponse {
  id: number;
  version: number;
  kodu: string;
  adi: string;
  sira: number;
  aktifMi: boolean;
  ekleyenKullanici?: KullaniciOzet;
  eklemeTarihi: string;
}

export interface TalepDurumuOzet {
  id: number;
  kodu: string;
  adi: string;
  sira: number;
}
