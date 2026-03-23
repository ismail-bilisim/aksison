import { KullaniciOzet } from './kullanici-ozet';
import { DersOzet } from './ders-ozet';

export interface YuzyuzeDersBasvuruResponse {
  id: number;
  version: number;
  basvuran: KullaniciOzet;
  ders: DersOzet;
  aciklama: string | null;
  basvuruSonuc: string | null;
  mailGonderildi: boolean;
  islemYapanKullanici: KullaniciOzet;
  islemTarihi: string;
}
