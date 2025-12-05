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
  hedefKitleEgitimSeviye?: number; // BigDecimal -> number
  ilgiAlaninaGoreHedefKitle?: string;
  kullanilacakProgramlar?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  dersOzeti?: string;
  dersCekimYontemi?: number;       // BigDecimal -> number
  portalAdresi?: string;
  onayDurumu?: string;
  paydasId?: number;
  odemeKaynak?: string;
  birimUcret?: number;             // BigDecimal -> number
  toplamUcret?: number;            // BigDecimal -> number
  durumKodu?: string;
  dersId?: number;
}