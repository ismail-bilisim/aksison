import { DersOzet } from './ders-ozet';
import { DersTuruOzet } from './ders-turu-ozet';
import { DersSeviyesiOzet } from './ders-seviyesi-ozet';
import { DersNiteligiOzet } from './ders-niteligi-ozet';
import { HedefKitleEgitimSeviyesiOzet } from './hedef-kitle-egitim-seviyesi-ozet';
import { DersDurumuOzet } from './ders-durumu-ozet';
import { SehirOzet } from './sehir-ozet';
import { KullaniciOzet } from './kullanici-ozet';
import { OdemeKaynakOzet } from './odemekaynak-ozet';

export interface YuzyuzeDersResponse {
  id: number;
  version: number;
  kodu: number;
  ders: DersOzet | null;
  adi: string;
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
  dersSuresi: number | null;
  baslamaTarihi: string | null; // LocalDateTime -> ISO 8601 string
  bitisTarihi: string | null; // LocalDateTime -> ISO 8601 string
  egitimYeri: string | null;
  sehir: SehirOzet | null;
  kontenjan: number | null;
  tamamlayanSayisi: number | null;
  basvuruSayisi: number | null;
  odemeKaynak: OdemeKaynakOzet | null;
  birimUcret: number | null;
  toplamUcret: number | null;
  dersDurumu: DersDurumuOzet | null;
  icerikYoneticisiId: number | null;
  projeYoneticisiId: number | null;
  materyalGelistiriciId: number | null;
  grafikDuzenleyiciId: number | null;
  medyaSorumluId: number | null;
  eklemeTarihi: string | null; // LocalDate -> ISO 8601 string (yyyy-MM-dd)
  ekleyenKullanici: KullaniciOzet | null;
  guncellemeTarihi: string | null; // LocalDate -> ISO 8601 string (yyyy-MM-dd)
  guncelleyenKullanici: KullaniciOzet | null;
}
