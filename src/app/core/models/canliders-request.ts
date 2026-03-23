export interface CanliDersRequest {
  adi: string;
  version?: number;
  dersId?: number;
  amaci?: string;
  turuKodu?: string;
  seviyesiKodu?: string;
  niteligiKodu?: string;
  hedefKitleEgitimSeviyeKodu?: string;
  ilgiAlaninaGoreHedefKitle?: string;
  kullanilacakProgramlar?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  sartlar?: string;
  ozeti?: string;
  suresi?: number;
  baglantiAdresi?: string;
  baslamaTarihi?: string;
  bitisTarihi?: string;
  kontenjan?: number;
  katilimSayisi?: number;
  durumKodu?: string;
}
