import { MedyaTuruOzet } from './medya-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface EtkinlikOrganizasyonMateryalResponse {
  id: number;
  version: number;
  etkinlikOrganizasyonId: number;
  medyaTuru: MedyaTuruOzet | null;
  dosyaAdi: string;
  dosyaYolu: string;
  dosyaBoyutu: number | null;
  mimeType: string | null;
  ekleyenKullanici: KullaniciOzet | null;
  eklemeTarihi: string | null;
}
