import { EtkinlikTuruOzet } from './etkinlik-turu-ozet';
import { EtkinlikTemaOzet } from './etkinlik-tema-ozet';
import { EtkinlikDurumuOzet } from './etkinlik-durumu-ozet';
import { KullaniciOzet } from './kullanici-ozet';
import { SehirOzet } from './sehir-ozet';

export interface EtkinlikOrganizasyonResponse {
  id: number;
  version: number;
  adi: string;
  amaci: string | null;
  aciklama: string | null;
  turu: EtkinlikTuruOzet | null;
  tema: EtkinlikTemaOzet | null;
  hedefKitle: string | null;
  kazanimlar: string | null;
  sikcaSorulanSorular: string | null;
  davetliler: string | null;
  sartlarKurallar: string | null;
  suresi: number | null;
  baslamaTarihi: string | null;
  bitisTarihi: string | null;
  yeri: string | null;
  basvuruTarihi: string | null;
  basvuruBitisTarihi: string | null;
  sehir: SehirOzet | null;
  kontenjan: number | null;
  basvuruSayisi: number | null;
  katilimSayisi: number | null;
  durumu: EtkinlikDurumuOzet | null;
  etkinlikYoneticisi: KullaniciOzet | null;
  grafikDuzenleyici: KullaniciOzet | null;
  medyaSorumlu: KullaniciOzet | null;
  eklemeTarihi: string | null;
  ekleyenKullanici: KullaniciOzet | null;
  guncellemeTarihi: string | null;
  guncelleyenKullanici: KullaniciOzet | null;
}
