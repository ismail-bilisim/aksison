import { KullaniciOzet } from './kullanici-ozet';

export interface TalepEkDosyaResponse {
  id: number;
  version: number;
  talepId: number;
  dosyaAdi: string;
  dosyaYolu: string;
  dosyaBoyutu: number;
  mimeType: string;
  ekleyenKullanici?: KullaniciOzet;
  eklemeTarihi: string;
}

export interface TalepEkDosyaOzet {
  id: number;
  dosyaAdi: string;
  dosyaBoyutu: number;
  mimeType: string;
}
