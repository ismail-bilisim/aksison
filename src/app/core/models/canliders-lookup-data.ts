import { DersTuru } from './ders-turu';
import { DersSeviyesi } from './ders-seviyesi';
import { DersNiteligi } from './ders-niteligi';
import { DersOzet } from './ders-ozet';
import { HedefKitleEgitimSeviyesiResponse } from './hedef-kitle-egitim-seviyesi-response';
import { OdemeKaynak } from './odemekaynak';

export interface CanlidersLookupData {
  dersTurleri: DersTuru[];
  dersSeviyeleri: DersSeviyesi[];
  dersNitelikleri: DersNiteligi[];
  hedefKitleEgitimSeviyeleri: HedefKitleEgitimSeviyesiResponse[];
  odemeKaynaklari: OdemeKaynak[];
  dersler: DersOzet[];
}
