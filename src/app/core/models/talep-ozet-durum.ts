import { TalepDurumuOzet } from './talep-durumu';
import { TalepOzet } from './talep-ozet';

export interface TalepOzetDurum extends TalepOzet{
  talepDurumu: TalepDurumuOzet;
}
