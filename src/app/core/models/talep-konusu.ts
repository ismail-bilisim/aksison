import { KullaniciOzet } from './kullanici-ozet';

export interface TalepKonusuResponse {
  id: number;
  version: number;
  kodu: string;
  adi: string;
  aciklama?: string;
  aktifMi: boolean;
  ekleyenKullanici?: KullaniciOzet;
  eklemeTarihi: string;
}

export interface TalepKonusuOzet {
  id: number;
  kodu: string;
  adi: string;
}
