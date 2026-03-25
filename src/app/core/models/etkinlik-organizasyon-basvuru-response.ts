import { KullaniciOzet } from './kullanici-ozet';

export interface EtkinlikOrganizasyonBasvuruResponse {
  id: number;
  version: number;
  basvuran: KullaniciOzet | null;
  etkinlikOrganizasyonId: number;
  aciklama: string | null;
  basvuruSonuc: string | null;
  mailGonderildi: boolean | null;
  islemYapanKullanici: KullaniciOzet | null;
  islemTarihi: string | null;
}
