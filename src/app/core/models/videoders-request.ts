export interface VideoDersRequest {
  adi: string;
  version?: number;
  tahminiDersSuresi?: number;
  tahminiDersTeslimTarihi?: string; // LocalDate -> ISO string (yyyy-MM-dd)
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
  dersCekimYontemKodu?: string;
  onayDurumu?: string;
  paydasId?: number;
  dersId?: number;
}