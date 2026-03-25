import { EtkinlikGorevOzet } from './etkinlik-gorev-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface EtkinlikOrganizasyonSurecGorevResponse {
  id: number;
  version: number;
  surecId: number;
  gorev: EtkinlikGorevOzet | null;
  etkinlikGorevlisi: KullaniciOzet | null;
  gorevDurumu: string | null;
  aciklama: string | null;
  ekleyenKullanici: KullaniciOzet | null;
  eklemeTarihi: string | null;
}
