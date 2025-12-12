import { DersNiteligiOzet } from './ders-niteligi-ozet';
import { DersSeviyesiOzet } from './ders-seviyesi-ozet';
import { DersTuruOzet } from './ders-turu-ozet';
import { OdemeKaynakOzet } from './odeme-kaynak-ozet';

// Response - API'den dönen tam veri
export interface DersResponse {
  id: number;
  version: number;
  kodu: number;
  adi: string;
  icerikSurum?: number;
  tahminiDersSuresi?: number;
  amaci?: string;
  turu?: DersTuruOzet;
  seviyesi?: DersSeviyesiOzet;
  niteligi?: DersNiteligiOzet;
  hedefKitleEgitimSeviye?: number;
  ilgiAlaninaGoreHedefKitle?: string;
  kullanilacakProgramlar?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  dersOzeti?: string;
  onayDurumu: string | null;
  odemeKaynak: OdemeKaynakOzet;
  icerikYoneticisiId?: number;
  eklemeTarihi: string;
  guncellemeTarihi: string;
}
