import { TalepDurumuOzet } from './talep-durumu';
import { TalepOzet } from './talep-ozet';
import { TalepKonusuOzet } from './talep-konusu';  // ← YENİ IMPORT

export interface TalepOzetDurum extends TalepOzet {
  talepDurumu: TalepDurumuOzet;
  talepKonusu: TalepKonusuOzet;  // ← YENİ ALAN
}
