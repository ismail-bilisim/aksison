// LocalDateTime -> ISO 8601 string format (e.g., "2026-01-20T14:30:00")
export interface YuzyuzeDersRequest {
  adi: string;
  kodu?: number;
  dersKodu?: number;
  version?: number;
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
  dersSuresi?: number;
  baslamaTarihi?: string; // LocalDateTime -> ISO 8601 string
  bitisTarihi?: string; // LocalDateTime -> ISO 8601 string
  egitimYeri?: string;
  sehir?: string;
  kontenjan?: number;
  tamamlayanSayisi?: number;
  basvuruSayisi?: number;
  paydasId?: number;
  odemeKaynak?: string;
  birimUcret?: number; // BigDecimal -> number
  toplamUcret?: number; // BigDecimal -> number
  durumKodu?: string;
  icerikYoneticisiId?: number;
  projeYoneticisiId?: number;
  materyalGelistiriciId?: number;
  grafikDuzenleyiciId?: number;
  medyaSorumluId?: number;
}
