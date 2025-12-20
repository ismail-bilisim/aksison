import { KullaniciOzet } from './kullanici-ozet';

export interface ProjeResponse {
  id: number;
  version: number;
  projeAdi: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  aciklama: string;
  onayDurumu: string;
  ekleyenKullanici: KullaniciOzet;
  eklemeTarihi: string;
}
