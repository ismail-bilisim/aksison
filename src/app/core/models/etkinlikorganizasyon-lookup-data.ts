import { EtkinlikTuruOzet } from './etkinlik-turu-ozet';
import { EtkinlikTemaOzet } from './etkinlik-tema-ozet';
import { EtkinlikSurecTuruOzet } from './etkinlik-surec-turu-ozet';
import { EtkinlikGorevOzet } from './etkinlik-gorev-ozet';
import { SehirOzet } from './sehir-ozet';

export interface EtkinlikOrganizasyonLookupData {
  turler: EtkinlikTuruOzet[];
  temalar: EtkinlikTemaOzet[];
  surecTurleri: EtkinlikSurecTuruOzet[];
  gorevler: EtkinlikGorevOzet[];
  sehirler: SehirOzet[];
}
