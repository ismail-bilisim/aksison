import { KullaniciOzet } from './kullanici-ozet';

export interface StandartResponse {
  id: number;
  version: number;
  maddeNo: number;
  maddeAdi: string;
  icerikSurum: number;
  icerik: string | null;
  durumu: string;
  yururlukteMi: boolean;
  ekleyenKullanici: KullaniciOzet | null;
  eklemeTarihi: string | null;
  degistireKullanici: KullaniciOzet | null;
  degistirmeTarihi: string | null;
  onaylayan: KullaniciOzet | null;
  onayTarihi: string | null;
}
