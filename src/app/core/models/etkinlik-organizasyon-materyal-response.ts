import { EtkinlikMateryalTuruOzet } from './etkinlik-materyal-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface EtkinlikOrganizasyonMateryalResponse {
  id: number;
  version: number;
  etkinlikOrganizasyonId: number;
  materyalTuru: EtkinlikMateryalTuruOzet | null;
  dosyaAdi: string;
  dosyaYolu: string;
  dosyaBoyutu: number | null;
  mimeType: string | null;
  ekleyenKullanici: KullaniciOzet | null;
  eklemeTarihi: string | null;
}
