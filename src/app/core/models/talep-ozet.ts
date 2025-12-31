import { TalepKonusuOzet } from './talep-konusu';
import { TalepDurumuOzet } from './talep-durumu';

export interface TalepOzet {
  id: number;
  talepTarihi: string; // ISO string
  talepKonusu: TalepKonusuOzet;
  talepIcerik: string;
  talepDurumu: TalepDurumuOzet;
}
