import { EgitmenOzet } from './egitmen-ozet';
import { DersOzet } from './ders-ozet';

export interface SozlesmeVideoDersResponse {
  id: number;
  version: number;
  egitmen: EgitmenOzet;
  ders: DersOzet;
  baslangicTarihi: string;
  imzaTarihi: string | null;
  sozlesmeDetails: string;
  dosyaAdi: string | null;
  dosyaYolu: string | null;
  dosyaBoyutu: number | null;
  mimeType: string | null;
  ekleyenKullaniciId: number | null;
  eklemeTarihi: string;
}
