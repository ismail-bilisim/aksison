export interface Ders {
  id?: number;
  version?: number;
  kodu?: number;
  adi: string;
  icerikSurum?: number;
  tahminiDersSuresi?: number;
  amaci?: string;
  turuKodu?: string;
  seviyesiKodu?: string;
  niteligiKodu?: string;
  hedefKitleEgitimSeviye?: number;
  ilgiAlaninaGoreHedefKitle?: string;
  kullanilacakProgramlar?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  dersOzeti?: string;
  onayDurumu?: string;
  icerikYoneticisiId?: number;
  eklemeTarihi?: string;
  guncellemeTarihi?: string;
  turu?: import('./ders-turu').DersTuru;
  seviyesi?: import('./ders-seviyesi').DersSeviyesi;
  niteligi?: import('./ders-niteligi').DersNiteligi;
}
