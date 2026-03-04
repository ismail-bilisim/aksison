import { DersOzet } from './ders-ozet';
import { DersTuruOzet } from './ders-turu-ozet';
import { DersSeviyesiOzet } from './ders-seviyesi-ozet';
import { DersNiteligiOzet } from './ders-niteligi-ozet';
import { DersDurumuOzet } from './ders-durumu-ozet';
import { DersCekimYontemiOzet } from './ders-cekim-yontemi-ozet';
import { HedefKitleEgitimSeviyesiOzet } from './hedef-kitle-egitim-seviyesi-ozet';
import { OdemeKaynakOzet } from './odemekaynak-ozet';

export interface VideoDersResponse {
  id: number;
  version: number;
  kodu: number;
  ders: DersOzet;
  adi: string;
  tahminiDersSuresi: number;
  tahminiDersTeslimTarihi: string;
  baslamaTarihi: string | null;
  dersTeslimTarihi: string | null;
  amaci: string | null;
  turu: DersTuruOzet | null;
  seviyesi: DersSeviyesiOzet | null;
  niteligi: DersNiteligiOzet | null;
  hedefKitleEgitimSeviye: HedefKitleEgitimSeviyesiOzet | null;
  ilgiAlaninaGoreHedefKitle: string | null;
  kullanilacakProgramlar: string | null;
  kazanimlar: string | null;
  sikcaSorulanSorular: string | null;
  dersOzeti: string | null;
  dersCekimYontemi: DersCekimYontemiOzet | null;
  portalAdresi: string | null;
  odemeKaynak: OdemeKaynakOzet | null;
  birimUcret: number | null;
  toplamUcret: number | null;
  dersDurumu: DersDurumuOzet | null;
  eklemeTarihi: string | null;
  guncellemeTarihi: string | null;
}