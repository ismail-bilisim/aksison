import { IslemTuruOzet } from './islem-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface EtkinlikOrganizasyonIslemKayitResponse {
  id: number;
  version: number;
  islemTuru: IslemTuruOzet | null;
  etkinlikOrganizasyonId: number;
  aciklama: string | null;
  islemYapanKullanici: KullaniciOzet | null;
  islemTarihi: string | null;
}
