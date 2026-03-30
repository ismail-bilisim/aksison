import { KullaniciOzet } from './kullanici-ozet';

/**
 * Prensip, Standart ve SurecAdim log kayıtları için ortak response model.
 */
export interface MaddeLogResponse {
  id: number;
  kaynakId: number;
  maddeNo: number;
  maddeAdi: string;
  icerikSurum: number;
  icerik: string | null;
  durumu: string;
  yururlukteMi: boolean;
  islemTuru: string;
  islemYapan: KullaniciOzet | null;
  logTarihi: string;
}
