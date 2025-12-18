import { KullaniciOzet } from './kullanici-ozet';

export interface PaydasResponse {
  id: number;
  version?: number;
  adi: string;
  temsilci: string;
  telefon?: string;
  eposta?: string;
  adres?: string;
  ekleyenKullanici?: KullaniciOzet;
  eklemeTarihi?: string;
}
