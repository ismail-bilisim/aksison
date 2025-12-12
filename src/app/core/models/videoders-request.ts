export interface VideoDersRequest {
  adi: string;
  version?: number;
  tahminiDersSuresi?: number;
  tahminiDersTeslimTarihi?: string; // LocalDate -> ISO string (yyyy-MM-dd)
  baslamaTarihi?: string;           // LocalDate -> ISO string
  dersTeslimTarihi?: string;       // LocalDate -> ISO string
  amaci?: string;
  turuKodu?: string;
  seviyesiKodu?: string;
  niteligiKodu?: string;
  hedefKitleEgitimSeviyeKodu?: string; 
  ilgiAlaninaGoreHedefKitle?: string;
  kullanilacakProgramlar?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  dersOzeti?: string;
  dersCekimYontemKodu?: string;       // 
  portalAdresi?: string;
  onayDurumu?: string;
  paydasId?: number;
  odemeKaynakKodu?: string;
  birimUcret?: number;             // BigDecimal -> number
  toplamUcret?: number;            // BigDecimal -> number
  durumKodu?: string;
  dersId?: number;
}