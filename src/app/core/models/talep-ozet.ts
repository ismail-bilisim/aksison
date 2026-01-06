import { TalepDurumuOzet } from './talep-durumu';

export interface TalepOzet {
  id: number;
  talepTarihi: string; // ISO string
  talepSahibi: string;
  talepIcerik: string;
  talepDurumu: TalepDurumuOzet;
}
