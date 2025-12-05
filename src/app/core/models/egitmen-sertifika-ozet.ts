import { EgitmenOzet } from './egitmen-ozet';

export interface EgitmenSertifikaOzet {
  id: number;
  version: number;
  egitmen: EgitmenOzet;
  sertifikaAdi: string;
  alinisTarihi: string;
  aktifMi: boolean;
}
