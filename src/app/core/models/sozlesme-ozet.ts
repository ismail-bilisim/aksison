import { EgitmenOzet } from './egitmen-ozet';

export interface SozlesmeOzet {
  id: number;
  version: number;
  egitmen: EgitmenOzet;
  baslangicTarihi: string;
  imzaTarihi: string;
  dosyaAdi: string;
}
