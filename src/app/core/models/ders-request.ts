// Response - API'den dönen tam veri
// Request - API'ye gönderilecek veri (Create ve Update için)
export interface DersRequest {
  adi: string;
  amaci?: string;
  turuKodu: string;
  seviyesiKodu: string;
  niteligiKodu: string;
  tahminiDersSuresi?: number;
  dersOzeti?: string;
  hedefKitleEgitimSeviye?: string;
  ilgiAlaninaGoreHedefKitle?: string;
  kullanilacakProgramlar?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  onayDurumu?: string;
}

