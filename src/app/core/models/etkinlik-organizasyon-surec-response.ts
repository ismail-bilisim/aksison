import { EtkinlikSurecTuruOzet } from './etkinlik-surec-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface EtkinlikOrganizasyonSurecResponse {
  id: number;
  version: number;
  etkinlikOrganizasyonId: number;
  turu: EtkinlikSurecTuruOzet | null;
  aciklama: string | null;
  ekleyenKullanici: KullaniciOzet | null;
  eklemeTarihi: string | null;
}
